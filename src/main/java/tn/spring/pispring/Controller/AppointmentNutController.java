package tn.spring.pispring.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.spring.pispring.Entities.AppointmentNut;
import tn.spring.pispring.Entities.Availability;
import tn.spring.pispring.Interfaces.AppointmentNutInterface;
import tn.spring.pispring.Interfaces.AvailabilityInterface;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor


@CrossOrigin("http://localhost:4200")

@RestController
public class AppointmentNutController {
    private final AppointmentNutInterface appointmentService;
    AvailabilityInterface availabilityInterface;



    @GetMapping("/getAllAppointments")
    public List<AppointmentNut> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/getAppointmentById/{id}")
    public ResponseEntity<AppointmentNut> getAppointmentById(@PathVariable("id") Long appointmentId) {
        Optional<AppointmentNut> appointment = appointmentService.getAppointmentById(appointmentId);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/createAppointment")
    public ResponseEntity<AppointmentNut> createAppointment(@RequestBody AppointmentNut appointment) {
        AppointmentNut createdAppointment = appointmentService.createAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
    }

    @PutMapping("/updateAppointment/{id}")
    public ResponseEntity<AppointmentNut> updateAppointment(@PathVariable("id") Long appointmentId,
                                                            @RequestBody AppointmentNut updatedAppointment) {
        AppointmentNut result = appointmentService.updateAppointment(appointmentId, updatedAppointment);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteAppointment/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable("id") Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assignAvailability/{appointmentId}/toAvailability/{availabilityId}")
    public ResponseEntity<AppointmentNut> assignAvailabilityToAppointment(@PathVariable("appointmentId") Long appointmentId,
                                                                          @PathVariable("availabilityId") Long availabilityId) {
        Optional<Availability> availability = availabilityInterface.getAvailabilityById(availabilityId);
        if (availability.isPresent()) {
            AppointmentNut result = appointmentService.assignAvailability(appointmentId, availabilityId);
            if (result != null) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/assignUser/{appointmentId}/toUser/{userId}")
    public ResponseEntity<AppointmentNut> assignUserToAppointment(@PathVariable("appointmentId") Long appointmentId,
                                                                  @PathVariable("userId") Long userId,@RequestBody Availability availability) {
        AppointmentNut result = appointmentService.assignAvailability( appointmentId, availability.getAvailabilityId());
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/createAppointmentForNutritionist/{nutritionistId}")
    public ResponseEntity<AppointmentNut> createAppointmentForNutritionist(@RequestBody AppointmentNut appointment,
                                                                           @PathVariable("nutritionistId") Long nutritionistId) {
        try {
            // Créez l'appointment pour le nutritionniste spécifié
            AppointmentNut createdAppointment = appointmentService.createAppointmentForNutritionist(appointment, nutritionistId);
            // Retournez la réponse avec l'appointment créé et le code de statut 201 (Created)
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (IllegalArgumentException e) {
            // Si des données invalides sont fournies, retournez une réponse avec le message d'erreur approprié et le code de statut 400 (Bad Request)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // Si une erreur inattendue se produit, retournez une réponse avec le message d'erreur et le code de statut 500 (Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/date")
    public ResponseEntity<List<AppointmentNut>> getAppointmentsForDate(@RequestParam("date") String date) {
        List<AppointmentNut> appointments = appointmentService.getAppointmentsForDate(date);
        return ResponseEntity.ok().body(appointments);
    }
    @GetMapping("/sendReminders")
    public String sendReminders() {
        // Appelez la méthode du service pour envoyer les rappels SMS
        appointmentService.sendReminders();
        return "Rappels envoyés avec succès";
    }


}

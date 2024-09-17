package tn.spring.pispring.Services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import tn.spring.pispring.Entities.AppointmentNut;
import tn.spring.pispring.Entities.Availability;
import tn.spring.pispring.Entities.User;
import tn.spring.pispring.Interfaces.AppointmentNutInterface;
import tn.spring.pispring.Interfaces.FoodInterface;
import tn.spring.pispring.Interfaces.TwilioSmsServiceI;
import tn.spring.pispring.Repositories.AppointmentNutRepo;
import tn.spring.pispring.Repositories.AvailabilityRepo;
import tn.spring.pispring.Repositories.UserRepo;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AppointmentNutService implements AppointmentNutInterface {
    AppointmentNutRepo appointmentRepository;
    UserRepo userRepository;
    AvailabilityRepo availabilityRepo;
    @Autowired
    TwilioSmsServiceI twilioSmsServiceI;
    @Override
    public List<AppointmentNut> getAllAppointments() {
        return appointmentRepository.findAll();
    }
   @Override
    public Optional<AppointmentNut> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }
    @Override
    public AppointmentNut createAppointment(AppointmentNut appointment) {
        return appointmentRepository.save(appointment);
    }
@Override
    public AppointmentNut updateAppointment(Long appointmentId, AppointmentNut appointmentDetails) {
        Optional<AppointmentNut> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isPresent()) {
            AppointmentNut existingAppointment = optionalAppointment.get();
            existingAppointment.setDate_app(appointmentDetails.getDate_app());
            existingAppointment.setTime(appointmentDetails.getTime());
            existingAppointment.setClient(appointmentDetails.getClient());
            existingAppointment.setNutritionist(appointmentDetails.getNutritionist());
            existingAppointment.setAvailability(appointmentDetails.getAvailability());
            return appointmentRepository.save(existingAppointment);
        } else {
            return null;
        }
    }
  @Override
    public void deleteAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    // Méthode pour affecter un rendez-vous à une disponibilité spécifique
    @Override
    public AppointmentNut assignAvailability(Long appointmentId, Long availabilityId) {
        Optional<AppointmentNut> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isPresent()) {
            AppointmentNut appointment = optionalAppointment.get();
            // Supposons que vous ayez une méthode dans votre repository pour récupérer une disponibilité par son ID
            Availability availability = availabilityRepo.findById(availabilityId).orElse(null);
            if (availability != null) {
                appointment.setAvailability(availability);
                return appointmentRepository.save(appointment);
            } else {
                return null; // Gérer le cas où la disponibilité n'est pas trouvée
            }
        } else {
            return null; // Gérer le cas où le rendez-vous n'est pas trouvé
        }
    }
    public AppointmentNut assignAppointmentToUser(Long appointmentId, Long userId) {
        // Recherche de l'objet AppointmentNut par son ID
        Optional<AppointmentNut> optionalAppointment = appointmentRepository.findById(appointmentId);

        // Vérifier si l'objet AppointmentNut est présent
        if (optionalAppointment.isPresent()) {
            AppointmentNut appointment = optionalAppointment.get();

            // Recherche de l'objet User par son ID
            Optional<User> optionalUser = userRepository.findById(userId);

            // Vérifier si l'objet User est présent
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                // Assigner le rendez-vous à l'utilisateur
                appointment.setClient(user);

                // Enregistrer les modifications dans la base de données et retourner l'objet AppointmentNut mis à jour
                return appointmentRepository.save(appointment);
            } else {
                // Gérer le cas où l'objet User n'est pas trouvé
                // Vous pouvez lever une exception, retourner null ou effectuer toute autre action appropriée
                return null;
            }
        } else {
            // Gérer le cas où l'objet AppointmentNut n'est pas trouvé
            // Vous pouvez lever une exception, retourner null ou effectuer toute autre action appropriée
            return null;
        }
    }
    @Override
    public AppointmentNut createAppointmentForNutritionist(AppointmentNut appointment, Long nutritionistId) {
        // Assurez-vous que l'appointment n'est pas nul et que l'ID du nutritionniste est valide
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment cannot be null");
        }
        if (nutritionistId == null || nutritionistId <= 0) {
            throw new IllegalArgumentException("Invalid nutritionist ID");
        }

        // Vous pouvez également ajouter ici des vérifications supplémentaires sur l'appointment

        // Assurez-vous d'associer l'appointment au bon nutritionniste en utilisant son ID
        appointment.getNutritionist().setId(nutritionistId);

        // Enregistrez l'appointment dans la base de données
        return appointmentRepository.save(appointment);
    }
    @Override
    public List<AppointmentNut> getAppointmentsForDate(String date) {
        // Implémentez la logique pour récupérer les rendez-vous pour une date spécifique
        // par exemple, en utilisant une méthode findByDate dans votre repository
        return appointmentRepository.findByDate(date);
    }


    @Override
    @Scheduled(fixedRate = 300000) // Toutes les 5 minutes
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesLater = now.plusMinutes(5);

        List<AppointmentNut> appointments = getAppointmentsForTimeRange(now, fiveMinutesLater);

        for (AppointmentNut appointment : appointments) {
            sendReminders(appointment);
        }

    }

    public List<AppointmentNut> getAppointmentsForTimeRange(LocalDateTime start, LocalDateTime end) {
        List<AppointmentNut> allAppointments = getAllAppointments();
        List<AppointmentNut> appointmentsInRange = new ArrayList<>();

        for (AppointmentNut appointment : allAppointments) {
            LocalDateTime appointmentDateTime = LocalDateTime.parse(appointment.getDate_app() + " " + appointment.getTime(), DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            if (appointmentDateTime.isAfter(start) && appointmentDateTime.isBefore(end)) {
                appointmentsInRange.add(appointment);
            }
        }

        return appointmentsInRange;
    }


    public void sendReminders(AppointmentNut appointment) {
        String message = "Appointment Reminder: You have an appointment scheduled for " + appointment.getTime() + ".";
        twilioSmsServiceI.sendSms(appointment.getClient().getNumber(), message);
    }

}









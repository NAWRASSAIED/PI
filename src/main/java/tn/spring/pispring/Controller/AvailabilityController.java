package tn.spring.pispring.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.spring.pispring.Entities.Availability;
import tn.spring.pispring.Interfaces.AvailabilityInterface;
import tn.spring.pispring.Services.AvailabilityService;

import java.util.List;

@AllArgsConstructor


@CrossOrigin("http://localhost:4200")

@RestController
public class AvailabilityController {
    private final AvailabilityInterface availabilityService;


    @GetMapping("/availabilities")
    public ResponseEntity<List<Availability>> getAvailabilitiesForDate(@RequestParam String date) {
        try {
            List<Availability> availabilities = availabilityService.getAvailabilitiesForDate(date);
            return ResponseEntity.ok(availabilities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/retrieveAvailabilities")
    public List<Availability> getAllAvailabilities() {
        return availabilityService.getAllAvailabilities();
    }

    @PostMapping("/createAvailability")
    public ResponseEntity<Availability> addAvailability(@RequestBody Availability availability) {
        Availability createdAvailability = availabilityService.createAvailability(availability);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAvailability);
    }

    @DeleteMapping("/deleteAvailability/{id}")
    public ResponseEntity<Void> removeAvailability(@PathVariable("id") Long availabilityId) {
        availabilityService.deleteAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateAvailability/{id}")
    public ResponseEntity<Availability> updateAvailability(@PathVariable("id") Long availabilityId,
                                                           @RequestBody Availability updatedAvailability) {
        Availability result = availabilityService.updateAvailability(availabilityId, updatedAvailability);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/assignNutritionist/{availabilityId}/toUser/{userId}")
    public ResponseEntity<Availability> assignNutritionistToAvailability(@PathVariable("availabilityId") Long availabilityId,
                                                                         @PathVariable("userId") Long userId) {
        Availability result = availabilityService.assignNutritionistToAvailability(availabilityId, userId);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

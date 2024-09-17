package tn.spring.pispring.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.spring.pispring.Entities.Availability;
import tn.spring.pispring.Entities.User;
import tn.spring.pispring.Interfaces.AvailabilityInterface;
import tn.spring.pispring.Repositories.AvailabilityRepo;
import tn.spring.pispring.Repositories.UserRepo;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AvailabilityService implements AvailabilityInterface {
    private final AvailabilityRepo availabilityRepository;
   UserRepo UserRepo;

   @Override
    public List<Availability> getAllAvailabilities() {
        return availabilityRepository.findAll();
    }

    @Override
    public Optional<Availability> getAvailabilityById(Long availabilityId) {
        return availabilityRepository.findById(availabilityId);
    }
    @Override
    public Availability createAvailability(Availability availability) {
        return availabilityRepository.save(availability);
    }
    @Override
    public Availability updateAvailability(Long availabilityId, Availability newAvailability) {
        return availabilityRepository.findById(availabilityId)
                .map(availability -> {
                    availability.setDate_av(newAvailability.getDate_av());
                    availability.setStartTime(newAvailability.getStartTime());
                    availability.setEndTime(newAvailability.getEndTime());
                    availability.setNutritionist(newAvailability.getNutritionist());
                    return availabilityRepository.save(availability);
                })
                .orElse(null);
    }
    @Override
    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }
    @Override
    public Availability assignNutritionistToAvailability(Long availabilityId, Long nutritionistId) {
        Optional<Availability> optionalAvailability = availabilityRepository.findById(availabilityId);
        if (optionalAvailability.isPresent()) {
            Availability availability = optionalAvailability.get();

            // Assuming nutritionistId corresponds to the ID of the nutritionist User
            // Retrieve the nutritionist from the database
            Optional<User> optionalNutritionist = UserRepo.findById(nutritionistId);
            if (optionalNutritionist.isPresent()) {
                User nutritionist = optionalNutritionist.get();

                // Assign the nutritionist to the availability
                availability.setNutritionist(nutritionist);

                // Save the updated availability
                return availabilityRepository.save(availability);
            } else {
                // Handle case where nutritionist is not found
                return null; // Or throw an exception, return appropriate response, etc.
            }
        } else {
            // Handle case where availability is not found
            return null; // Or throw an exception, return appropriate response, etc.
        }
    }
@Override
    public List<Availability> getAvailabilitiesForDate(String date) {

        return availabilityRepository.findByDateAv(date);
    }
}

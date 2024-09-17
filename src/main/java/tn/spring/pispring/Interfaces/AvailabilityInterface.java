package tn.spring.pispring.Interfaces;

import tn.spring.pispring.Entities.Availability;

import java.util.List;
import java.util.Optional;

public interface AvailabilityInterface {
    public List<Availability> getAllAvailabilities();
    public Optional<Availability> getAvailabilityById(Long availabilityId);
    public Availability createAvailability(Availability availability);
    public Availability updateAvailability(Long availabilityId, Availability newAvailability);
    public void deleteAvailability(Long availabilityId);
    public Availability assignNutritionistToAvailability(Long availabilityId, Long nutritionistId);
    public List<Availability> getAvailabilitiesForDate(String date);
}

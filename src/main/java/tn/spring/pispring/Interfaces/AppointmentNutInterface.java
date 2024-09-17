package tn.spring.pispring.Interfaces;

import tn.spring.pispring.Entities.AppointmentNut;
import tn.spring.pispring.Entities.Availability;

import java.util.List;
import java.util.Optional;

public interface AppointmentNutInterface {
    public List<AppointmentNut> getAllAppointments();
    public Optional<AppointmentNut> getAppointmentById(Long appointmentId);
    public AppointmentNut createAppointment(AppointmentNut appointment);
    public AppointmentNut updateAppointment(Long appointmentId, AppointmentNut appointmentDetails);
    public void deleteAppointment(Long appointmentId);
    public AppointmentNut assignAvailability(Long appointmentId, Long availabilityId);
    public AppointmentNut createAppointmentForNutritionist(AppointmentNut appointment, Long nutritionistId);
    public List<AppointmentNut> getAppointmentsForDate(String date);
    public void sendReminders();
}

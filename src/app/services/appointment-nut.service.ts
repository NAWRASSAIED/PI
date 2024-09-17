import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AppointmentNut } from '../models/AppointmentNut';
import { Availability } from '../models/Availability';
// Importer l'interface AppointmentNut

@Injectable({
  providedIn: 'root'
})
export class AppointmentNutService {
  private baseUrl = 'http://localhost:8070'; // URL de votre backend Spring Boot

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<AppointmentNut[]> {
    return this.http.get<AppointmentNut[]>(`${this.baseUrl}/getAllAppointments`);
  }

  getAppointmentById(appointmentId: number): Observable<AppointmentNut> {
    return this.http.get<AppointmentNut>(`${this.baseUrl}/getAppointmentById/${appointmentId}`);
  }

  createAppointment(appointment: AppointmentNut): Observable<AppointmentNut> {
    return this.http.post<AppointmentNut>(`${this.baseUrl}/createAppointment`, appointment);
  }

  updateAppointment(appointmentId: number, updatedAppointment: AppointmentNut): Observable<AppointmentNut> {
    return this.http.put<AppointmentNut>(`${this.baseUrl}/updateAppointment/${appointmentId}`, updatedAppointment);
  }

  deleteAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteAppointment/${appointmentId}`);
  }

  assignAvailabilityToAppointment(appointmentId: number, availabilityId: number): Observable<AppointmentNut> {
    return this.http.post<AppointmentNut>(`${this.baseUrl}/assignAvailability/${appointmentId}/toAvailability/${availabilityId}`, null);
  }

  assignUserToAppointment(appointmentId: number, userId: number, availability: Availability): Observable<AppointmentNut> {
    return this.http.post<AppointmentNut>(`${this.baseUrl}/assignUser/${appointmentId}/toUser/${userId}`, availability);
  }
  createAppointmentForNutritionist(appointment: AppointmentNut, nutritionistId: number): Observable<AppointmentNut> {
    const url = `${this.baseUrl}/createAppointmentForNutritionist/${nutritionistId}`;
    return this.http.post<AppointmentNut>(url, appointment);
  }
  getAppointmentsForDate(date: string): Observable<AppointmentNut[]> {
    const url = `${this.baseUrl}/date?date=${date}`;
    return this.http.get<AppointmentNut[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return [];
      })
    );
  }
  rateNutritionist(userId: number, rating: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/rate?rating=${rating}`;
    return this.http.patch(url, {});
  }
  sendReminders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sendReminders`);
  }
}

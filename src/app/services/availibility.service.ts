import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability } from '../models/Availability';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailibilityService {
  private baseUrl: string = 'http://localhost:8070';
  constructor(private http: HttpClient) { }

  getAllAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.baseUrl}/retrieveAvailabilities`);
  }

  createAvailability(availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${this.baseUrl}/createAvailability`, availability);
  }

  updateAvailability(availabilityId: number, updatedAvailability: Availability): Observable<Availability> {
    return this.http.put<Availability>(`${this.baseUrl}/updateAvailability/${availabilityId}`, updatedAvailability);
  }

  deleteAvailability(availabilityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteAvailability/${availabilityId}`);
  }

  assignNutritionistToAvailability(availabilityId: number, userId: number): Observable<Availability> {
    return this.http.post<Availability>(`${this.baseUrl}/assignNutritionist/${availabilityId}/toUser/${userId}`, null);
  }
  getAvailabilitiesForDate(date: string): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.baseUrl}/availabilities?date=${date}`);
  }
}

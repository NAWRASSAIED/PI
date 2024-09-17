import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SmsRequest } from '../models/SmsRequest';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  private apiUrl = 'http://localhost:8070/send-sms'; // Mettez ici l'URL de votre backend

  constructor(private http: HttpClient) { }

  sendSms(smsRequest: SmsRequest): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl, smsRequest, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<any> {
    console.error('Error sending SMS:', error);
    return throwError(error); // Correction de l'erreur
  }
}

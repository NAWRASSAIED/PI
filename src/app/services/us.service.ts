import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/Entities/User';


@Injectable({
  providedIn: 'root'
})
export class UsService {

  private baseUrl = 'http://localhost:8070';

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/us/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/updateuser`, user);
  }
  getNutritionistsByRating(minRating: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/rating/${minRating}`);
  }

}


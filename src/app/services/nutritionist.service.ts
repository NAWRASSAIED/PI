import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/Entities/User';

@Injectable({
  providedIn: 'root'
})
export class NutritionistService {
  getNutritionistsByRating(minRating: number) {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string = 'http://localhost:8070';

  constructor(private http: HttpClient) { }

  getAllNutritionists(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/nutritionists`);
  }

  getNutritionistById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/nutritionists/${userId}`);
  }
}

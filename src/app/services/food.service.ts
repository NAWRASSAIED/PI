import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/Food';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl: string = 'http://localhost:8070';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  retrieveFood(): Observable<Food[]> {
    return this.http.get<Food[]>(this.baseUrl + '/retrieveFood');
  }
  addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(this.baseUrl + '/createfood', food);
  }
 // Méthode pour récupérer une nourriture par son ID
 getFoodById(foodId: number): Observable<Food> {
  return this.http.get<Food>(`${this.baseUrl}/retrieveFood/${foodId}`);
}
// Méthode pour mettre à jour une nourriture
updateFood(foodId: number, updatedFood: Food): Observable<Food> {
  return this.http.put<Food>(`${this.baseUrl}/updateFood/${foodId}`, updatedFood);
}
getFoodDetails(foodName: string): Observable<Food> {
  return this.http.get<Food>(`${this.baseUrl}/food-details/${foodName}`);
}


  deleteFood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteFood/${id}`);
  }

  getCaloriesForFood(foodName: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/calories/${foodName}`);
  }
  getNutritionAdvice(goal: string): Observable<Food[]> {
    const params = new HttpParams().set('goal', goal);
    return this.http.get<Food[]>(this.baseUrl, { params });
  }
  importExcel(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post<any>(`${this.baseUrl}/import/excel`, formData, { headers });
  }
  
  
}

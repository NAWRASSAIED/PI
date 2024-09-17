import { Component } from '@angular/core';
import { FoodService } from '../services/food.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})
export class AddFoodComponent {
  constructor(private foodService: FoodService) { }
 selectedFileName: string = '';
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0] as File;
    this.selectedFileName = selectedFile.name; // Update the selectedFileName variable
    this.importExcel(selectedFile);
  }

  importExcel(file: File): void {
    if (file) {
      this.foodService.importExcel(file).subscribe(
        (response: HttpResponse<any>) => {
          console.log('Response from server:', response);
          if (response && response.body && response.body.message) {
            alert(response.body.message);
          } 
        },
        (error: HttpErrorResponse) => {
          console.error('Failed to upload Excel file:', error);
          if (error.error && error.error.message) {
            alert('Failed to upload Excel file: ' + error.error.message);
          } else {
            alert('An unexpected error occurred. Please try again later.');
          }
        }
      );
    } else {
      alert('Please select a file to upload.');
    }
  }


}

















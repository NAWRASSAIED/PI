import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Food } from 'src/app/models/Food';
import { FoodService } from 'src/app/services/food.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFoodComponent } from 'src/app/add-food/add-food.component';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  foods: Food[] = [];
  dataSource: MatTableDataSource<Food> = new MatTableDataSource<Food>();
  displayedColumns: string[] = ['namefood', 'calories_per_serving', 'protein_per_serving', 'carbohydrates_per_Serving', 'fat_per_Serving', 'fiber_per_Serving', 'vitamins_per_Serving', 'minerals_per_Serving', 'actions'];
  selectedColumn: keyof Food = 'namefood'; // Utilisation de keyof pour garantir que la propriété existe
  isAscending: boolean = true;
  selectedFileName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private foodService: FoodService,private dialog: MatDialog) { }
 
  openAddFoodModal(): void {
    const modal = document.getElementById('addFoodModal');
    if (modal) {
      modal.style.display = 'block'; // Affiche le modal en modifiant les styles
    }
  }
  
  closeAddFoodModal(): void {
    const modal = document.getElementById('addFoodModal');
    if (modal) {
      modal.style.display = 'none'; // Cache le modal en modifiant les styles
    }}
 
  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.retrieveFood().subscribe(
      (foods: Food[]) => {
        this.foods = foods;
        this.applySorting();
        this.dataSource.data = this.foods;
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        console.error('Error retrieving foods:', error);
      }
    );
  }
  sort(column: string): void {
    if (column === 'calories_per_serving') {
      if (this.selectedColumn === column) {
        this.isAscending = !this.isAscending;
      } else {
        this.isAscending = true;
      }
      this.selectedColumn = column;
      this.applySorting();
    }
  }
  

  
  applySorting(): void {
    this.foods.sort((a, b) => {
      let valA: number | string = this.getValue(a);
      let valB: number | string = this.getValue(b);

      // Convertir les valeurs en nombres si elles ne sont pas déjà des nombres
      valA = typeof valA === 'string' ? parseFloat(valA) : valA;
      valB = typeof valB === 'string' ? parseFloat(valB) : valB;

      return this.isAscending ? valA - valB : valB - valA;
    });
    this.dataSource.data = this.foods;
}

getValue(food: Food): string | number {
  if (this.selectedColumn === 'calories_per_serving') {
    return food.calories_per_serving;
  } else {
    const value = food[this.selectedColumn];
    return typeof value === 'number' ? value : String(value);
  }
}

  goToUpdatePage(food: Food): void {
    this.router.navigate(['/updateFood', food.idFood]);
  }

  deleteFood(food: Food): void {
    this.foodService.deleteFood(food.idFood).subscribe(
      () => {
        console.log('Food deleted successfully');
        // Réactualisez la liste des aliments après la suppression
        this.loadFoods();
      },
      (error: any) => {
        console.error('Error deleting food:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0] as File;
    this.selectedFileName = selectedFile.name; // Update the selectedFileName variable
    this.importExcel(selectedFile);
  }


  importExcel(file: File): void {
    if (file) {
      this.foodService.importExcel(file).subscribe(
        (response) => {
          console.log('Excel file uploaded successfully:', response);
          alert('Excel file uploaded successfully.');
        },
        (error) => {
          console.error('Failed to upload Excel file:', error);
          alert('Failed to upload Excel file. Please try again.');
        }
      );
    } else {
      alert('Please select a file to upload.');
    }
  }
}










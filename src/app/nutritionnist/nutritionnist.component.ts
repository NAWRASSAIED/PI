import { Component, OnInit } from '@angular/core';
import { User } from 'src/Entities/User';
import { NutritionistService } from '../services/nutritionist.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsService } from '../services/us.service';

@Component({
  selector: 'app-nutritionnist',
  templateUrl: './nutritionnist.component.html',
  styleUrls: ['./nutritionnist.component.css']
})
export class NutritionnistComponent implements OnInit {
  
  nutritionists: User[] = [];
  filteredNutritionists: User[] = []; 
  minRating: number = 0; 
  chunkedNutritionists: User[][] = [];
 

  constructor(private nutritionistService: NutritionistService, private router: Router, private http: HttpClient,private usService:UsService) { }

  ngOnInit(): void {
    this.getNutritionistsByRating();
  }
  getNutritionistsByRating(): void {
    this.usService.getNutritionistsByRating(this.minRating)
      .subscribe((nutritionists: User[]) => {
        // Trier les nutritionnistes par note (rating) décroissante
        this.nutritionists = nutritionists.sort((a, b) => b.rating - a.rating);
      });
  }
  displayRating(rating: number): string {
    const roundedRating = Math.round(rating * 2) / 2; // Arrondir le rating à la demi-étoile la plus proche
    const fullStars = Math.floor(roundedRating); // Nombre d'étoiles pleines
    const halfStar = roundedRating % 1 !== 0; // Vérifier s'il y a une demi-étoile
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Nombre d'étoiles vides

    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars); // Construction de la chaîne d'étoiles
  }
  
  navigateToAddAppointment(userId: number): void {
    this.router.navigate(['/addAppointment', userId]); 
  }

  
  
}

import { Component, OnInit } from '@angular/core';
import { NutritionTracking } from '../models/NutritionTracking';
import { NutritionTrackingService } from '../services/nutrition-tracking.service';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Food } from '../models/Food';
import { FoodService } from '../services/food.service';
import { NotificationService } from '../services/notification.service';
import { NutritionalGoalService } from '../services/nutritional-goal.service';
import { NutritionalGoal } from '../models/NutritionalGoal';
import { Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

import { ActivatedRoute, Router } from '@angular/router'; // Importer Router pour la navigation
import { DailyCalorieServiceService } from '../services/daily-calorie-service.service';

@Component({
  selector: 'app-listrack',
  templateUrl: './listrack.component.html',
  styleUrls: ['./listrack.component.css']
})
export class ListrackComponent implements OnInit {
  
  nutritionTrackingList: NutritionTracking[] = [];
  userId: number | undefined;
  searchForm!: FormGroup;
  addNutritionTrackingForm!: FormGroup;
  consumedFoods: Food[] = [];
  dailyCalorieGoal: number = 0;
  caloriesPerServing: number | undefined;
  difference: number = 0;
  progressPercentage: number = 0;
  subscriptions: Subscription[] = [];
  myChart!: Chart;


  constructor(
    private nutritionTrackingService: NutritionTrackingService,
    private authService: UserService,
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private dailyCalorieService: DailyCalorieServiceService,
    private notificationService: NotificationService,
    private userService: UserService,
    private nutritionalgoalservice: NutritionalGoalService,
    private route: ActivatedRoute,
    private router: Router // Injecter Router pour la navigation
  ) { }

  ngOnInit(): void {
    this.createChart();
    this.updateProgressPercentage();
    this.searchForm = this.formBuilder.group({
      keyword: ['']
    });
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getLastNutritionTracking();
    } else {
      console.error('User ID is not available.');
    }
    this.addNutritionTrackingForm = this.formBuilder.group({
      foodName: ['', Validators.required],
      caloriesPerServing: [{ value: 0, disabled: true }, Validators.required],
      quantity: [1, Validators.required]
    });

    this.addNutritionTrackingForm.get('foodName')?.valueChanges.subscribe((value: string) => {
      this.fetchCaloriesPerServing(value);
    });

    this.addNutritionTrackingForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateCaloriesPerServing();
    });

    this.closeTracking();
  }

  closeTracking(): void {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const millisecondsUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      console.log('Suivi fermé automatiquement à minuit.');

      const totalCaloriesConsumed = this.consumedFoods.reduce((acc, food) => acc + food.calories_per_serving, 0);
      this.addNutritionTrackingForm.patchValue({ total_calories: totalCaloriesConsumed });
    }, millisecondsUntilMidnight);
  }
 
  addConsumedFood(): void {
    const foodName = this.addNutritionTrackingForm.value.foodName;
    const caloriesPerServing = this.caloriesPerServing || 0;
    const quantity = this.addNutritionTrackingForm.value.quantity;

    const consumedFood: Food = {
      namefood: foodName,
      calories_per_serving: caloriesPerServing * quantity,
      idFood: 0,
      protein_per_serving: 0,
      carbohydrates_per_Serving: 0,
      fat_per_Serving: 0,
      fiber_per_Serving: 0,
      vitamins_per_Serving: '',
      minerals_per_Serving: 0,
      nuttrack: new NutritionTracking()
    };

    this.consumedFoods.push(consumedFood);
    this.calculateDifference();
  }

  fetchCaloriesPerServing(foodName: string): void {
    this.foodService.getCaloriesForFood(foodName).subscribe(
      (calories: number) => {
        this.caloriesPerServing = calories;
        this.calculateCaloriesPerServing();
      },
      (error: any) => {
        console.error('Error fetching calories for food:', error);
      }
    );
  }

  calculateCaloriesPerServing(): void {
    const quantity = this.addNutritionTrackingForm.value.quantity || 1;
    this.addNutritionTrackingForm.patchValue({ caloriesPerServing: (this.caloriesPerServing || 0) * quantity });
    this.calculateDifference();
  }

  calculateDifference(): void {
    const totalCaloriesConsumed = this.consumedFoods.reduce((acc, food) => acc + food.calories_per_serving, 0);
    this.difference = this.dailyCalorieGoal - totalCaloriesConsumed;

    if (this.difference < 0) {
      this.notificationService.showNotification('Attention : Vous avez dépassé votre limite quotidienne de calories !', 'Fermer', 5000, ['alert-snackbar']);
    }
  }

  getLastNutritionTracking(): void {
    this.subscriptions.push(
      this.nutritionTrackingService.getLastNutritionTracking().subscribe(
        (data: NutritionTracking) => {
          if (data) {
            if (data.nutritiongoal) {
              const { weight, height, goal, duration, idNGoal } = data.nutritiongoal;
              this.subscriptions.push(
                this.nutritionalgoalservice.calculateDailyCalorieGoal(weight, height, goal, duration).subscribe(
                  (dailyCalorieGoal: number) => {
                    this.dailyCalorieService.setDailyCalorieGoal(dailyCalorieGoal); // Mettez à jour la valeur de dailyCalorieGoal dans le service
                    this.dailyCalorieGoal = dailyCalorieGoal;
                    this.updateProgressPercentage();
                    this.createChart();
                  },
                  (error: any) => {
                    console.error('Error calculating daily calorie goal:', error);
                  }
                )
              );
              data.nutritiongoal.idNGoal = idNGoal;
            } else {
              console.error('Nutrition goal is null.');
            }
            this.nutritionTrackingList.push(data);
          } else {
            console.error('Data is null.');
          }
        },
        (error: any) => {
          console.error('Error fetching last nutrition tracking:', error);
        }
      )
    );
  }

  onSubmit(): void {
    if (this.addNutritionTrackingForm.valid) {
      const nutritionTrackingData: NutritionTracking = this.addNutritionTrackingForm.value;
      nutritionTrackingData.consumedFoods = this.consumedFoods;
      const totalCaloriesConsumed = this.consumedFoods.reduce((acc, food) => acc + food.calories_per_serving, 0);
      nutritionTrackingData.total_calories = totalCaloriesConsumed;

      if (this.userId) {
        nutritionTrackingData.userId = this.userId;
        const idNutritionalGoal = this.nutritionTrackingList.length > 0 ? this.nutritionTrackingList[0].nutritiongoal.idNGoal : undefined;
        const defaultNutritionalGoal: NutritionalGoal = {
          idNGoal: 0,
          duration: 0,
          height: 0,
          weight: 0,
          goal: "",
          weight_goal: 0
        };
        nutritionTrackingData.nutritiongoal = defaultNutritionalGoal;
        if (idNutritionalGoal !== undefined) {
          nutritionTrackingData.nutritiongoal.idNGoal = idNutritionalGoal;
          this.nutritionTrackingService.addNutritionTracking(nutritionTrackingData).subscribe(
            (response: NutritionTracking) => {
              console.log('Nutrition tracking added successfully:', response);
              // Ajouter le suivi nutritionnel nouvellement ajouté à la liste existante
              this.nutritionTrackingList.unshift(response);
              // Réinitialiser le formulaire d'ajout de suivi nutritionnel
              this.addNutritionTrackingForm.reset();
              this.consumedFoods = [];
              // Fermer le modal
              this.closeNutritionTrackingModal();
              
              // Mettre à jour la progression et recréer le graphique
              this.updateProgressPercentage();
              this.createChart();
            },
            (error: any) => {
              console.error('Error adding nutrition tracking:', error);
            }
          );
        }}    
    } else {
      console.error('Invalid form data. Cannot add nutrition tracking.');
    }
  }

  openNutritionTrackingModal(): void {
    const modal = document.getElementById('addNutritionTrackingModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeNutritionTrackingModal(): void {
    const modal = document.getElementById('addNutritionTrackingModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  deleteNutritionTracking(id: number): void {
    this.nutritionTrackingService.deleteNutritionTracking(id).subscribe(
      () => {
        this.nutritionTrackingList = this.nutritionTrackingList.filter(tracking => tracking.idNutTrack !== id);
        console.log('Nutrition tracking deleted successfully.');
      },
      (error: any) => {
        console.error('Error deleting nutrition tracking:', error);
      }
    );
  }

  navigateToEditPage(nutritionTrackingId: number): void {
    this.router.navigate(['/updateNutritiontrack', nutritionTrackingId]);
  }

  redirectToTrackingPage(): void {
    this.router.navigate(['/addTracking', this.userId]);
  }
  
  updateProgressPercentage(): void {
    const totalCaloriesConsumed = this.nutritionTrackingList.reduce((acc, tracking) => acc + tracking.total_calories, 0);
    if (this.dailyCalorieGoal !== 0) {
      const percentage = Math.round((totalCaloriesConsumed / this.dailyCalorieGoal) * 100);
      if (percentage < 0) {
        this.progressPercentage = 0;
      } else if (percentage > 100) {
        this.progressPercentage = 100;
      } else {
        this.progressPercentage = percentage;
      }
    } else {
      this.progressPercentage = 0;
    }
  }

  onSearch(): void {
    const keyword = this.searchForm.value.keyword.trim().toLowerCase();
    this.nutritionTrackingList = this.nutritionTrackingList.filter(tracking =>
      tracking.dateNut.toLowerCase().includes(keyword) || tracking.total_calories
    );
  }

  createChart(): void {
    console.log('Nutrition tracking list:', this.nutritionTrackingList);
    console.log('Daily calorie goal:', this.dailyCalorieGoal);
  
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    if (this.myChart) {
      this.myChart.destroy();
    }
  
    const sortedTrackingList = this.nutritionTrackingList.sort((a, b) => {
      const dateA = new Date(a.dateNut);
      const dateB = new Date(b.dateNut);
      return dateA.getTime() - dateB.getTime();
    });

    const dates = sortedTrackingList.map(tracking => tracking.dateNut);
    const achievements = sortedTrackingList.map(tracking => {
      const percentage = (tracking.total_calories / this.dailyCalorieGoal) * 100;
      return percentage >= 100 ? 100 : percentage;
    });

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Progression',
          data: achievements,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointBackgroundColor: achievements.map(achievement => achievement === 100 ? 'green' : 'red'),
          pointRadius: 5
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 25
            }
          }
        }
      }
    });
  }
}



















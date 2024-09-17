import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NutritionTracking } from "../models/NutritionTracking";
import { Food } from "../models/Food";
import { NutritionTrackingService } from "../services/nutrition-tracking.service";
import { FoodService } from "../services/food.service";
import { DailyCalorieServiceService } from "../services/daily-calorie-service.service";
import { NotificationService } from "../services/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { trigger, state, style, animate, transition } from '@angular/animations'; 
import { NutritionalGoal } from "../models/NutritionalGoal";
import { NutritionalGoalService } from "../services/nutritional-goal.service";

@Component({
  selector: 'app-add-nutrition-tracking',
  templateUrl: './add-nutrition-tracking.component.html',
  styleUrls: ['./add-nutrition-tracking.component.css'],
  animations: [
    trigger('showHideSuggestions', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-50%)'
      })),
      state('shown', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => shown', animate('300ms ease-in')),
      transition('shown => hidden', animate('300ms ease-out'))
    ])
  ]
})
export class NutritionTrackComponent implements OnInit {
  addNutritionTrackingForm!: FormGroup;
  consumedFoods: Food[] = [];
  dailyCalorieGoal: number = 0;
  caloriesPerServing: number | undefined;
  difference: number = 0;
  userId!: number;
  suggestionFoods: Food[] = [];
  suggestionIcon: string = 'fas fa-bell';
  notificationDotVisible: boolean = true;
  notificationReceived: boolean = false;
  showSuggestions = 'hidden';
 
  nutritionalgoal: NutritionalGoal = {
    goal: '',
    idNGoal: 0,
    duration: 0,
    height: 0,
    weight: 0,
    weight_goal: 0
  };
  progressPercentage: number =0;


  constructor(
    private formBuilder: FormBuilder,
    private nutritionTrackingService: NutritionTrackingService,
    private foodService: FoodService,
    private dailyCalorieService: DailyCalorieServiceService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private nutritionalgoalservice: NutritionalGoalService
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.progressPercentage = (this.progressPercentage + 10) % 100; // Exemple d'incrémentation de 10% toutes les quelques secondes
    }, 2000);
   
    this.notificationReceived = true;
    this.userId = this.route.snapshot.params['userId'];
    this.addNutritionTrackingForm = this.formBuilder.group({
      foodName: ['', Validators.required],
      caloriesPerServing: [{ value: 0, disabled: true }, Validators.required],
      quantity: [1, Validators.required],
    });

    this.dailyCalorieGoal = this.dailyCalorieService.getDailyCalorieGoal();

    this.addNutritionTrackingForm.get('foodName')?.valueChanges.subscribe((value: string) => {
      this.fetchCaloriesPerServing(value);
    });

    this.addNutritionTrackingForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateCaloriesPerServing();
    });

    this.closeTracking();

    // Récupérer le dernier objectif nutritionnel
    this.nutritionalgoalservice.retrieveAllNutGoals().subscribe(
      (nutritionalGoals: NutritionalGoal[]) => {
        if (nutritionalGoals.length > 0) {
          this.nutritionalgoal = nutritionalGoals[nutritionalGoals.length - 1];
        } else {
          console.error('No nutritional goals found.');
        }
      },
      (error: any) => {
        console.error('Error fetching nutritional goals:', error);
      }
    );

    // Initialiser suggestionFoods
    this.suggestionFoods = [];
  }

  onSubmit(): void {
    if (this.addNutritionTrackingForm.valid && this.consumedFoods.length > 0) {
      // Enregistrer d'abord l'objectif nutritionnel
      this.nutritionalgoalservice.addNutritionalGoal(this.nutritionalgoal).subscribe(
        (createdNutritionalGoal: NutritionalGoal) => {
          // Récupérer l'ID de l'objectif nutritionnel nouvellement créé
          const nutritionalGoalId = createdNutritionalGoal.idNGoal;
  
          // Créer un nouvel objet NutritionTracking avec l'ID de l'objectif nutritionnel associé
          const nutritionTrackingData: NutritionTracking = {
            idNutTrack: 0,
            dateNut: new Date().toISOString(),
            total_calories: this.consumedFoods.reduce((acc, food) => acc + food.calories_per_serving, 0), // Utiliser la somme des calories consommées
            quantity: this.addNutritionTrackingForm.value.quantity,
            nutritiongoal: createdNutritionalGoal, // Utilisation de l'objectif nutritionnel créé
            consumedFoods: this.consumedFoods, // Utilisation des aliments consommés
            userId: this.userId // Utilisation de l'ID utilisateur
          };
  
          // Enregistrer le suivi nutritionnel avec l'ID de l'objectif nutritionnel associé
          this.nutritionTrackingService.addNutritionTracking(nutritionTrackingData).subscribe(
            (response: NutritionTracking) => {
              console.log('Nutrition tracking added successfully:', response);
              this.addNutritionTrackingForm.reset();
              this.consumedFoods = [];
              this.router.navigate(['/listtrack', this.userId]);
            },
            (error: any) => {
              console.error('Error adding nutrition tracking:', error);
            }
          );
        },
        (error: any) => {
          console.error('Error adding nutritional goal:', error);
        }
      );
    } else {
      console.error('Invalid form data or no consumed foods. Cannot add nutrition tracking.');
    }
  }

  closeTracking(): void {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const millisecondsUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      console.log('Tracking closed automatically at midnight.');

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
      this.notificationService.showNotification('Attention: You have exceeded your daily calorie limit !', 'Fermer', 5000, ['alert-snackbar']);
    }
  }
  
  showFoodSuggestions(): void {
    if (this.showSuggestions === 'shown') {
      this.showSuggestions = 'hidden';
      this.suggestionIcon = 'fas fa-bell';
      this.receiveNotification();
    } else {
      const goal = this.nutritionalgoal.goal;
      if (goal) {
        // Si le but nutritionnel est défini, récupérez les suggestions de nourriture
        this.foodService.getNutritionAdvice(goal).subscribe(
          (suggestions: Food[]) => {
            this.suggestionFoods = suggestions;
            this.showSuggestions = 'shown';
            this.suggestionIcon = 'fas fa-comment-alt';
            this.notificationReceived = false;
          },
          (error: any) => {
            console.error('Error fetching nutrition advice:', error);
          }
        );
      } else {
        console.error('Nutritional goal not set. Cannot fetch food suggestions.');
      }
    }
  }
  calculateProgressPercentage(): number {
    const totalCaloriesConsumed = this.consumedFoods.reduce((acc, food) => acc + food.calories_per_serving, 0);
    if (this.dailyCalorieGoal !== 0) {
        return Math.floor((totalCaloriesConsumed / this.dailyCalorieGoal) * 100);
    } else {
        return 0; // Ou toute autre valeur par défaut que vous préférez si dailyCalorieGoal est égal à zéro
    }
}

  
  calculateRemainingCircleColor(): string {
    const percentageConsumed = this.calculateProgressPercentage();
    const percentageRemaining = 100 - percentageConsumed;
    if (percentageRemaining >= 70) {
        return '#ff8c00'; // Orange si plus de 70% restants
    } else if (percentageRemaining >= 50) {
        return '#ffff00'; // Jaune si plus de 50% restants
    } else {
        return '#00ff00'; // Vert si moins de 50% restants
    }
}


  
  calculateCircleColor(): string {
    const percentageConsumed = this.calculateProgressPercentage();
    if (percentageConsumed >= 100) {
        return '#ff0000'; // Rouge si 100% ou plus consommés
    } else if (percentageConsumed >= 70) {
        return '#ff8c00'; // Orange si plus de 70% consommés
    } else if (percentageConsumed >= 50) {
        return '#ffff00'; // Jaune si plus de 50% consommés
    } else {
        return '#00ff00'; // Vert si moins de 50% consommés
    }
}

calculateStrokeColor(): string {
  // Déterminez la couleur en fonction du pourcentage de calories consommées
  // Par exemple, utilisez du rouge pour représenter un pourcentage élevé de calories consommées
  if (this.calculateProgressPercentage() >= 70) {
      return '#ff0000'; // Rouge
  } else {
      return '#007bff'; // Bleu par défaut
  }
}

calculateDashArray(): string {
  // Calculez la taille de la zone de tiret du trait en fonction du pourcentage de calories consommées
  const circumference = 2 * Math.PI * 40; // Circonférence du cercle
  return `${circumference}`;
}

calculateDashOffset(): string {
  // Calculez le décalage de tiret du trait en fonction du pourcentage de calories consommées
  const percentage = this.calculateProgressPercentage();
  const circumference = 2 * Math.PI * 40; // Circonférence du cercle
  const offset = circumference - (circumference * percentage) / 100;
  return `${offset}`;
}

  

  receiveNotification(): void {
    this.notificationReceived = true;
  }

  hideFoodSuggestions(): void {
    this.showSuggestions = 'hidden';
  }
}















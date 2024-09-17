import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { FoodComponent } from './Food/food/food.component';
import { AddFoodComponent } from './add-food/add-food.component';
import { UpdateFoodComponent } from './update-food/update-food.component';
import { AddNutritionalGoalComponent } from './add-nutritional-goal/add-nutritional-goal.component';
import { ListNutritionalGoalComponent } from './list-nutritional-goal/list-nutritional-goal.component';
import { EditNutritionalGoalComponent } from './edit-nutritional-goal/edit-nutritional-goal.component';
import { NutritionTrackComponent } from './add-nutrition-tracking/add-nutrition-tracking.component';
import { ListNutritionTrackingComponent } from './list-nutrition-tracking/list-nutrition-tracking.component';
import { EditNutritionTrackingComponent } from './edit-nutrition-tracking/edit-nutrition-tracking.component';
import { ListrackComponent } from './listrack/listrack.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { UpdateAppointmentComponent } from './update-appointment/update-appointment.component';
import { ListAppointmentComponent } from './list-appointment/list-appointment.component';
import { AddAvailabilityComponent } from './add-availability/add-availability.component';
import { ListAvailabilityComponent } from './list-availability/list-availability.component';
import { UpdateAvailabilityComponent } from './update-availability/update-availability.component';
import { NutritionnistComponent } from './nutritionnist/nutritionnist.component';
import { JitsiComponent } from './jitsi-meeting/jitsi-meeting.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
 // Importez votre composant FoodComponent

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent }, 
  { path: 'admin', component: AllTemplateBackComponent },
  { path: 'foods', component: FoodComponent } ,// Ajoutez cette ligne pour lier FoodComponent à la route 'foods'
  {path:'addFood',component:AddFoodComponent},
  { path: 'updateFood/:foodId', component: UpdateFoodComponent },
  {path:'addnutritiongoal',component:AddNutritionalGoalComponent},
  {path:'showNutgoal',component:ListNutritionalGoalComponent},

  { path: 'updateNutritionalGoal/:id', component:EditNutritionalGoalComponent},
  { path: 'addTracking/:userId', component: NutritionTrackComponent },
  {path:'showtrack', component:ListNutritionTrackingComponent},
  { path: 'updateNutritiontrack/:id', component: EditNutritionTrackingComponent },
  {path:'listtrack/:userId',component:ListrackComponent},
  {path:'nutrition',component:NutritionComponent},
  {path:'addAppointment/:userId',component:AddAppointmentComponent},
  {path:'updateAppointment',component:UpdateAppointmentComponent},
  {path:'listofapp',component:ListAppointmentComponent},
  {path:'addavailability',component:AddAvailabilityComponent},
  {path:'listav',component:ListAvailabilityComponent},
  {path:'updateAvailability',component:UpdateAvailabilityComponent},
  {path:'listnut',component:NutritionnistComponent},
  {path:'jitsi',component:JitsiComponent},
  {path:'sms',component:SendSmsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


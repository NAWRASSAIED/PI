import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

import { AllTemplateBackComponent } from "./BackOffice/all-template-back/all-template-back.component";
import { SidebarBackComponent } from "./BackOffice/sidebar-back/sidebar-back.component";
import { NavbarBackComponent } from "./BackOffice/navbar-back/navbar-back.component";
import { FooterBackComponent } from "./BackOffice/footer-back/footer-back.component";

import { FoodComponent } from "./Food/food/food.component";
import { AddFoodComponent } from "./add-food/add-food.component";
import { UpdateFoodComponent } from "./update-food/update-food.component";
import { AddNutritionalGoalComponent } from "./add-nutritional-goal/add-nutritional-goal.component";
import { ListNutritionalGoalComponent } from "./list-nutritional-goal/list-nutritional-goal.component";
import { EditNutritionalGoalComponent } from "./edit-nutritional-goal/edit-nutritional-goal.component";
import { EditNutritionTrackingComponent } from "./edit-nutrition-tracking/edit-nutrition-tracking.component";
import { ListNutritionTrackingComponent } from "./list-nutrition-tracking/list-nutrition-tracking.component";
import { NutritionTrackComponent } from "./add-nutrition-tracking/add-nutrition-tracking.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DailyCalorieServiceService } from "./services/daily-calorie-service.service";

import { NotificationService } from "./services/notification.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListrackComponent } from './listrack/listrack.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent } from "./FrontOffice/footer-front/footer-front.component";
import { NavBarFrontComponent } from "./FrontOffice/nav-bar-front/nav-bar-front.component";
import { BodyFrontComponent } from "./FrontOffice/body-front/body-front.component";
import { NutritionComponent } from './nutrition/nutrition.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { UpdateAppointmentComponent } from './update-appointment/update-appointment.component';
import { ListAppointmentComponent } from './list-appointment/list-appointment.component';
import { AddAvailabilityComponent } from './add-availability/add-availability.component';
import { ListAvailabilityComponent } from './list-availability/list-availability.component';
import { UpdateAvailabilityComponent } from './update-availability/update-availability.component';
import { NutritionnistComponent } from './nutritionnist/nutritionnist.component';
import { JitsiComponent } from "./jitsi-meeting/jitsi-meeting.component";





import { MatPaginatorModule } from "@angular/material/paginator";

import { CalendarModule, DateAdapter} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FlatpickrModule } from "angularx-flatpickr";
import { DatePipe } from "@angular/common";
import { MatNativeDateModule } from "@angular/material/core";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { RatingComponent } from './rating/rating.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { MatDialogModule } from "@angular/material/dialog";
import { ToastrModule } from "ngx-toastr";
import { YourAppointmentsComponent } from './your-appointments/your-appointments.component';

@NgModule({
  declarations: [
    AppComponent,

    AllTemplateBackComponent,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
   
    FoodComponent,
    AddFoodComponent,
    UpdateFoodComponent,
    AddNutritionalGoalComponent,
    ListNutritionalGoalComponent,
    EditNutritionalGoalComponent,
    EditNutritionTrackingComponent,
    ListNutritionTrackingComponent,
    NutritionTrackComponent,
    ListrackComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
  
    NavBarFrontComponent,
    BodyFrontComponent,
    NutritionComponent,
    AddAppointmentComponent,
    UpdateAppointmentComponent,
    ListAppointmentComponent,
    AddAvailabilityComponent,
    ListAvailabilityComponent,
    UpdateAvailabilityComponent,
    NutritionnistComponent,
   JitsiComponent,
   RatingComponent,
   SendSmsComponent,
   YourAppointmentsComponent
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatMenuModule,
    FlatpickrModule.forRoot(),
    MatDialogModule, 
   
    ToastrModule.forRoot(),
  
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDatepickerModule,
    MatNativeDateModule

 
  
  ],
  providers: [
    NotificationService,
    DatePipe 
   
   
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }


/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentNut } from '../models/AppointmentNut';
import { AppointmentNutService } from '../services/appointment-nut.service';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from '../services/food.service';
import { User } from 'src/Entities/User';
import { Availability } from '../models/Availability';
import { AvailibilityService } from '../services/availibility.service'; // Importer le service de disponibilité

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup; // Formulaire de saisie des rendez-vous
  appointment: AppointmentNut = new AppointmentNut();
  nutritionists: User[] = []; // Liste des nutritionnistes
  selectedNutritionist!: String;
  availabilities: Availability[] = []; // Liste des disponibilités
  selectedDate!: string; // Date sélectionnée
  selectedAvailability!: Availability;
  availability!: Availability;
  selectedTime: string = ''; // Ajoutez cette ligne dans la classe du composant
 // Disponibilité sélectionnée

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: FoodService,
    private appointmentService: AppointmentNutService,
    private availabilityService: AvailibilityService // Injection du service de disponibilité
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec les champs requis et les validateurs
    this.appointmentForm = this.formBuilder.group({
      date_app: ['', Validators.required],
      time: ['', Validators.required]
    });

    // Récupérer le nom du nutritionniste sélectionné depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.selectedNutritionist = params['nutritionist'];
    });

    // Récupérer la liste des nutritionnistes lors de l'initialisation du composant
    this.userService.getAllNutritionists().subscribe(
      (data: User[]) => {
        this.nutritionists = data;
        console.log('Nutritionists:', this.nutritionists);
      },
      (error: any) => {
        console.error('Error fetching nutritionists:', error);
      }
    );
  }

  // Méthode appelée lors de la sélection de la date
  onDateSelected(): void {
    const selectedDate = this.appointmentForm.value.date_app;
    this.availabilityService.getAvailabilitiesForDate(selectedDate).subscribe(
      (availabilities: Availability[]) => {
        this.availabilities = availabilities;
        console.log('Availabilities for selected date:', this.availabilities);
      },
      (error: any) => {
        console.error('Error fetching availabilities:', error);
      }
    );
  }
  generateTimeSlots(startTime: string, endTime: string): string[] {
    const timeSlots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    while (start < end) {
      const time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeSlots.push(time);
      start.setMinutes(start.getMinutes() + 30); // Ajoute 30 minutes
    }
    
    return timeSlots;
  }
  
  // Méthode pour formater le temps au format "hh:mm"
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  // Méthode pour soumettre le formulaire et créer un rendez-vous
  createAppointment(): void {
    if (this.appointmentForm.valid && this.selectedTime) {
      const date = this.appointmentForm.value.date_app;
      const formattedTime = this.formatTime(this.selectedTime); // Formatage du temps
      this.appointment.date_app = date;
      this.appointment.time = formattedTime; // Utilisation du temps formaté
  
      this.appointmentService.createAppointment(this.appointment).subscribe(
        (response: any) => {
          console.log('Appointment created successfully:', response);
          this.appointmentForm.reset();
          this.selectedTime = '';
        },
        error => {
          console.error('Error creating appointment:', error);
        }
      );
    }
  }

  // Méthode appelée lorsque le nutritionniste est sélectionné dans le formulaire
  onNutritionistSelected(nutritionist: User): void {
    this.selectedNutritionist = nutritionist.userName;
    console.log('Selected nutritionist:', this.selectedNutritionist);
  }

  // Méthode appelée lors de la sélection d'une disponibilité
  onAvailabilitySelected(availability: Availability): void {
    this.selectedAvailability = availability;
    console.log('Selected availability:', this.selectedAvailability);
  }

  // Obtenir les contrôles de formulaire pour faciliter l'accès dans le template HTML
  get formControls() {
    return this.appointmentForm.controls;
  }

  assignAvailabilityToAppointment(appointmentId: number, availabilityId: number): void {
    this.appointmentService.assignAvailabilityToAppointment(appointmentId, availabilityId)
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }

  assignUserToAppointment(appointmentId: number, userId: number): void {
    this.appointmentService.assignUserToAppointment(appointmentId, userId, this.availability)
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }
}*/
// add-appointment.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { AvailibilityService } from '../services/availibility.service';
import { AppointmentNutService } from '../services/appointment-nut.service';
import { Availability } from '../models/Availability';
import { AppointmentNut } from '../models/AppointmentNut';
import { addDays, isSameDay, startOfDay } from 'date-fns';
import { User } from 'src/Entities/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { UsService } from '../services/us.service';
interface CustomCalendarEvent extends CalendarEvent {
  description?: string; // Ajouter la propriété description
}

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
  @ViewChild('meetingLink') meetingLink!: any;
  availabilities: Availability[] = [];
  timeSlots: string[] = [];
  selectedAvailability!: Availability;
  appointment: AppointmentNut = new AppointmentNut();
  appointmentForm!: FormGroup;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  viewDate: Date = new Date();
  activeDayIsOpen = false;
  modalOpen = false;
  selectedTime: string = '';
  rating: number = 0;
  daysAvailable: Date[] = []; // Liste des jours disponibles
  month: any;
  meetLink!: string;
  currentRating: number = 0;
   user!: User;
  ratingModalOpen = false; // Pour contrôler l'ouverture et la fermeture du modal de notation
  meetingEnded = false;
  averageMeetingDuration: number = 30;
  private ratingModalTimer: any;
  clickedEvent: CustomCalendarEvent | null = null; // Define clickedEvent property
  selectedAvailability1: Availability | null = null; 
  isAppointmentCreated: boolean = false; 
  bookedAppointments: any[] = [];
 
  
  constructor(
    private formBuilder: FormBuilder,
    private availabilityService: AvailibilityService,
    private appointmentService: AppointmentNutService,
    private route: ActivatedRoute,
    private userService:UsService
  ) {}
  
  ngOnInit(): void {

    this.appointmentForm = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
    
    
    // Récupérer les disponibilités au moment de l'initialisation du composant
    this.availabilityService.getAllAvailabilities().subscribe(
      (availabilities: Availability[]) => {
        this.availabilities = availabilities;
        // Marquer les jours disponibles
        this.markAvailableDays();
      },
      (error: any) => {
        console.error('Error fetching availabilities:', error);
      }
    );
    this.route.params.subscribe(params => {
      const nutritionistId = params['userId']; // Utilisez 'id' pour récupérer l'ID du nutritionniste
      if (nutritionistId) {
        // Utilisez l'ID pour récupérer les détails du nutritionniste depuis un service
        this.userService.getUserById(nutritionistId).subscribe((nutritionist: User) => {
          this.user = nutritionist;
        });
      } else {
        // Gérez le cas où l'ID de l'utilisateur n'est pas défini
        console.error('User ID is not defined');
      }
    });
    
  }

  markAvailableDays(): void {
    // Récupérer toutes les dates disponibles
    this.daysAvailable = this.availabilities.map(availability => this.convertStringToDate(availability.date_av));
    // Générer des événements pour chaque jour disponible
    this.events = this.daysAvailable.map(date => {
      return {
        start: startOfDay(date),
        title: 'Available',
        color: { primary: '#28a745', secondary: '#D1E8FF' } // Vert
      };
    });
  }

  // Méthode pour marquer les jours disponibles dans le calendrier
  dayModifier(day: Date): string {
    if (this.daysAvailable.some(date => isSameDay(date, day))) {
      return 'cal-day-available'; // Ajouter la classe CSS pour les jours disponibles
    } else {
      return 'cal-day-not-available'; // Ajouter la classe CSS pour les jours non disponibles
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CustomCalendarEvent[] }): void {
    // Vérifier si le jour est disponible avant d'ouvrir le modal
    if (this.isDayAvailable(date)) {
     
      this.modalOpen = true;
      const formattedDate = this.formatDate(date);
      this.appointmentForm.patchValue({
        date: formattedDate,
        time: ''
      });;
      this.loadAvailabilities(formattedDate);
      const clickedEvent = events.find(event => event.start.valueOf() );
      if (clickedEvent && clickedEvent.title === 'Appointment (Join meeting)') {
        // Ouvrir le lien de réunion et le modal de notation
        this.joinMeetingAndOpenModal(event,clickedEvent.title, clickedEvent);
      
      } else {
        // Autre logique si nécessaire
      }
  }
  }
  joinMeetingAndOpenModal(event: any, description: string, clickedEvent: CustomCalendarEvent): void {
    event.preventDefault(); // Prevent the link from reloading the page
    console.log('Join meeting link clicked');
    
    // Open the meeting link
    window.open(description, '_blank');
  }
  
  openRatingModal(event: CustomCalendarEvent): void {
    // Store the clicked event
    this.clickedEvent = event;
  
    // Open the rating modal
    this.ratingModalOpen = true;
  }
  
  isMeetingAppointment(event: CustomCalendarEvent): boolean {
    // Add your logic to check if the event is a meeting appointment
    return event.title.includes('(Join meeting)');
  }
  


  // Méthode pour vérifier si le jour est disponible
  isDayAvailable(date: Date): boolean {
    return this.daysAvailable.some(availDate => isSameDay(availDate, date));
  }

  loadAvailabilities(selectedDate: string): void {
    this.availabilityService.getAvailabilitiesForDate(selectedDate).subscribe(
      (availabilities: Availability[]) => {
        this.availabilities = availabilities;
        if (this.availabilities && this.availabilities.length > 0) {
          this.selectedAvailability = this.availabilities[0];
          this.generateTimeSlots(this.selectedAvailability.startTime, this.selectedAvailability.endTime);
        }
        this.timeSlots = this.timeSlots.filter(slot => !this.isAppointmentTaken(selectedDate, slot));
      },
      (error: any) => {
        console.error('Error fetching availabilities:', error);
      }
    );
  }
  isAppointmentTaken(selectedDate: string, startTime: string): boolean {
    // Vérifier si le créneau horaire est déjà pris pour la date sélectionnée
    return this.bookedAppointments.some(appointment => appointment.date === selectedDate && appointment.time === startTime);
  }
  generateTimeSlots(startTime: string, endTime: string): void {
    const timeSlots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
  
    while (start < end) {
      const time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeSlots.push(time);
      start.setMinutes(start.getMinutes() + 30);
    }
  
    this.timeSlots = timeSlots;
  }

  openAddAppointmentModal(): void {
    this.modalOpen = true;
    this.appointmentForm.reset();
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  createAppointment(): void {
    if (this.appointmentForm.valid && this.selectedTime) {
      const selectedDate = this.appointmentForm.value.date;
      const selectedTime = this.appointmentForm.value.time;
      this.bookedAppointments.push({ date: selectedDate, time: selectedTime });
      this.appointment.date_app = selectedDate;
      this.appointment.time = selectedTime;
      const newAppointment: AppointmentNut = {
        date_app: selectedDate,
        time: selectedTime,
        availability: this.selectedAvailability,
        appointmentId: 0
      };
  
      // Créer l'appointment
      this.appointmentService.createAppointment(newAppointment).subscribe(
        (createdAppointment: AppointmentNut) => {
          console.log('Appointment created successfully:', createdAppointment);
  
          // Après la création de l'appointment, affecter la disponibilité
          this.appointmentService.assignAvailabilityToAppointment(createdAppointment.appointmentId, this.selectedAvailability.availabilityId).subscribe(
            (assignedAppointment: AppointmentNut) => {
              console.log('Availability assigned to appointment:', assignedAppointment);
  
              // Réinitialisez le formulaire après la création réussie de l'appointment
              this.appointmentForm.reset();
            },
            (error: any) => {
              console.error('Error assigning availability to appointment:', error);
            }
          );
       
          const dateTime = this.convertStringToDate(selectedDate);
          const [hours, minutes] = selectedTime.split(':');
          dateTime.setHours(Number(hours), Number(minutes));
          this.isAppointmentCreated = true;
  
          const newEvent: CustomCalendarEvent = ({
            title: `Appointment <a href="${this.generateMeetLink()}" target="_blank">(Join meeting)</a> `,
            start: dateTime,
            color: { primary: '#ad2121', secondary: '#FAE3E3' },
            description:this.generateMeetLink()
          });
          this.events.push(newEvent);
          this.viewDate = dateTime;
          this.appointmentForm.reset();
          this.selectedTime = '';
        },
        error => {
          console.error('Error creating appointment:', error);
        }
      );

      // Générer et enregistrer le lien Meet
      this.meetLink = this.generateMeetLink();
    }
  }
  
  // Méthode pour convertir une chaîne de caractères au format "dd/MM/yyyy" en objet Date
  convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    // Les mois en JavaScript sont indexés à partir de 0, donc soustrayez 1 au mois
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  generateMeetLink(): string {
    // Implémentez votre logique pour générer le lien Meet
    const roomName = 'bwb-bfqi-vmh'; // Exemple de nom de salle de réunion
    const baseUrl = 'https://meet.jit.si';
    const meetLink = `${baseUrl}/${roomName}`;
    return meetLink;
  }
  onUserSelected(user: User): void {
    this.user = user;
  }

 // Méthode pour vérifier si l'heure de l'appointment est passée
isAppointmentPassed(date: string, time: string): boolean {
  if (!date || !time) {
    return false; // Retourner false si la date ou l'heure ne sont pas définies
  }

  // Récupérer la date et l'heure de l'appointment
  const [day, month, year] = date.split('/');
  const [hours, minutes] = time.split(':');

  // Créer un objet Date pour l'appointment
  const appointmentDateTime = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  
  // Récupérer la date et l'heure actuelles
  const currentDateTime = new Date();
  
  // Comparer la date et l'heure actuelles avec celle de l'appointment
  return currentDateTime >= appointmentDateTime;
}

  
  

  closeRatingModal(): void {
    this.ratingModalOpen = false;
  }

  onRatingChange(rating: number): void {
    // Mettre à jour la note actuelle du nutritionniste dans votre application
    this.currentRating = rating;
    // Mettre à jour le rating du nutritionniste avec le rating choisi
    if (this.user) {
      this.user.rating = rating;
      // Appeler le service pour mettre à jour les informations du nutritionniste dans la base de données
      this.userService.updateUser(this.user).subscribe(response => {
        console.log('User rating updated successfully:', response);
      }, error => {
        console.error('Error updating user rating:', error);
      });
    }
    this.ratingModalOpen = false; // Fermer le modal de notation
  }
  // Méthode pour gérer la notation du nutritionniste
  submitRating(): void {
    // Mettez à jour la note actuelle du nutritionniste dans votre application
    console.log('Rating submitted:', this.currentRating);
    // Appeler le service pour enregistrer la note dans la base de données
    // this.appointmentService.rateNutritionist(this.user.id, this.currentRating); 
  }
 /* sendReminderSMS() {
    this.appointmentService.sendReminders().subscribe(() => {
      console.log('Rappels SMS envoyés avec succès.');
    }, (error) => {
      console.error('Erreur lors de l\'envoi des rappels SMS :', error);
    });
  }*/
  assignAvailability(appointmentId: number, availabilityId: number): void {
    this.appointmentService.assignAvailabilityToAppointment(appointmentId, availabilityId).subscribe(
      () => {
        console.log('Availability assigned to appointment successfully');
        // Mettez à jour l'interface utilisateur ou effectuez d'autres actions si nécessaire
      },
      (error) => {
        console.error('Error assigning availability to appointment:', error);
        // Gérez l'erreur ou affichez un message à l'utilisateur si nécessaire
      }
    );
  }
  onSelectAvailability(availability: Availability): void {
    this.selectedAvailability1 = availability; // Stockez la disponibilité sélectionnée
  }
}

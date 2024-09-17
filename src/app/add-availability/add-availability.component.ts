import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameMonth, isSameDay, parseISO, parse } from 'date-fns';
import { AvailibilityService } from '../services/availibility.service';
import { Availability } from '../models/Availability';
import { AppointmentNut } from '../models/AppointmentNut';
import { AppointmentNutService } from '../services/appointment-nut.service';
import { v4 as uuidv4 } from 'uuid';
import { MatMenuTrigger } from '@angular/material/menu';
interface CustomCalendarEvent extends CalendarEvent {
  description?: string; // Ajouter la propriété description
}

@Component({
  selector: 'app-add-availability',
  templateUrl: './add-availability.component.html',
  
  styleUrls: ['./add-availability.component.css']
})
export class AddAvailabilityComponent {
  @ViewChild('modal') modal: any;
   @ViewChild(MatMenuTrigger)
  menuTrigger!: MatMenuTrigger;
  viewDate: Date = new Date(); // Initialise viewDate à la date actuelle
  description!: string;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  modalOpen = false;
 events: CustomCalendarEvent[] = [];
 // events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  selectedDay: Date = new Date(); // Initialise selectedDay à la date actuelle

  startTime: string | undefined;
  endTime: string | undefined;

  availableHours: string[] = this.generateAvailableHours();
tooltipTemplate: any;


  constructor(private cdRef: ChangeDetectorRef,private availabilityService: AvailibilityService,private appointmentService:AppointmentNutService) {}

  setView(view: CalendarView) {
    this.view = view;
  }
ngOnInit(): void{
  this.loadAppointments();
  
}
dayClicked({ date, events }: { date: Date; events: CustomCalendarEvent[] }): void {
  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
    this.events = events
  }
}




loadAppointments(): void {
  this.appointmentService.getAllAppointments().subscribe(
    (appointments: AppointmentNut[]) => {
      this.events = [];

      appointments.forEach(appointment => {
        const jitsiLink = this.generateJitsiLink(appointment);
        const [day, month, year] = appointment.date_app.split('/').map(Number);
        const [hours, minutes] = appointment.time.split(':').map(Number);
        const startDateTime = new Date(year, month - 1, day, hours, minutes);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
      
        const newEvent: CustomCalendarEvent = {
          start: startDateTime,
          end: endDateTime,
          title: 'Appointment ' + startDateTime, // Example: 'Appointment 123'
          description: jitsiLink, // Add Jitsi link to description
          color: { primary: '#ff0000', secondary: '#FFE3E3' },
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          }
        };
        
        this.events.push(newEvent);
      });
    }
  );
  this.checkAppointmentsForReminders();
}


joinMeeting(jitsiLink: any): void {
  window.open(jitsiLink, '_blank');
}

   


   /* getAvailabilities(): void {
      this.availabilityService.getAllAvailabilities().subscribe(
        (availabilities: Availability[]) => {
          // Réinitialiser les événements pour éviter les doublons
          this.events = [];
    
          availabilities.forEach(availability => {
            // Formater la date de début et de fin en tant qu'objets Date
            const startDateTime = new Date(`${availability.date_av} ${availability.startTime}`);
            const endDateTime = new Date(`${availability.date_av} ${availability.endTime}`);
    
            const newEvent: CustomCalendarEvent = {
              start: startDateTime,
              end: endDateTime,
              title: 'Disponibilité',
              color: { primary: '#008000', secondary: '#D1E8FF' }, // Couleur verte pour les disponibilités
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false
              }
            };
            this.events.push(newEvent);
          });
        },
        (error: any) => {
          console.error('Error fetching availabilities:', error);
        }
      );
    }
    */

loadAvailabilities(selectedDate: Date): void {
  const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/` +
                        `${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/` +
                        `${selectedDate.getFullYear().toString()}`;

  this.availabilityService.getAvailabilitiesForDate(formattedDate).subscribe(
    (availabilities: Availability[]) => {
      // Réinitialiser les événements pour éviter les doublons
      this.events = [];

      availabilities.forEach(availability => {
        const startDateTime = new Date(`${formattedDate} ${availability.startTime}`);
        const endDateTime = new Date(`${formattedDate} ${availability.endTime}`);

        const newEvent: CustomCalendarEvent = {
          start: startDateTime,
          end: endDateTime,
          title: 'Available',
          color: { primary: '#008000', secondary: '#D1E8FF' }, // Couleur verte pour les disponibilités
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false
          }
        };
        this.events.push(newEvent);
      });
    },
    (error: any) => {
      console.error('Error fetching availabilities:', error);
    }
  );
}

  

  generateAvailableHours(): string[] {
    const availableHours: string[] = [];
    const startHour = 8; // Heure de début (par exemple, 8h du matin)
    const endHour = 20; // Heure de fin (par exemple, 20h)

    for (let hour = startHour; hour <= endHour; hour++) {
      availableHours.push(`${hour.toString().padStart(2, '0')}:00`);
      availableHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return availableHours;
  }

  openAddAvailabilityModal() {
    this.modalOpen = true;
    this.cdRef.detectChanges();
  }

  addAvailability() {
    if (this.selectedDay && this.startTime && this.endTime) {
      // Convertir les chaînes de date et d'heure en objets Date au format ISO
      const startDateTime = new Date(this.selectedDay);
      const endDateTime = new Date(this.selectedDay);
  
      // Convertir les chaînes de temps en heures et minutes
      const [startHour, startMinute] = this.startTime.split(':').map(Number);
      const [endHour, endMinute] = this.endTime.split(':').map(Number);
  
      // Définir les heures et minutes pour les objets Date
      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);
  
      // Formatter la date au format 'dd/mm/yyyy'
      // Formatter la date au format 'dd/mm/yyyy'
const formattedDate = `${startDateTime.getDate().toString().padStart(2, '0')}/` +
`${(startDateTime.getMonth() + 1).toString().padStart(2, '0')}/` +
`${startDateTime.getFullYear().toString()}`;

      // Formatter l'heure de début et de fin au format 'HH:mm'
      const formattedStartTime = this.startTime;
      const formattedEndTime = this.endTime;
  
      // Créer l'objet d'Availability à envoyer au service
      const availability: Availability = {
        date_av: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        availabilityId: 0
      };
  
      // Appeler le service pour créer la disponibilité
      this.availabilityService.createAvailability(availability).subscribe(
        (response) => {
          console.log('Disponibilité ajoutée avec succès :', response);
          // Mettre à jour le calendrier avec l'événement ajouté ici
          const newEvent: CalendarEvent = {
            start: startDateTime,
            end: endDateTime,
            title: 'Availability',
            color: { primary: '#1e90ff', secondary: '#D1E8FF' },
            draggable: false,
            resizable: {
              beforeStart: false,
              afterEnd: false
            }
          };
          this.events.push(newEvent);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la disponibilité :', error);
          // Gérer les erreurs
        }
      );
  
      this.modalOpen = false; // Fermer le modal après l'ajout
    } else {
      console.warn('Aucune journée sélectionnée ou champs manquants.');
      // Affichez un message à l'utilisateur pour sélectionner une journée et remplir les champs
    }
  }
  
// Fonction pour formater l'heure en hh:mm
formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

  closeModal() {
    this.modalOpen = false;
    this.cdRef.detectChanges();
  }

  calculateEndTime(startTime: string): string {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endHour = startHour + 1;
    return `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
  }
  generateJitsiLink(jitsi:any): string {
    // Générez le lien Meet Jitsi en fonction des informations sur le rendez-vous
    const roomName = 'bwb-bfqi-vmh'; // Remplacez par le nom de votre salle de réunion
    const baseUrl = 'https://meet.jit.si';
    const jitsiLink = `${baseUrl}/${roomName}`;
    return jitsiLink;
  }
  checkAppointmentsForReminders(): void {
    this.events.forEach(event => {
      const appointmentTime = event.start; // Obtenez l'heure du rendez-vous à partir des données de l'événement
      const now = new Date();
      const timeDiff = appointmentTime.getTime() - now.getTime();
  
      if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) { // Si le rendez-vous est dans les 5 prochaines minutes
        setTimeout(() => {
          this.sendRemindersBeforeAppointments();
        }, timeDiff);
      }
    });
  }
  sendRemindersBeforeAppointments(): void {
    this.appointmentService.sendReminders().subscribe(
      () => {
        console.log('Rappels envoyés avec succès');
        // Ajoutez ici toute logique supplémentaire après l'envoi des rappels
      },
      error => {
        console.error('Erreur lors de l\'envoi des rappels : ', error);
      }
    );
  }
}










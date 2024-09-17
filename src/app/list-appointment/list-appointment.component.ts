import { Component, OnInit } from '@angular/core';
import { AppointmentNut } from '../models/AppointmentNut';
import { AppointmentNutService } from '../services/appointment-nut.service';


@Component({
  selector: 'app-list-appointment',
  templateUrl: './list-appointment.component.html',
  styleUrls: ['./list-appointment.component.css']
})
export class ListAppointmentComponent implements OnInit {
  appointments: AppointmentNut[] = [];

  constructor(
    private appointmentService: AppointmentNutService,

  ) { }

  ngOnInit(): void {


    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data: AppointmentNut[]) => {
        this.appointments = data;
      },
      (error) => {
        console.log('Error fetching appointments: ', error);
      }
    );
  }

  // Méthode pour créer une réunion lorsque le bouton est cliqué
 

  deleteAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId)
        .subscribe(() => {
          // Remove the deleted appointment from the array
          this.appointments = this.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
        });
    }
  }
}


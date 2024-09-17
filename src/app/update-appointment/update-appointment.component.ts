import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentNutService } from '../services/appointment-nut.service';


@Component({
  selector: 'app-update-appointment',
  templateUrl: './update-appointment.component.html',
  styleUrls: ['./update-appointment.component.css']
})
export class UpdateAppointmentComponent implements OnInit {
  appointmentId!: number;
  appointment: any = {}; // Objet pour stocker les détails du rendez-vous
  updatedAppointment: any = {}; // Objet pour stocker les données mises à jour

  constructor(private route: ActivatedRoute, private router: Router, private appointmentService: AppointmentNutService) { }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.params['id']; // Récupérer l'ID du rendez-vous depuis l'URL
    this.getAppointmentDetails(); // Appeler la méthode pour récupérer les détails du rendez-vous
  }

  getAppointmentDetails(): void {
    this.appointmentService.getAppointmentById(this.appointmentId)
      .subscribe(
        response => {
          this.appointment = response;
        },
        error => {
          console.log(error);
        }
      );
  }

  updateAppointment(): void {
    this.appointmentService.updateAppointment(this.appointmentId, this.updatedAppointment)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/appointments']);
        },
        error => {
          console.log(error);
        }
      );
  }
}

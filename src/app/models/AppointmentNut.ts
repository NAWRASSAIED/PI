import { User } from "src/Entities/User";
import { Availability } from "./Availability";

export class AppointmentNut {
    appointmentId!: number;
    date_app!: string;
    time!: string;
    client?: User; // Vous devez créer une interface User correspondante
    nutritionist?: User; // Vous devez créer une interface User correspondante
    availability!: Availability;
    meetingLink?: string; // Vous devez créer une interface Availability correspondante

  }
 
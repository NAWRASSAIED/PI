import { User } from "src/Entities/User";
import { AppointmentNut } from "./AppointmentNut";

export class Availability {
    availabilityId!: number;
    date_av!: string;
    startTime!: string;
    endTime!: string;
    nutritionist?: User; // Vous devez créer une interface User correspondante
    appointments?: AppointmentNut[]; // Vous devez créer une interface AppointmentNut correspondante
  
  }
  
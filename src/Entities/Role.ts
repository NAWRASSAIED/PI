import { User } from "./User";

export interface Role {
    id: number;
    name: string;
    
    users: User[]; // Supposons que vous avez déjà une interface User définie
  }
  
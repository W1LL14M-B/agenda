import { Person } from "./person.model";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    people: Person[];  
  } 

  /*   export interface Task {
      title: string;
      description: string;
      deadline: string; // Tipo string para almacenar fechas en formato ISO
      completed: boolean;
      people: Array<{
        fullName: string;
        age: number;
        skills: string[];
      }>;
    } */
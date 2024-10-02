import { Person } from "./person.model";


export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    people: Person[];  
  }
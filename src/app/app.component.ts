/* import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AGENDA';
  taskForm: FormGroup;
  tasks: Task[] = [];
  taskId: number = 0;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  createTask() {
    const newTask: Task = {
      id: this.taskId++,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      completed: false,
    };

    this.tasks.push(newTask);
    this.taskForm.reset(); // Resetear el formulario
  }

    // Función para marcar una tarea como completada
    toggleTaskCompletion(task: Task) {
      task.completed = !task.completed;
    }




}
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Task } from './models/task.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AGENDA';
  taskForm: FormGroup;
  tasks: Task[] = [];
  taskId: number = 0;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      people: this.fb.array([]), // Arreglo para agregar personas
    });
  }

  // Devuelve el arreglo de personas
  get people(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  // Agregar una persona al formulario
  addPerson() {
    const personForm = this.fb.group({
      fullName: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(1)]],
      skills: ['', Validators.required], // Habilidades separadas por comas
    });
    this.people.push(personForm);
  }

  // Eliminar una persona del formulario
  removePerson(index: number) {
    this.people.removeAt(index);
  }

  createTask() {
    const newTask: Task = {
      id: this.taskId++,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      completed: false,
      people: this.taskForm.value.people.map((person: any) => ({
        fullName: person.fullName,
        age: person.age,
        skills: person.skills.split(',').map((skill: string) => skill.trim()), // Separar habilidades
      })),
    };

    this.tasks.push(newTask);
    this.taskForm.reset(); // Resetear el formulario
    this.people.clear(); // Limpiar personas
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
  }
}

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Task } from './models/task.model';
import { Person } from './models/person.model';

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
      people: this.fb.array([], this.uniqueNamesValidator()), // Validación para nombres únicos
      //people: this.fb.array([]),  Arreglo para agregar personas
    });
  }

  // Devuelve el arreglo de personas
  get people(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  // Validación personalizada: verifica que los nombres no se repitan
  uniqueNamesValidator(): ValidatorFn {
    return (formArray: AbstractControl) => {
      const names = formArray.value.map((person: any) =>
        person.fullName.trim().toLowerCase()
      );
      const hasDuplicates = names.some(
        (name: string, index: number) => names.indexOf(name) !== index
      );
      return hasDuplicates ? { duplicateNames: true } : null;
    };
  }

  // Agregar una persona al formulario
  addPerson() {
    const personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]], // Obligatorio y mínimo 5 caracteres
      age: [null, [Validators.required, Validators.min(18)]], // Edad mayor a 18
      skills: this.fb.array([]), 
    });

    this.people.push(personForm);
    this.people.updateValueAndValidity(); // Actualiza la validez del formulario


  }

  // Eliminar una persona del formulario
  removePerson(index: number) {
    this.people.removeAt(index);
    this.people.updateValueAndValidity(); // Actualiza la validez del formulario
  }

  // Devuelve el FormArray de habilidades de una persona específica
  getSkills(personIndex: number): FormArray {
    return this.people.at(personIndex).get('skills') as FormArray;
  }

  // Añadir una habilidad a la persona

  addSkill(personIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    skillsArray.push(this.fb.control('', Validators.required));

    this.people.updateValueAndValidity(); // Asegúrate de que el formulario esté actualizado
  }

  // Eliminar una habilidad de la persona
  removeSkill(personIndex: number, skillIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    skillsArray.removeAt(skillIndex);
  }

  // Crear una nueva tarea con las personas asignadas
  createTask() {
    const newTask: Task = {
      id: this.taskId++,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      completed: false,
      people: this.taskForm.value.people.map((person: any) => ({
        fullName: person.fullName,
        age: person.age,
        skills: person.skills,
      })),
    };

    this.tasks.push(newTask);
    this.taskForm.reset(); // Resetear el formulario
    this.people.clear(); // Limpiar personas
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
  }

  // Agregar una persona a una tarea existente

  addPersonToTask(task: Task) {
    const peopleFormArray = this.taskForm.get('people') as FormArray;

    // Iteramos sobre el FormArray de personas para agregar cada una a la tarea
    peopleFormArray.controls.forEach((personControl: AbstractControl) => {
      const newPerson: Person = {
        fullName: personControl.get('fullName')?.value,
        age: personControl.get('age')?.value,
        skills: personControl.get('skills')?.value || [],
      };

      task.people.push(newPerson);
    });
  }

  // Eliminar una persona de una tarea existente
  removePersonFromTask(task: Task, index: number) {
    task.people.splice(index, 1);
  }
}

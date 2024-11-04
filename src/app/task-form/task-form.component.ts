// task-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() addTask = new EventEmitter<any>();
  taskForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: [''],
      subTasks: this.formBuilder.array([])
    });
  }

  get subTasks() {
    return this.taskForm.get('subTasks') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(
      this.formBuilder.group({
        title: ['', Validators.required]
      })
    );
    console.log("Subtask:", this.subTasks);
  }

  removeSubTask(index: number) {
    this.subTasks.removeAt(index);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.addTask.emit(this.taskForm.value);
      this.taskForm.reset();
    }
    console.log("Task Form:", this.taskForm);
  }
}
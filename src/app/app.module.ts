import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskFormComponent } from './task-form/task-form.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AppComponent } from './app.component';
import { TodoLoginComponent } from './todo-login/todo-login.component';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TodoDetailsComponent,
    TodoListComponent,
    TodoLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

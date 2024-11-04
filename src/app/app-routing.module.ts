// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { TodoLoginComponent } from './todo-login/todo-login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: TodoLoginComponent},
  { path: 'userID/:userID/todos/:todoId', component: TodoDetailsComponent, canActivate: [AuthGuard] }, //
  { path: 'userID/:userID/todos', component: TodoListComponent, canActivate: [AuthGuard] } //, canActivate: [AuthGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }                                             
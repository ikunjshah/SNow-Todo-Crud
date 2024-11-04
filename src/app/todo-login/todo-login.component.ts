import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-login',
  templateUrl: './todo-login.component.html',
  styleUrls: ['./todo-login.component.css']
})
export class TodoLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  userID: number = 0;
  errorMessage: string = '';

  constructor( private todoService: TodoService, private router: Router) {}

  ngOnInit(): void {
  }

  login() {
    this.todoService.getUsers().subscribe(
      (response) => {
        response = Object.values(response);
        console.log(response);
        let foundUser = null;
        for (const user of response[0]) {
          if (user.u_email === this.email && user.u_password === this.password) {
            foundUser = user;
            this.userID = user.sys_id;
            break;
          }
        }
  
        if (foundUser) {
          this.router.navigate([`/userID/${foundUser.sys_id}/todos`]);
        } else {
          this.errorMessage = 'Invalid email or password';
          return;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  

}

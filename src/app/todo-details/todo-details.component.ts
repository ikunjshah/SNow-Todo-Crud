import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {
  todo: Todo | any;
  sanitizer: any;
  imageSrc: any;
  todoId: string | null = '';
  userId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getTodoID();
    this.getTodo();
  }

  getTodoID(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this.todoId = params.get('todoId');
    });
  }

  getTodo(): void {
    if (this.todoId) {
      this.todoService.getTodoById(this.todoId).subscribe(
        (response: any) => {
          //console.log('Fetched todo:', response);
          this.todo = {
            sys_id: response.result.sys_id,
            u_glide_date: response.result.u_glide_date,
            u_priority: response.result.u_priority,
            u_status: response.result.u_status,
            u_todo: response.result.u_todo,
            u_progress: response.result.u_progress,
            u_assignee: response.result.u_assignee.link,
            u_photo: null
          };
          this.todo.u_glide_date = this.capitalizeFirstLetter(this.todo.u_glide_date);
          this.todo.u_priority = this.capitalizeFirstLetter(this.todo.u_priority);
          this.todo.u_status = this.capitalizeFirstLetter(this.todo.u_status);
          this.todo.u_todo = this.capitalizeFirstLetter(this.todo.u_todo);
          // Fetch user details
          this.getUser();
        },
        (error) => {
          console.error('Error fetching todo:', error);
        }
      );
    }
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  updateProgress(event: any): void {
    if (this.todo && this.todo.sys_id) {
      let u_status: string;
      const progress = event.target.value;
      const updatedTodo: Partial<Todo> = { u_progress: progress };
  
      if (progress === '5') {
        u_status = 'completed';
      } else {
        u_status = 'pending';
      }
  
      updatedTodo.u_status = u_status;
  
      this.todoService.updateTodoById(this.todo.sys_id, updatedTodo).subscribe(
        (response) => {
          console.log('Todo progress updated successfully:', response);
          this.todo.u_progress = progress; 
          this.todo.u_status = this.capitalizeFirstLetter(u_status);
        },
        (error) => {
          console.error('Error updating todo progress:', error);
        }
      );
    }
  }

  getUser(): void {
    if (this.todo && this.todo.u_assignee) {
      this.todoService.getUserName(this.todo.u_assignee).subscribe(
        (response) => {
          //const photoURL = `https://dev199656.service-now.com/sys_attachment.do?sys_id=${response.result.photo}`;
          //console.log('Photo URL:', photoURL);
          //console.log('Fetched user:', response);
          this.todo.u_assignee = response.result.u_name;
          // this.todo.u_photo = this.todoService.getPhoto(photoURL).subscribe(
          //   (imageBlob: Blob) => {
          //     const objectURL = URL.createObjectURL(imageBlob);
          //     this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL); 
          //   },
          //   (error) => {
          //     console.error('Error fetching image:', error);
          //   }
          // );
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }
  

  goBack(): void {
    this.router.navigate(['/userID', this.userId, 'todos']);
  }
}

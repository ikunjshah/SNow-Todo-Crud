import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent implements OnInit {
  title = 'Todos';
  todoValue: string = '';
  list: Todo[] = []; // Initialize list as an empty array
  pendingTodos: Todo[] = [];
  completedTodos: Todo[] = [];
  activeTab: 'pending' | 'completed' = 'pending';
  selectedPriority: string = 'low';
  selectedDeadline: string = this.getCurrentDate();
  selectedAssignee: string = '';
  darkMode: boolean = false;
  showForm: boolean = false;
  v1Enabled: boolean = false;
  v2Enabled: boolean = false;
  userNames: string[] = [];
  userID: string = '';
  // toggleDarkMode() {
  //   this.darkMode = !this.darkMode;
  //   if (this.darkMode) {
  //     document.body.classList.add('dark-mode');
  //   } else {
  //     document.body.classList.remove('dark-mode');
  //   }
  // }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  openForm(item: Todo) {
    this.todoService.setSelectedTodo(item);
    this.toggleForm();
  }

  isTaskFormVisible = false;

  toggleTaskFormVisibility() {
    this.isTaskFormVisible = !this.isTaskFormVisible;
}

// app.component.ts
handleAddTask(task: any) {
if (task.title.trim() !== '') {
  const newItem: Todo = {
    id: Date.now(),
    value: task.title,
    isDone: false,
    u_todo: task.title,
    u_status: 'pending',
    u_priority: task.priority,
    u_glide_date: task.deadline
  };

  this.todoService.addTodo(newItem).subscribe(
    (addedTodo) => {
      console.log('Todo added successfully:', addedTodo);
      this.getTodos(); // Refresh the list after adding a new todo
    },
    (error) => {
      console.error('Error adding todo:', error);
    }
  );
}
}
  constructor(private todoService: TodoService, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getTodos();
    this.getUsers();
    // this.getTodosAndUsers();
    this.route.paramMap.subscribe(params => {
      this.userID = params.get('userID') ?? '';
    });
  }

  toggleV1() {
    this.v1Enabled = !this.v1Enabled;
    if (this.v1Enabled) {
      this.todoService.callV1Api().subscribe(response => {
        console.log('V1 API Response:', response);
      });
    }
  }

  toggleV2() {
    this.v2Enabled = !this.v2Enabled;
    if (this.v2Enabled) {
      this.todoService.callV2Api().subscribe(response => {
        console.log('V2 API Response:', response);
      });
    }
  }

  getTodos() {
    this.todoService.getTodos().subscribe(
      (response: any) => {
        //console.log(response);
        if (response && response.result && Array.isArray(response.result)) {
          this.list = response.result.map((item: any) => ({
            id: item.sys_id,
            value: item.u_todo,
            isDone: item.u_status === 'completed',
            u_todo: item.u_todo,
            u_status: item.u_status,
            u_priority: item.u_priority,
            u_glide_date: item.u_glide_date
          }));

          // Sort todos by priority (high to low)
          this.list.sort((a, b) => {
            const priorityValues: { [key: string]: number } = { 'high': 3, 'normal': 2, 'low': 1 };
            return priorityValues[b.u_priority] - priorityValues[a.u_priority];
          });

          this.pendingTodos = this.list.filter(item => item.u_status !== 'completed');
          this.completedTodos = this.list.filter(item => item.u_status === 'completed');
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  getUsers() {
    this.todoService.getUsers().subscribe(
      (response: any) => {
        //console.log(response);
        if (response && response.result && Array.isArray(response.result)) {
          this.userNames = response.result.map((user: any) => user.u_name);
        }
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

  getTodosAndUsers() {  
    this.todoService.getTodosAndUsers().subscribe(
      ([todos, users]) => {
        console.log('Todos:', todos);
        console.log('Users:', users);
      },
      error => {
        console.error('Error fetching todos and users:', error);
      }
    );
  }
  


  addItem() {
    if (this.todoValue.trim() !== '') {
      const newItem: Todo = {
        id: Date.now(),
        value: this.todoValue,
        isDone: false,
        u_todo: this.todoValue,
        u_status: 'pending',
        u_priority: this.selectedPriority, // Assign selected priority to the new task
        u_glide_date: this.selectedDeadline,
        u_progress: 1,
        u_assignee: this.selectedAssignee
      };
      this.todoService.addTodo(newItem).subscribe(
        addedTodo => {
          console.log('Todo added successfully:', addedTodo);
          this.getTodos(); // Refresh the list after adding a new todo
        },
        error => {
          console.error('Error adding todo:', error);
        }
      );
      this.todoValue = '';
      this.selectedPriority = 'low'; // Reset selected priority after adding todo
      this.selectedDeadline = this.getCurrentDate();
      this.selectedAssignee = '';
    }
  }   
  
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  deleteItem(id: number) {
    this.todoService.deleteTodo(id).subscribe(
      () => {
        this.list = this.list.filter(item => item.id !== id);
        this.getTodos();
      },
      error => {
        console.error('Error deleting todo:', error);
      }
    );
  }

  updateItem(id: number) {
    const index = this.list.findIndex(item => item.id === id);
    if (index !== -1) {
      const newValue = prompt('Enter the new value for the todo item:');
      if (newValue !== null) {
        const updatedTodo: Todo = {
          ...this.list[index],
          u_todo: newValue 
        };
        this.todoService.updateTodo(updatedTodo).subscribe(
          updatedTodoFromServer => {
            console.log('Todo updated successfully:', updatedTodoFromServer);
            this.getTodos(); 
          },
          error => {
            console.error('Error updating todo:', error);
          }
        );
      }
    }
  }

  updateStatus(item: Todo) {
    const updatedTodo: Todo = {
      ...item,
      u_status: item.isDone ? 'completed' : 'pending', 
    };
  
    if (item.u_status !== 'completed' && item.u_status !== 'pending') {
      updatedTodo.u_status = 'pending';
    }
  
    this.todoService.updateTodo(updatedTodo).subscribe(
      updatedTodoFromServer => {
        console.log('Todo status updated successfully:', updatedTodoFromServer);
        this.getTodos();
      },
      error => {
        console.error('Error updating todo status:', error);
      }
    );
  }  
  
  updateDate(item: Todo) {
    this.todoService.updateTodo(item).subscribe(
      updatedTodoFromServer => {
        console.log('Todo date updated successfully:', updatedTodoFromServer);
      },
      error => {
        console.error('Error updating todo date:', error);
      }
    );
  }  
}

  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
  import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators'; 
  import { Todo } from './todo';

  @Injectable({
    providedIn: 'root'
  })
  export class TodoService {
    apiUrl = 'https://dev199656.service-now.com/api/now/table/x_1299857_todo_todos';
    apiUrlV1 = 'https://dev199656.service-now.com/api/x_1299857_todo/v1/todos';
    apiUrlV2 = 'https://dev199656.service-now.com/api/x_1299857_todo/v2/todos';
    userApiUrl = 'https://dev199656.service-now.com/api/now/table/x_1299857_todo_user_table';
    scriptedAPI = 'https://dev199656.service-now.com/api/x_1299857_todo/v1/todos/todos';
    
    private selectedTodoSubject: BehaviorSubject<Todo | null> = new BehaviorSubject<Todo | null>(null);
    selectedTodo$: Observable<Todo | null> = this.selectedTodoSubject.asObservable();


    // Hardcoded credentials
    username = 'admin';
    password = 'q=/rn7HHEu9L';

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
      })
    };

    constructor(private http: HttpClient) { }

    getTodos(): Observable<Todo[]> {
      return this.http.get<Todo[]>(this.apiUrl, this.httpOptions);
    }

    getUsers(): Observable<any[]> {
      return this.http.get<any[]>(this.userApiUrl, this.httpOptions);
    }

    getTodosAndUsers(): Observable<[Todo[], any]> {
      return forkJoin([
        this.getTodos(),
        this.getUsers()
      ]);
    }

    addTodo(todo: Todo): Observable<Todo> {
      return this.http.post<Todo>(this.apiUrl, todo, this.httpOptions);
    }

    deleteTodo(id: number): Observable<void> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<void>(url, this.httpOptions);
    }

    updateTodo(todo: Todo): Observable<Todo> {
      const url = `${this.apiUrl}/${todo.id}`;
      return this.http.patch<Todo>(url, todo, this.httpOptions);
    }

    setSelectedTodo(todo: Todo) {
      this.selectedTodoSubject.next(todo);
    }

    getSelectedTodo(todo: Todo) {
      this.selectedTodoSubject.next(todo);
    }

    callV1Api(): Observable<any> {
      return this.http.get(this.apiUrlV1, this.httpOptions);
    }
  
    callV2Api(): Observable<any> {
      return this.http.get(this.apiUrlV2, this.httpOptions);
    }

    getTodoById(id: any): Observable<Todo[]> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Todo[]>(url, this.httpOptions)
        .pipe(
          catchError((error) => {
            console.error('Error fetching todo:', error);
            throw error;
          })
        );
    }

    updateTodoById(id: string, todo: Partial<Todo>): Observable<Todo> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.patch<Todo>(url, todo, this.httpOptions);
    }

    getUserName(user: string): Observable<any> {  
      const url = `${user}`;
      return this.http.get<any>(url, this.httpOptions);
    }

    getPhoto(url: string): Observable<Blob> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'image/*', // Set content type to handle binary data
          'Access-Control-Allow-Origin': '*'

        }),
        responseType: 'blob' as 'json' // Set response type to 'blob' to handle binary data
      };
  
      return this.http.get<any>(url, httpOptions);
    }
  }

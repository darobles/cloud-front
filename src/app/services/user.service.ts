import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/interfaces/user';
import { environment } from '../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.url_base;
  private http = inject(HttpClient);
  constructor() {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + '/api/users');
  }

  addUser(user: User): Observable<User> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      
    });      
  return this.http.post<User>(`${this.baseUrl}/api/users`, user, { headers });  }

  updateUser(user: User): Observable<User> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        
      });      
    return this.http.put<User>(`${this.baseUrl}/api/users/${user.id}`, user, { headers });
  }

  deleteUser(id: number): Observable<void> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      
    });      
    return this.http.delete<void>(`${this.baseUrl}/api/users/${id}`, { headers });
  }
}

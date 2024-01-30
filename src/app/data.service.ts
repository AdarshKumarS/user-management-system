import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  addUserDetails(data: User): Observable<User[]>{
    return this.http.post<User[]>('http://localhost:3000/users', data);
  }

  updateUserDetails(id: number, data: User): Observable<User[]>{
    return this.http.put<User[]>(`http://localhost:3000/users/${id}`, data);
  }

  getUserList(): Observable<User[]>{
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  deleteUser(id: number): Observable<User[]>{
    return this.http.delete<User[]>(`http://localhost:3000/users/${id}`);
  }
}

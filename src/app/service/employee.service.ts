import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://pis-employee-backend.onrender.com/api/v1/employee';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}

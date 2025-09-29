import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';
import { Employee } from '../interface/employee.interface';

export interface Role {
  id: string;
  name: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://pis-employee-backend.onrender.com/api/v1';

  constructor(private http: HttpClient, private store: Store) {}

  private getHeaders(): HttpHeaders {
    const token = this.store.selectSnapshot(AuthState.token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getManagedEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/employee/manages`, { headers: this.getHeaders() });
  }

  getEmployeeHierarchy(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee`, { headers: this.getHeaders() });
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  addEmployee(employee: any): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employee`, employee, { headers: this.getHeaders() });
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employee/${id}`, { headers: this.getHeaders() });
  }
}

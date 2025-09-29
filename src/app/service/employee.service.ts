import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://pis-employee-backend.onrender.com/api/v1/employee/manages';

  constructor(private http: HttpClient, private store: Store) {}

  getManagedEmployees(): Observable<User[]> {
    const token = this.store.selectSnapshot(AuthState.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}

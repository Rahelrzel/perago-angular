import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://pis-employee-backend.onrender.com/api/v1';

  constructor(private http: HttpClient, private store: Store) {}

  private getHeaders(): HttpHeaders {
    const token = this.store.selectSnapshot(AuthState.token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/employee/login`, credentials);
  }

  changePassword(passwords: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employee/change-password`, passwords, { headers: this.getHeaders() });
  }
}

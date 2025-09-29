import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { User } from '../interface/user.interface';

// -------- ACTIONS --------
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password:string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

// -------- STATE MODEL --------
export interface AuthStateModel {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

// -------- STATE --------
@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: localStorage.getItem('token'), // Load from localStorage on startup
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') as string)
  }
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  // -------- SELECTORS --------
  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return state.isAuthenticated;
  }

  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  // -------- ACTION HANDLERS --------
  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap((result: User) => {
        const { token, ...user } = result;

        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Update state
        ctx.patchState({
          token,
          isAuthenticated: true,
          user: result
        });
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    ctx.setState({
      token: null,
      isAuthenticated: false,
      user: null
    });
  }
}

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

// -------- ACTIONS --------
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

// -------- STATE MODEL --------
export interface AuthStateModel {
  token: string | null;
  isAuthenticated: boolean;
}

// -------- STATE --------
@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: localStorage.getItem('token'), // Load from localStorage on startup
    isAuthenticated: !!localStorage.getItem('token')
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

  // -------- ACTION HANDLERS --------
  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap((result: any) => {
        const token = result.access_token;

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Update state
        ctx.patchState({
          token,
          isAuthenticated: true
        });
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    localStorage.removeItem('token');
    ctx.setState({
      token: null,
      isAuthenticated: false
    });
  }
}

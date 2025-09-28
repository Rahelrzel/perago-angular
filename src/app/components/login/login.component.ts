import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from 'src/app/store/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
  
    const { email, password } = this.loginForm.value;
  
    this.store.dispatch(new Login({ email, password })).subscribe({
      next: (result: any) => {
        this.loading = false;
  
        const user = result.auth;
  
        if (user && user.token) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user));
  
          console.log('Login success:', user);
  
          // Navigate to the static employee page
          this.router.navigate(['/employee']);
        } else {
          this.errorMessage = 'Invalid login response: token missing.';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Login failed:', error);
  
        this.errorMessage =
          error.status === 401
            ? 'Invalid email or password.'
            : 'Login failed. Please try again.';
      }
    });
  }
  
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from 'src/app/store/auth.state';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private message: NzMessageService
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

    const { email, password } = this.loginForm.value;

    this.store.dispatch(new Login({ email, password })).subscribe({
      next: () => {
        this.loading = false;
        this.message.success('Login successful');
        this.router.navigate(['/employee']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = error.error.message || 'Login failed. Please try again.';
        this.message.error(errorMessage);
      }
    });
  }
}

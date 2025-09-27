import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    // ...existing code...
  }

  onLogin(): void {
    console.log('Login attempted with', this.username, this.password);
    // Add login logic here
    this.router.navigate(['/dashboard']); // Navigate to dashboard
  }
}

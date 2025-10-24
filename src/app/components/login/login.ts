import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  message: string = '';
  passwordVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if (user.role === 'admin' || user.role === 'staff') {
        this.router.navigate(['/dashboard']);
      } else if (user.role === 'family') {
        this.router.navigate(['/family-portal']);
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.message = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.message = 'Login successful! Redirecting...';
          // Store user data using auth service
          this.authService.setUser(res.user);
          // Redirect based on role
          if (res.user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (res.user.role === 'staff') {
            this.router.navigate(['/dashboard']);
          } else if (res.user.role === 'family') {
            this.router.navigate(['/family-portal']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.message = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = 'Error during login: ' + err.error.message;
      }
    });
  }
}
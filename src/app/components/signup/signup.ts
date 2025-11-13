import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  username: string = '';
  password: string = '';
  role: string = 'staff';
  loading: boolean = false;
  message: string = '';
  passwordVisible: boolean = false;
  isSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (!this.username || !this.password || !this.role) {
      this.message = 'Please fill in all fields';
      this.isSuccess = false;
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.message = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
      this.isSuccess = false;
      console.log('Password validation failed for:', this.password);
      return;
    }

    this.loading = true;
    this.authService.signup(this.username, this.password, this.role).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.isSuccess = true;
          this.message = res.message || 'Signup successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.isSuccess = false;
          this.message = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.isSuccess = false;
        this.message = 'Error during signup: ' + (err.error?.message || 'Unknown error');
      }
    });
  }
}
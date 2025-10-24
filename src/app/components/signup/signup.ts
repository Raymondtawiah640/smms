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

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.message = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.authService.signup(this.username, this.password, this.role).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.message = 'Signup successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.message = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = 'Error during signup: ' + err.error.message;
      }
    });
  }
}
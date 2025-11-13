import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {
  step: 'email' | 'code' | 'reset' = 'email';
  username: string = '';
  resetCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  message: string = '';
  generatedCode: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  sendResetCode() {
    if (!this.username) {
      this.message = 'Please enter your username.';
      return;
    }

    this.loading = true;
    this.message = '';

    // Generate a 4-digit random code
    this.generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Send reset code via backend using username
    this.authService.forgotPassword(this.username, this.generatedCode).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('Response:', response); // Debug log
        if (response.success) {
          this.step = 'code';
          this.message = 'Reset code generated successfully.';
        } else {
          this.message = response.message || 'Failed to generate reset code.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error generating reset code:', error);
        this.message = 'An error occurred. Please try again.';
      }
    });
  }

  verifyCode() {
    if (this.resetCode !== this.generatedCode) {
      this.message = 'Invalid reset code.';
      return;
    }

    this.step = 'reset';
    this.message = '';
  }

  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'Please fill in all fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    // Password validation: at least 8 characters, uppercase, lowercase, number, special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.message = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
      return;
    }

    this.loading = true;
    this.message = '';

    // Reset password via backend
    this.authService.resetPassword(this.resetCode, this.newPassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.message = 'Password reset successfully!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.message = response.message || 'Failed to reset password.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error resetting password:', error);
        this.message = 'An error occurred. Please try again.';
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  resendCode() {
    this.sendResetCode();
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
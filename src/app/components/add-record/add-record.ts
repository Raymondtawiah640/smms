import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-record',
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './add-record.html',
  styleUrl: './add-record.css'
})
export class AddRecord {
  record = {
    full_name: '',
    national_id: '',
    date_of_death: '',
    storage_slot: '',
    biometric_tag_id: '',
    qr_code: '',
    status: 'pending',
    family_name: '',
    family_phone: '',
    family_email: '',
    amount: 0,
    paid: 0,
    invoice_id: ''
  };

  isSubmitting = false;
  submitMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Basic client-side validation - only full_name is required
    if (!this.record.full_name.trim()) {
      this.submitMessage = 'Full name is required';
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    this.http.post('https://kilnenterprise.com/mortuary/add_record.php', this.record).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.submitMessage = 'Record added successfully!';
          setTimeout(() => {
            this.router.navigate(['/records']);
          }, 1500);
        } else {
          this.submitMessage = response.message || 'Error adding record';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitMessage = 'Error adding record. Please try again.';
        console.error('Error:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/records']);
  }
}

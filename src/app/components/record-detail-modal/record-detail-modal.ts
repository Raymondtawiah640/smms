import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-record-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record-detail-modal.html',
  styleUrls: ['./record-detail-modal.css']
})
export class RecordDetailModal {
  @Input() record: any;
  @Input() visible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() recordUpdated = new EventEmitter<void>();

  // Amount editing properties
  editingAmount = false;
  editAmountValue = '';

  // Paid status editing properties
  editingPaidStatus = false;
  editPaidStatusValue = '';

  // Message properties
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient) {}

  onCloseModal() {
    this.closeModal.emit();
    this.cancelEditingAmount();
  }

  startEditingAmount() {
    this.editingAmount = true;
    this.editAmountValue = this.record.amount || '';
  }

  saveAmount() {
    if (this.editAmountValue === '' || isNaN(Number(this.editAmountValue))) {
      this.showMessage('Please enter a valid amount', 'error');
      return;
    }

    const updateData = {
      id: this.record.id,
      amount: this.editAmountValue
    };

    this.http.post('https://kilnenterprise.com/mortuary/update_record.php', updateData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.record.amount = this.editAmountValue;
          this.cancelEditingAmount();
          this.recordUpdated.emit();
          this.showMessage('Amount updated successfully!', 'success');
        } else {
          this.showMessage('Update failed: ' + res.message, 'error');
        }
      },
      error: (err) => {
        this.showMessage('Network error (' + err.status + '). Could not connect to server. Please check your connection and try again.', 'error');
      }
    });
  }

  cancelEditingAmount() {
    this.editingAmount = false;
    this.editAmountValue = '';
  }

  startEditingPaidStatus() {
    this.editingPaidStatus = true;
    // Ensure the value is properly set as string for the radio buttons
    this.editPaidStatusValue = String(this.record.paid || '0');
  }

  savePaidStatus() {
    // Ensure we have a valid value
    if (!this.editPaidStatusValue || (this.editPaidStatusValue !== '0' && this.editPaidStatusValue !== '1')) {
      this.showMessage('Please select a paid status', 'error');
      return;
    }

    const updateData = {
      id: this.record.id,
      paid: this.editPaidStatusValue
    };

    this.http.post('https://kilnenterprise.com/mortuary/update_record.php', updateData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.record.paid = this.editPaidStatusValue;
          this.cancelEditingPaidStatus();
          this.recordUpdated.emit();
          this.showMessage('Paid status updated successfully!', 'success');
        } else {
          // Check if it's a "no changes" situation
          if (res.message && res.message.includes('no changes')) {
            this.showMessage('No changes were made to the paid status.', 'success');
            this.cancelEditingPaidStatus();
          } else {
            this.showMessage('Update failed: ' + res.message, 'error');
          }
        }
      },
      error: (err) => {
        if (err.status === 404 && err.error?.message?.includes('no changes')) {
          this.showMessage('No changes were made to the paid status.', 'success');
          this.cancelEditingPaidStatus();
        } else {
          this.showMessage('Connection error (' + err.status + '). Please try again.', 'error');
        }
      }
    });
  }

  cancelEditingPaidStatus() {
    this.editingPaidStatus = false;
    this.editPaidStatusValue = '';
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}

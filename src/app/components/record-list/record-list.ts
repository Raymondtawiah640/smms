import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordDetailModal } from '../record-detail-modal/record-detail-modal';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, TitleCasePipe, FormsModule, RecordDetailModal],
  templateUrl: './record-list.html',
  styleUrls: ['./record-list.css']
})
export class RecordList implements OnInit {
  records: any[] = [];
  filteredRecords: any[] = [];
  loading = true;
  selectedRecord: any = null;

  // Filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  storageFilter: string = '';

  // Edit properties
  editingRecord: any = null;
  editForm: any = {};

  // Message properties
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
      next: (res: any) => {
        this.records = res.data || [];
        this.filteredRecords = [...this.records]; // Initialize filtered records
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching records:', err);
        this.loading = false;
      }
    });
  }

  viewRecordDetails(record: any) {
    this.selectedRecord = record;
  }

  closeModal() {
    this.selectedRecord = null;
  }

  onRecordUpdated() {
    // Refresh the records to show updated data
    this.loadRecords();
  }

  // Filter methods
  applyFilters() {
    this.filteredRecords = this.records.filter(record => {
      // Search filter (by name)
      const matchesSearch = !this.searchTerm ||
        record.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (record.family_name && record.family_name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = !this.statusFilter || record.status === this.statusFilter;

      // Storage filter
      const matchesStorage = !this.storageFilter || record.storage_slot === this.storageFilter;

      return matchesSearch && matchesStatus && matchesStorage;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.storageFilter = '';
    this.filteredRecords = [...this.records];
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter || this.storageFilter);
  }

  // Edit methods
  editRecord(record: any) {
    this.editingRecord = record;
    // Only include editable fields to prevent sending unnecessary data
    this.editForm = {
      id: record.id,
      full_name: record.full_name,
      status: record.status,
      storage_slot: record.storage_slot,
      family_phone: record.family_phone
    };
  }

  saveEdit() {
    if (!this.editForm.full_name || !this.editForm.status) {
      this.showMessage('Please fill in all required fields: Full Name and Status', 'error');
      return;
    }

    // Store values before clearing the form
    const updatedName = this.editForm.full_name;
    const updatedStatus = this.editForm.status;
    const recordId = this.editForm.id;

    this.http.post('https://kilnenterprise.com/mortuary/update_record.php', this.editForm).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Update the record in the local array
          const index = this.records.findIndex(r => r.id === recordId);
          if (index !== -1) {
            this.records[index] = { ...this.editForm };
            this.applyFilters(); // Refresh filtered results
          }
          this.cancelEdit();

          // Show message with actual values
          const changes = [];
          if (updatedName) changes.push(`Name: ${updatedName}`);
          if (updatedStatus) changes.push(`Status: ${updatedStatus}`);

          if (changes.length > 0) {
            this.showMessage(`Record updated successfully! ${changes.join(', ')}`, 'success');
          } else {
            this.showMessage('Record updated successfully!', 'success');
          }
        } else {
          // Check if it's a "no changes" situation
          if (res.message && res.message.includes('no changes')) {
            this.showMessage('No changes were made to the record.', 'success');
          } else {
            this.showMessage(`Update failed: ${res.message}`, 'error');
          }
        }
      },
      error: (err) => {
        if (err.status === 404 && err.error?.message?.includes('no changes')) {
          this.showMessage('No changes were made to the record.', 'success');
        } else {
          this.showMessage(`Connection error (${err.status}). Please try again.`, 'error');
        }
      }
    });
  }

  cancelEdit() {
    this.editingRecord = null;
    this.editForm = {};
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

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
}

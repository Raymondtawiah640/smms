import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-family-portal',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './family-portal.html'
})
export class FamilyPortal {
  searchRecordId: string = '';
  searchName: string = '';
  searchResult: any = null;
  searchAttempted: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  searchRecord() {
    if (!this.searchRecordId.trim() && !this.searchName.trim()) {
      alert('Please enter either Record ID or Full Name to search');
      return;
    }

    this.loading = true;
    this.searchAttempted = true;

    // Search by record ID or name
    const searchParams: any = {};
    if (this.searchRecordId.trim()) {
      searchParams.record_id = this.searchRecordId.trim();
    }
    if (this.searchName.trim()) {
      searchParams.full_name = this.searchName.trim();
    }

    this.http.post('https://kilnenterprise.com/mortuary/search_records.php', searchParams).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.searchResult = res.data;
        } else {
          this.searchResult = null;
        }
      },
      error: (err) => {
        this.loading = false;
        this.searchResult = null;
        alert('Search failed. Please try again or contact support.');
      }
    });
  }

  clearSearch() {
    this.searchRecordId = '';
    this.searchName = '';
    this.searchResult = null;
    this.searchAttempted = false;
  }
}
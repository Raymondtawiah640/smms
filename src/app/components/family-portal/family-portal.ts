import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-family-portal',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './family-portal.html'
})
export class FamilyPortal implements OnInit {
   searchRecordId: string = '';
   searchName: string = '';
   searchResult: any = null;
   searchAttempted: boolean = false;
   loading: boolean = false;
   allRecords: any[] = [];

   constructor(private http: HttpClient) {}

   ngOnInit() {
     this.loadAllRecords();
   }

   loadAllRecords() {
     this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
       next: (res: any) => {
         if (res.success && res.data) {
           this.allRecords = res.data;
         }
       },
       error: (err) => {
         console.error('Error loading records:', err);
       }
     });
   }

   searchRecord() {
     if (!this.searchRecordId.trim() && !this.searchName.trim()) {
       alert('Please enter either Record ID or Full Name to search');
       return;
     }

     this.loading = true;
     this.searchAttempted = true;

     // Filter records based on search criteria
     this.searchResult = null;

     setTimeout(() => {
       this.loading = false;

       if (this.searchRecordId.trim()) {
         this.searchResult = this.allRecords.find(record =>
           record.id.toString() === this.searchRecordId.trim()
         );
       }

       if (this.searchName.trim() && !this.searchResult) {
         this.searchResult = this.allRecords.find(record =>
           record.full_name.toLowerCase().includes(this.searchName.trim().toLowerCase())
         );
       }
     }, 500); // Small delay to show loading state
   }

  clearSearch() {
    this.searchRecordId = '';
    this.searchName = '';
    this.searchResult = null;
    this.searchAttempted = false;
  }
}
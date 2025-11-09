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
    dataLoaded: boolean = false;

    constructor(private http: HttpClient) {}

   ngOnInit() {
     this.fetchData();
   }

   fetchData() {
     this.loading = true;
     this.dataLoaded = false;

     // Fetch mortuary records
     this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
       next: (res: any) => {
         if (res.success && res.data) {
           this.allRecords = res.data;
           this.mergePaymentStatuses();
         } else {
           this.loading = false;
           this.dataLoaded = true;
         }
       },
       error: (err) => {
         console.error('Error loading records:', err);
         this.loading = false;
         this.dataLoaded = true;
       }
     });
   }

   mergePaymentStatuses() {
     // Fetch payment statuses and merge with records
     this.http.get('https://kilnenterprise.com/mortuary/get_invoices.php').subscribe({
       next: (res: any) => {
         if (res.success && res.data) {
           const invoices = res.data;
           // Merge additional financial data into records (amount, invoice_id)
           // Always use the most recent paid status from invoices if available
           this.allRecords.forEach((record: any) => {
             const invoice = invoices.find((inv: any) => inv.invoice_id === record.id);
             if (invoice) {
               record.amount = invoice.amount;
               record.invoice_id = invoice.invoice_id;
               // Always update paid status from invoices to ensure consistency
               record.paid = invoice.paid;
             }
           });
         }
         // Add consistent loading delay
         setTimeout(() => {
           this.loading = false;
           this.dataLoaded = true;
           console.log('Data loaded and merged:', this.allRecords);
         }, 3000);
       },
       error: (err) => {
         console.error('Error loading payment statuses:', err);
         // Add consistent loading delay even on error
         setTimeout(() => {
           this.loading = false;
           this.dataLoaded = true; // Still mark as loaded even on error
         }, 3000);
       }
     });
   }

   searchRecord() {
     if (!this.dataLoaded) {
       alert('Please wait for data to load before searching');
       return;
     }

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

       console.log('Search result:', this.searchResult);
     }, 3000); // Longer delay to show loading state
   }

  clearSearch() {
    this.searchRecordId = '';
    this.searchName = '';
    this.searchResult = null;
    this.searchAttempted = false;
  }
}
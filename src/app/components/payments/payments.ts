import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class Payments implements OnInit {
  invoices: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.http.get('https://kilnenterprise.com/mortuary/get_invoices.php').subscribe({
      next: (res: any) => {
        this.invoices = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.loading = false;
      }
    });
  }
}

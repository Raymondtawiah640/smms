import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Invoice {
  invoice_id: number;
  full_name: string;
  national_id: string;
  date_of_death: string;
  storage_slot: string;
  family_name: string;
  family_phone: string;
  family_email: string;
  amount: number;
  paid: number;
  created_at: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class Payments implements OnInit {
  invoices: Invoice[] = [];
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

  printInvoice(invoice: Invoice) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.invoice_id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice { border: 1px solid #000; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .details div { margin: 5px 0; }
              .amount { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="invoice">
              <div class="header">
                <h1>Mortuary Invoice</h1>
                <p>Invoice ID: ${invoice.invoice_id}</p>
              </div>
              <div class="details">
                <div><strong>Full Name:</strong> ${invoice.full_name}</div>
                <div><strong>National ID:</strong> ${invoice.national_id || 'N/A'}</div>
                <div><strong>Date of Death:</strong> ${invoice.date_of_death || 'N/A'}</div>
                <div><strong>Storage Slot:</strong> ${invoice.storage_slot || 'N/A'}</div>
                <div><strong>Family Name:</strong> ${invoice.family_name || 'N/A'}</div>
                <div><strong>Family Phone:</strong> ${invoice.family_phone || 'N/A'}</div>
                <div><strong>Family Email:</strong> ${invoice.family_email || 'N/A'}</div>
                <div class="amount"><strong>Amount:</strong> GHS ${invoice.amount}</div>
                <div><strong>Status:</strong> ${invoice.paid ? 'Paid' : 'Pending'}</div>
                <div><strong>Created At:</strong> ${invoice.created_at}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

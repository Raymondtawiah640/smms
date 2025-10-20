import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './record-list.html',
  styleUrls: ['./record-list.css']
})
export class RecordList implements OnInit {
  records: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
      next: (res: any) => {
        this.records = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching records:', err);
        this.loading = false;
      }
    });
  }
}

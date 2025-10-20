import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  records: any[] = [];
  iotData: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // Fetch mortuary records
    this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
      next: (res: any) => {
        this.records = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading records:', err);
        this.loading = false;
      }
    });

    // Fetch IoT sensor data
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_data.php').subscribe({
      next: (res: any) => {
        this.iotData = res.data || [];
      },
      error: (err) => console.error('IoT fetch error:', err)
    });
  }
}

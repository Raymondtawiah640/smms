import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iot-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './iot-panel.html',
  styleUrls: ['./iot-panel.css']
})
export class IoTPanel implements OnInit {
  sensors: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchIoT();
  }

  fetchIoT() {
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_data.php').subscribe({
      next: (res: any) => {
        this.sensors = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('IoT fetch error:', err);
        this.loading = false;
      }
    });
  }
}

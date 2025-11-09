import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  records: any[] = [];
  iotData: any[] = [];
  loading = true;
  systemInfo: any = {
    version: 'SMMS v1.0',
    lastBackup: new Date(),
    activeUsers: 3,
    uptime: '99.9%'
  };

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnInit() {
    this.fetchData();
    this.loadSystemInfo();
  }

  fetchData() {
    // Fetch mortuary records
    this.http.get('https://kilnenterprise.com/mortuary/get_records.php').subscribe({
      next: (res: any) => {
        this.records = res.data || [];
        // Add consistent loading delay
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error loading records:', err);
        // Add consistent loading delay even on error
        setTimeout(() => {
          this.loading = false;
        }, 3000);
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

  getPendingCount(): number {
    return this.records.filter(r => r.status === 'pending').length;
  }

  getInStorageCount(): number {
    return this.records.filter(r => r.status === 'in-storage').length;
  }

  loadSystemInfo() {
    // Simulate loading system information
    this.systemInfo.lastBackup = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
    this.systemInfo.activeUsers = Math.floor(Math.random() * 5) + 1; // 1-5 users
  }

  getSystemHealth(): string {
    const activeSensors = this.iotData.filter(sensor => sensor.power_status === 'ON').length;
    const totalSensors = this.iotData.length;

    if (totalSensors === 0) return 'unknown';
    if (activeSensors / totalSensors >= 0.8) return 'excellent';
    if (activeSensors / totalSensors >= 0.6) return 'good';
    return 'warning';
  }
}

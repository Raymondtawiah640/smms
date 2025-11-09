import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sensor-input',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sensor-input.html'
})
export class SensorInput implements OnInit {
  reading: any = {
    sensor_id: '',
    temperature: null,
    humidity: null,
    power_status: 'ON'
  };

  loading = false;
  recentReadings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRecentReadings();
  }

  addSensorReading() {
    if (!this.reading.sensor_id || !this.reading.temperature || !this.reading.humidity) {
      alert('❌ Please fill in all fields');
      return;
    }

    this.loading = true;

    this.http.post('https://kilnenterprise.com/mortuary/add_sensor_reading.php', this.reading).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          alert(`✅ Reading Added Successfully!\n\n📊 Sensor: ${this.reading.sensor_id}\n🌡️ Temperature: ${this.reading.temperature}°C\n💧 Humidity: ${this.reading.humidity}%\n⚡ Power: ${this.reading.power_status}\n\nData will appear in IoT panel immediately.`);
          this.clearForm();
          this.loadRecentReadings();
        } else {
          alert(`❌ Error: ${res.message}`);
        }
      },
      error: (err) => {
        this.loading = false;
        alert(`❌ Connection Error\n\nCould not save reading.\nPlease check connection and try again.`);
      }
    });
  }

  setQuickReading(sensorId: string, temp: string, humidity: string, power: string) {
    this.reading = {
      sensor_id: sensorId,
      temperature: parseFloat(temp),
      humidity: parseFloat(humidity),
      power_status: power
    };
  }

  clearForm() {
    this.reading = {
      sensor_id: '',
      temperature: null,
      humidity: null,
      power_status: 'ON'
    };
  }

  loadRecentReadings() {
    this.loading = true;
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_data.php').subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.recentReadings = res.data.slice(0, 5); // Show last 5 readings
        }
        // Add consistent loading delay
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Could not load recent readings:', err);
        // Add consistent loading delay even on error
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      }
    });
  }
}
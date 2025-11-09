import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-iot-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './iot-panel.html',
  styleUrls: ['./iot-panel.css']
})
export class IoTPanel implements OnInit, OnDestroy {
  sensors: any[] = [];
  loading = true;
  autoRefresh = true;
  lastUpdate: Date = new Date();
  private refreshSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchIoT();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  fetchIoT() {
    this.loading = true;
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_data.php').subscribe({
      next: (res: any) => {
        this.sensors = res.data || [];
        // Add consistent loading delay
        setTimeout(() => {
          this.loading = false;
          this.lastUpdate = new Date();
        }, 3000);
      },
      error: (err) => {
        // Add consistent loading delay even on error
        setTimeout(() => {
          this.loading = false;
          this.showOfflineMessage('Sensor data temporarily unavailable');
        }, 3000);
      }
    });
  }

  private showOfflineMessage(message: string) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ffa726;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      font-family: Arial, sans-serif;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  viewServerRecords() {
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_records.php').subscribe({
      next: (res: any) => {
        if (res.success) {
          const records = res.data || [];
          if (records.length === 0) {
            alert(' No Server Records Found\n\nNo IoT records found on server.\n\nCreate some records first to view them here.');
            return;
          }

          let message = ` Server Records (${records.length})\n`;
          message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

          records.forEach((record: any, index: number) => {
            const date = new Date(record.created_at).toLocaleDateString();
            const time = new Date(record.created_at).toLocaleTimeString();
            message += ` Record ${index + 1}\n`;
            message += `    ${record.id}\n`;
            message += `    ${record.full_name}\n`;
            message += `    Sensor: ${record.storage_slot}\n`;
            message += `    ${date} ${time}\n`;
            message += `    Server Storage\n\n`;
          });

          alert(message);
        } else {
          alert(`❌ Server Error\n\nCould not retrieve records: ${res.message}`);
        }
      },
      error: (err) => {
        alert(`❌ Connection Error\n\nCould not connect to server (${err.status})\nPlease check your connection and try again.`);
      }
    });
  }

  printAllRecords() {
    this.http.get('https://kilnenterprise.com/mortuary/get_iot_records.php').subscribe({
      next: (res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          this.printRecordsList(res.data);
        } else {
          alert(' No Records to Print\n\nNo records found on server to print.');
        }
      },
      error: (err) => {
        alert('❌ Print Error\n\nCould not retrieve records for printing.');
      }
    });
  }

  private printRecordsList(records: any[]) {
    const printContent = `
      <html>
        <head>
          <title>Mortuary IoT Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .record { margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .field { margin: 5px 0; }
            .label { font-weight: bold; color: #333; }
            .value { margin-left: 8px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2> Mortuary IoT Records Report</h2>
            <p>Total Records: ${records.length} | Generated: ${new Date().toLocaleString()}</p>
          </div>

          ${records.map((record, index) => `
            <div class="record">
              <h4> Record ${index + 1}</h4>
              <div class="field">
                <span class="label"> ID:</span>
                <span class="value">${record.id}</span>
              </div>
              <div class="field">
                <span class="label"> Name:</span>
                <span class="value">${record.full_name}</span>
              </div>
              <div class="field">
                <span class="label"> Storage:</span>
                <span class="value">Sensor ${record.storage_slot}</span>
              </div>
              <div class="field">
                <span class="label"> Created:</span>
                <span class="value">${new Date(record.created_at).toLocaleString()}</span>
              </div>
              <div class="field">
                <span class="label"> Status:</span>
                <span class="value">${record.status}</span>
              </div>
            </div>
          `).join('')}

          <div class="footer">
            <p> Mortuary IoT Management System - Official Report</p>
            <p>Report Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('❌ Print Error\n\nPlease allow popups for this site to enable printing.');
    }
  }

  startAutoRefresh() {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(30000) // Refresh every 30 seconds
        .pipe(switchMap(() => this.http.get('https://kilnenterprise.com/mortuary/get_iot_data.php')))
        .subscribe({
          next: (res: any) => {
            this.sensors = res.data || [];
            this.lastUpdate = new Date();
          },
          error: (err) => console.error('Auto-refresh error:', err)
        });
    }
  }

  stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  createAndPrintRecord(sensor: any) {
    if (!sensor.sensor_id) {
      alert('❌ Error: Sensor ID is missing');
      return;
    }

    // Send to server
    const recordData = {
      sensor_id: sensor.sensor_id,
      full_name: `Auto-Generated-${sensor.sensor_id}`,
      biometric_tag_id: sensor.sensor_id,
      date_of_death: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    this.http.post('https://kilnenterprise.com/mortuary/record_from_iot_storage.php', recordData).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Print the record
          this.printRecord(sensor);
          alert(`✅ Success!\n\n Record created and sent to printer\n🏢 Sensor: ${sensor.sensor_id}\n📅 Date: ${recordData.date_of_death}`);
          this.fetchIoT();
        } else {
          alert(`❌ Error: ${res.message}`);
        }
      },
      error: (err) => {
        alert(`❌ Connection Error\n\nCould not connect to server.\nPlease check connection and try again.`);
      }
    });
  }

  printRecord(sensor: any) {
    const printContent = `
      <html>
        <head>
          <title>Mortuary Storage Record</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .record-details { margin: 20px 0; }
            .field { margin: 8px 0; }
            .label { font-weight: bold; color: #333; }
            .value { margin-left: 10px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2> Mortuary Cold Storage Record</h2>
            <p>IoT Generated Record</p>
          </div>

          <div class="record-details">
            <div class="field">
              <span class="label"> Record ID:</span>
              <span class="value">${'REC-' + Date.now()}</span>
            </div>
            <div class="field">
              <span class="label"> Full Name:</span>
              <span class="value">${sensor.full_name || 'Auto-Generated-' + sensor.sensor_id}</span>
            </div>
            <div class="field">
              <span class="label"> Storage Location:</span>
              <span class="value">Sensor ${sensor.sensor_id}</span>
            </div>
            <div class="field">
              <span class="label"> Biometric Tag:</span>
              <span class="value">${sensor.sensor_id}</span>
            </div>
            <div class="field">
              <span class="label"> Date of Storage:</span>
              <span class="value">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="field">
              <span class="label"> Time of Storage:</span>
              <span class="value">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="field">
              <span class="label"> Sensor Data:</span>
              <span class="value">Temp: ${sensor.temperature}°C, Humidity: ${sensor.humidity}%</span>
            </div>
            <div class="field">
              <span class="label"> Power Status:</span>
              <span class="value">${sensor.power_status}</span>
            </div>
            <div class="field">
              <span class="label"> Status:</span>
              <span class="value">Pending Identification</span>
            </div>
          </div>

          <div class="footer">
            <p>Generated by IoT Mortuary Management System</p>
            <p>Printed: ${new Date().toLocaleString()}</p>
            <p>This is an official mortuary record - Keep in secure location</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('❌ Print Error\n\nPlease allow popups for this site to enable printing.');
    }
  }

  getSensorStatus(sensor: any): string {
    if (sensor.power_status === 'ON' && sensor.temperature < 5) {
      return 'active';
    } else if (sensor.power_status === 'OFF') {
      return 'inactive';
    }
    return 'warning';
  }

  createAllActiveRecords() {
    const activeSensors = this.sensors.filter(sensor => this.getSensorStatus(sensor) === 'active');

    if (activeSensors.length === 0) {
      alert('⚠️ No Active Sensors\n\nNo sensors are currently active (cold temperature + power ON).\n\nCheck sensor connections and try again.');
      return;
    }

    if (!confirm(` Create ${activeSensors.length} Records?\n\nThis will create mortuary records for all active cold storage sensors.\n\nContinue?`)) {
      return;
    }

    let createdCount = 0;
    let successCount = 0;

    activeSensors.forEach((sensor, index) => {
      setTimeout(() => {
        const recordData = {
          sensor_id: sensor.sensor_id,
          full_name: `Auto-Generated-${sensor.sensor_id}`,
          biometric_tag_id: sensor.sensor_id,
          date_of_death: new Date().toISOString().split('T')[0],
          status: 'pending'
        };

        this.http.post('https://kilnenterprise.com/mortuary/record_from_iot_storage.php', recordData).subscribe({
          next: (res: any) => {
            if (res.success) {
              successCount++;
              this.printRecord({...sensor, record_id: res.record_id});
            }
            createdCount++;

            if (createdCount === activeSensors.length) {
              const message = `✅ Batch Operation Complete!\n\n📊 Processed: ${createdCount} sensors\n✅ Successful: ${successCount} records\n❌ Failed: ${createdCount - successCount} records\n\nCheck individual sensor status for details.`;
              alert(message);
              this.fetchIoT();
            }
          },
          error: (err) => {
            createdCount++;
            if (createdCount === activeSensors.length) {
              alert(`✅ Batch Operation Complete!\n\n📊 Processed: ${createdCount} sensors\n✅ Successful: ${successCount} records\n❌ Failed: ${createdCount - successCount} records\n\nSome records may have failed - check server connection.`);
              this.fetchIoT();
            }
          }
        });
      }, index * 1000); // Stagger by 1 second to avoid server overload
    });
  }

}

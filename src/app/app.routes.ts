import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { RecordList } from './components/record-list/record-list';
import { IoTPanel } from './components/iot-panel/iot-panel';
import { Payments } from './components/payments/payments';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'records', component: RecordList },
  { path: 'iot-panel', component: IoTPanel },
  { path: 'payments', component: Payments },
  { path: '**', redirectTo: '/dashboard' }
];

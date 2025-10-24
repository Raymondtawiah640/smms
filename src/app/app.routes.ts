import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { RecordList } from './components/record-list/record-list';
import { AddRecord } from './components/add-record/add-record';
import { IoTPanel } from './components/iot-panel/iot-panel';
import { SensorInput } from './components/sensor-input/sensor-input';
import { FamilyPortal } from './components/family-portal/family-portal';
import { Payments } from './components/payments/payments';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: 'records', component: RecordList },
  { path: 'add-record', component: AddRecord },
  { path: 'iot-panel', component: IoTPanel },
  { path: 'sensor-input', component: SensorInput },
  { path: 'family-portal', component: FamilyPortal },
  { path: 'payments', component: Payments },
  { path: '**', redirectTo: '/dashboard' }
];

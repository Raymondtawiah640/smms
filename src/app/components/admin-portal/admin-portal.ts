import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface PendingAdmin {
  id: number;
  username: string;
  role: string;
  created_at: string;
  status?: string;
}

interface LoginLog {
  id: number;
  username: string;
  ip_address: string;
  login_time: string;
  user_agent: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-portal',
  imports: [CommonModule],
  templateUrl: './admin-portal.html',
  styleUrl: './admin-portal.css',
})
export class AdminPortal implements OnInit {
  pendingAdmins: PendingAdmin[] = [];
  loginLogs: LoginLog[] = [];
  users: User[] = [];
  activeTab: string = 'approval';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.loadPendingAdmins();
    this.loadLoginLogs();
    this.loadUsers();
  }

  private checkAdminAccess() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'admin') {
      // Redirect to dashboard or show error
      window.location.href = '/dashboard';
    }
  }

  loadPendingAdmins() {
    this.loading = true;
    this.http.get<PendingAdmin[]>('https://kilnenterprise.com/mortuary/get_pending_admins.php')
      .subscribe({
        next: (data) => {
          this.pendingAdmins = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading pending admins:', error);
          this.loading = false;
        }
      });
  }

  loadLoginLogs() {
    this.loading = true;
    this.http.get<LoginLog[]>('https://kilnenterprise.com/mortuary/get_login_logs.php')
      .subscribe({
        next: (data) => {
          this.loginLogs = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading login logs:', error);
          this.loading = false;
        }
      });
  }

  loadUsers() {
    this.loading = true;
    this.http.get<User[]>('https://kilnenterprise.com/mortuary/get_all_users.php')
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        }
      });
  }

  approveAdmin(adminId: number) {
    this.http.post('https://kilnenterprise.com/mortuary/approve_admin.php', { admin_id: adminId })
      .subscribe({
        next: () => {
          this.loadPendingAdmins();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error approving admin:', error);
        }
      });
  }

  declineAdmin(adminId: number) {
   this.http.post('https://kilnenterprise.com/mortuary/decline_admin.php', { admin_id: adminId })
     .subscribe({
       next: () => {
         this.loadPendingAdmins();
         this.loadUsers();
       },
       error: (error) => {
         console.error('Error declining admin:', error);
       }
     });
 }

  revokeAdmin(userId: number) {
    if (confirm('Are you sure you want to revoke admin privileges from this user? They will need to be re-approved.')) {
      this.http.post('https://kilnenterprise.com/mortuary/revoke_admin.php', { user_id: userId })
        .subscribe({
          next: () => {
            this.loadUsers();
            this.loadPendingAdmins(); // Refresh pending admins list
          },
          error: (error) => {
            console.error('Error revoking admin:', error);
          }
        });
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.post('https://kilnenterprise.com/mortuary/delete_user.php', { user_id: userId })
        .subscribe({
          next: () => {
            this.loadUsers();
            this.loadPendingAdmins(); // Refresh pending admins list in case deleted user was pending
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleAdminStatus(adminId: number, event: any) {
    if (event.target.checked) {
      this.approveAdmin(adminId);
    } else {
      this.declineAdmin(adminId);
    }
  }
}

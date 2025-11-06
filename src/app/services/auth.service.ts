import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://kilnenterprise.com/mortuary';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  signup(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup.php`, { username, password, role });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { username, password });
  }

  forgotPassword(username: string, resetCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot_password.php`, { username, reset_code: resetCode });
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset_password.php`, { email, new_password: newPassword });
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserObservable() {
    return this.userSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
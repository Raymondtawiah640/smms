import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  isLoggedIn = false;
  user: any = null;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSubscription = this.authService.getUserObservable().subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeProfileDropdown();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.closeProfileDropdown();
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown() {
    this.profileDropdownOpen = false;
  }
}

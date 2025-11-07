import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
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
  currentTheme: string = 'light';
  private userSubscription: Subscription | undefined;
  private themeSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    this.userSubscription = this.authService.getUserObservable().subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });

    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
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

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

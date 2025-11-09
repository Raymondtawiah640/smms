import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { LanguageService, Language } from '../../services/language.service';
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
  isFamily = false;
  user: any = null;
  currentTheme: string = 'light';
  currentLanguage: Language = 'en';
  availableLanguages: { code: Language; name: string }[] = [];
  private userSubscription: Subscription | undefined;
  private themeSubscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.getUserObservable().subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
      this.isFamily = user && user.role === 'family';
    });

    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.languageSubscription = this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });

    this.availableLanguages = this.languageService.getAvailableLanguages();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
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

  setLanguage(language: Language) {
    this.languageService.setLanguage(language);
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
    // Default to light mode
    return false;
  }

  toggleDarkMode(): void {
    const currentMode = this.darkModeSubject.value;
    const newMode = !currentMode;
    this.darkModeSubject.next(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    this.applyTheme(newMode);
  }

  private applyTheme(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
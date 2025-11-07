import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'blue' | 'purple';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeType>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  private getInitialTheme(): ThemeType {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'blue', 'purple'].includes(savedTheme)) {
      return savedTheme as ThemeType;
    }
    // Default to light mode
    return 'light';
  }

  toggleTheme(): void {
    const themes: ThemeType[] = ['light', 'dark', 'blue', 'purple'];
    const currentIndex = themes.indexOf(this.themeSubject.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];

    this.themeSubject.next(newTheme);
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: ThemeType): void {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('dark', 'blue-theme', 'purple-theme');

    // Add the appropriate theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'blue') {
      root.classList.add('blue-theme');
    } else if (theme === 'purple') {
      root.classList.add('purple-theme');
    }
    // Light theme has no additional classes
  }

  getCurrentTheme(): ThemeType {
    return this.themeSubject.value;
  }

  isDarkMode(): boolean {
    return this.themeSubject.value === 'dark';
  }
}
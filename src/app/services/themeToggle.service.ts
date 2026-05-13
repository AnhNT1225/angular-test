import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const CLIENT_RENDER = typeof localStorage !== 'undefined';
const LS_THEME = 'theme';
let selectedTheme: AppTheme | undefined = undefined;
if (CLIENT_RENDER) {
  selectedTheme = (localStorage.getItem(LS_THEME) as AppTheme) || undefined;
}

@Injectable({
  providedIn: 'root',
})
export class DarkThemeSelectorService {
  private themeSubject = new BehaviorSubject<AppTheme | undefined>(
    selectedTheme,
  );

  currentTheme = this.themeSubject.asObservable();

  constructor(private router: Router) {
    // Completely override any attempts to use dark mode
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-gray-900');

    // Clear all dark mode from localStorage
    localStorage.setItem('theme', 'light');

    // Remove any dark mode specific attributes
    if (document.body.hasAttribute('data-theme')) {
      document.body.removeAttribute('data-theme');
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Always ensure light theme after navigation
        this.setLightTheme();
        this.handleRouteChange(event.url);
      }
    });

    // Force light theme on initialization
    this.setLightTheme();
    this.handleRouteChange(this.router.url);
  }

  setDarkTheme() {
    // Override this method to always set light theme
    this.setLightTheme();
  }

  setLightTheme() {
    this.themeSubject.next(AppTheme.LIGHT);
    this.setToLocalStorage(AppTheme.LIGHT);
    this.removeClassFromHtml(AppTheme.DARK);

    // Make extra sure all dark classes are gone
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-gray-900');

    // Add specific light mode classes if needed
    document.body.classList.add('bg-white');

    this.handleRouteChange(this.router.url);
  }

  setSystemTheme() {
    this.removeFromLocalStorage();
    // Always use light theme, ignoring system preference
    this.themeSubject.next(AppTheme.LIGHT);
    this.removeClassFromHtml('dark');
    this.setToLocalStorage(AppTheme.LIGHT);
    this.handleRouteChange(this.router.url);
  }

  private handleRouteChange(url: string) {
    // Always remove dark mode classes regardless of route
    document.body.classList.remove('bg-gray-900');
    document.documentElement.classList.remove('dark');

    // Add light mode if needed
    document.body.classList.add('bg-white');
  }

  private addClassToHtml(className: string) {
    if (CLIENT_RENDER) {
      this.removeClassFromHtml(className);
      document.documentElement.classList.add(className);
    }
  }

  private removeClassFromHtml(className: string) {
    if (CLIENT_RENDER) {
      document.documentElement.classList.remove(className);
    }
  }

  private setToLocalStorage(theme: AppTheme) {
    if (CLIENT_RENDER) {
      localStorage.setItem(LS_THEME, theme);
    }
  }

  private removeFromLocalStorage() {
    if (CLIENT_RENDER) {
      localStorage.removeItem(LS_THEME);
    }
  }
}

function isSystemDark() {
  // Always return false to prevent system dark mode detection
  return false;
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header modern-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo et nom -->
          <div class="brand" routerLink="/">
            <div class="logo-container">
              <div class="ivory-coast-flag">
                <div class="flag-stripe orange"></div>
                <div class="flag-stripe white"></div>
                <div class="flag-stripe green"></div>
              </div>
            </div>
            <span class="brand-name">CI-Tender</span>
          </div>

          <!-- Navigation principale -->
          <nav class="main-nav nav-prozorro" [class.active]="isMenuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              Accueil
            </a>
            <a routerLink="/tenders" routerLinkActive="active" class="nav-item">
              Appels d'offres
            </a>
            <a routerLink="/suppliers" routerLinkActive="active" class="nav-item">
              Annuaire fournisseurs
            </a>
          </nav>

          <!-- Actions utilisateur -->
          <div class="user-actions">
            <!-- Recherche rapide -->
            <div class="search-box">
              <input 
                type="text" 
                placeholder="Rechercher des appels d'offres..." 
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                class="search-input">
              <button (click)="onSearch()" class="search-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            <!-- Toggle thème -->
            <button 
              (click)="themeService.toggleTheme()" 
              class="theme-toggle"
              [attr.aria-label]="themeService.theme() === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'">
              <svg *ngIf="themeService.theme() === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <svg *ngIf="themeService.theme() === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>

            <!-- Menu mobile toggle -->
            <button 
              class="mobile-menu-toggle"
              (click)="toggleMobileMenu()"
              [attr.aria-expanded]="isMenuOpen()">
              <span class="hamburger"></span>
              <span class="hamburger"></span>
              <span class="hamburger"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  private isMenuOpenSignal = signal(false);
  public isMenuOpen = this.isMenuOpenSignal.asReadonly();

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fermer les menus lors du changement de route
    this.router.events.subscribe(() => {
      this.isMenuOpenSignal.set(false);
    });
  }

  toggleMobileMenu() {
    this.isMenuOpenSignal.update(isOpen => !isOpen);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/tenders'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }
} 
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="admin-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo et nom -->
          <div class="brand" routerLink="/admin">
            <div class="logo-container">
              <div class="ivory-coast-flag">
                <div class="flag-stripe orange"></div>
                <div class="flag-stripe white"></div>
                <div class="flag-stripe green"></div>
              </div>
            </div>
            <span class="brand-name">CI-Tender</span>
            <span class="admin-badge">Administration</span>
          </div>

          <!-- Navigation admin -->
          <nav class="admin-nav">
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="19" y2="9"></line>
                <line x1="9" y1="15" x2="19" y2="15"></line>
              </svg>
              Tableau de bord
            </a>
            <a routerLink="/admin/tenders" routerLinkActive="active" class="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Appels d'offres
            </a>
            <a routerLink="/admin/suppliers" routerLinkActive="active" class="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Fournisseurs
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Utilisateurs
            </a>
            <a routerLink="/admin/ads" routerLinkActive="active" class="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              Publicités
            </a>
          </nav>

          <!-- Actions admin -->
          <div class="admin-actions">
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

            <!-- Menu utilisateur admin -->
            <div class="admin-user-menu">
              <button class="admin-avatar" (click)="toggleUserMenu()" type="button">
                <div class="avatar">
                  <span class="avatar-text">AD</span>
                </div>
                <span class="user-name">Administrateur</span>
                <svg class="avatar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              <div class="dropdown-menu" [class.active]="isUserMenuOpen()">
                <div class="user-info">
                  <p class="user-full-name">Administrateur CI-Tender</p>
                  <p class="user-email">admin&#64;ci-tender.com</p>
                </div>
                <hr>
                <a routerLink="/admin/profile" class="dropdown-item">
                  <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Mon profil
                </a>
                <a routerLink="/" class="dropdown-item">
                  <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  Voir le site
                </a>
                <hr>
                <button (click)="logout()" class="dropdown-item logout-btn">
                  <svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  private isUserMenuOpenSignal = signal(false);
  public isUserMenuOpen = this.isUserMenuOpenSignal.asReadonly();

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fermer le menu lors du changement de route
    this.router.events.subscribe(() => {
      this.isUserMenuOpenSignal.set(false);
    });
  }

  toggleUserMenu() {
    this.isUserMenuOpenSignal.update(isOpen => !isOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 
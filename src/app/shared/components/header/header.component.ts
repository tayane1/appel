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
    <header class="header ivory-coast-accent">
      <div class="container">
        <div class="header-content">
          <!-- Logo et nom -->
          <div class="brand" routerLink="/">
            <div class="ivory-coast-flag" style="width: 2.5rem; height: 2.5rem; display: flex;">
              <div class="flag-stripe orange" style="flex: 1; background-color: #ff7900;"></div>
              <div class="flag-stripe white" style="flex: 1; background-color: #ffffff;"></div>
              <div class="flag-stripe green" style="flex: 1; background-color: #00a651;"></div>
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
            <div class="dropdown" *ngIf="currentUser()">
              <button class="dropdown-toggle">
                Services
                <span class="icon">▼</span>
              </button>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item">
                  <span class="icon">🔔</span> Alertes email
                </a>
                <a href="#" class="dropdown-item">
                  <span class="icon">📊</span> Statistiques
                </a>
                <a href="#" class="dropdown-item">
                  <span class="icon">💻</span> API publique
                </a>
              </div>
            </div>
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
                <span class="icon">🔍</span>
              </button>
            </div>

            <!-- Toggle thème -->
            <button 
              (click)="themeService.toggleTheme()" 
              class="theme-toggle"
              [attr.aria-label]="themeService.theme() === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'">
              <span class="icon" *ngIf="themeService.theme() === 'light'">🌙</span>
              <span class="icon" *ngIf="themeService.theme() === 'dark'">☀️</span>
            </button>

            <!-- Menu utilisateur -->
            <div class="user-menu" *ngIf="currentUser(); else authButtons">
              <button class="user-avatar" (click)="toggleUserMenu()">
                <div class="avatar">
                  <span class="avatar-text">
                    {{ (currentUser()?.firstName?.charAt(0) || 'U') + (currentUser()?.lastName?.charAt(0) || 'S') }}
                  </span>
                </div>
                <span class="user-name">{{ currentUser()?.firstName }}</span>
                <span class="icon">👤</span>
              </button>
              <div class="dropdown-menu" [class.active]="isUserMenuOpen()">
                <div class="user-info">
                  <p class="user-full-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
                  <p class="user-email">{{ currentUser()?.email }}</p>
                </div>
                <hr>
                <a routerLink="/profile" class="dropdown-item">
                  <span class="icon">👤</span> Mon profil
                </a>
                <a routerLink="/dashboard" class="dropdown-item">
                  <span class="icon">📊</span> Tableau de bord
                </a>
                <a href="#" class="dropdown-item">
                  <span class="icon">⚙️</span> Paramètres
                </a>
                <a routerLink="/admin" class="dropdown-item" *ngIf="authService.isAdmin()">
                  <span class="icon">🛡️</span> Administration
                </a>
                <hr>
                <button (click)="logout()" class="dropdown-item logout-btn">
                  <span class="icon">🚪</span> Déconnexion
                </button>
              </div>
            </div>

            <!-- Boutons d'authentification -->
            <ng-template #authButtons>
              <div class="auth-buttons">
                <a routerLink="/login" class="btn btn-outline">Connexion</a>
                <a routerLink="/register" class="btn btn-primary">Inscription</a>
              </div>
            </ng-template>

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
  private isUserMenuOpenSignal = signal(false);
  public isMenuOpen = this.isMenuOpenSignal.asReadonly();
  public isUserMenuOpen = this.isUserMenuOpenSignal.asReadonly();
  public currentUser = this.authService.currentUser;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fermer les menus lors du changement de route
    this.router.events.subscribe(() => {
      this.isMenuOpenSignal.set(false);
      this.isUserMenuOpenSignal.set(false);
    });
    
    // Log pour déboguer l'état de l'utilisateur
    console.log('Header - Utilisateur actuel:', this.currentUser());
    console.log('Header - Est authentifié:', this.authService.isAuthenticated());
    console.log('Header - Est admin:', this.authService.isAdmin());
  }

  toggleMobileMenu() {
    this.isMenuOpenSignal.update(isOpen => !isOpen);
  }

  toggleUserMenu() {
    console.log('Toggle user menu appelé');
    console.log('État actuel:', this.isUserMenuOpen());
    this.isUserMenuOpenSignal.update(isOpen => !isOpen);
    console.log('Nouvel état:', this.isUserMenuOpen());
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/tenders'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  getUserAvatar(): string {
    const user = this.currentUser();
    if (!user) return 'https://ui-avatars.com/api/?name=U&background=0d7377&color=fff&size=40';
    
    // Si l'utilisateur a un avatar, l'utiliser
    if (user.avatar && user.avatar.trim() !== '') {
      return user.avatar;
    }
    
    // Sinon, générer un avatar avec les initiales
    const firstName = user.firstName || 'U';
    const lastName = user.lastName || 'S';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0d7377&color=fff&size=40&bold=true`;
  }

  logout() {
    this.authService.logout();
  }
} 
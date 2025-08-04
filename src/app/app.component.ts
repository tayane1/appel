import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ThemeService } from './core/services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="app-container" [attr.data-theme]="themeService.theme()">
      <!-- Header et Footer publics seulement pour les routes non-admin -->
      <app-header *ngIf="!isAdminRoute()"></app-header>
      <main class="main-content" [class.admin-content]="isAdminRoute()">
        <router-outlet></router-outlet>
      </main>
      <app-footer *ngIf="!isAdminRoute()"></app-footer>
      <app-loading-spinner></app-loading-spinner>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CI-Tender - Plateforme ivoirienne d\'appels d\'offres';
  private currentRoute = '';

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialisation de Google Analytics
    this.initGoogleAnalytics();
    
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  isAdminRoute(): boolean {
    return this.currentRoute.startsWith('/admin') || this.currentRoute.startsWith('/login');
  }

  private initGoogleAnalytics() {
    // Implémentation Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID');
    }
  }
} 
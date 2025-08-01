import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TenderService } from '../tenders/tender.service';
import { SupplierService } from '../suppliers/supplier.service';
import { AdvertisementBannerComponent } from '../../shared/components/advertisement-banner/advertisement-banner.component';
import { Tender } from '../../core/models/tender.model';
import { Supplier } from '../../core/models/supplier.model';
import { AdPosition } from '../../core/models/advertisement.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    AdvertisementBannerComponent
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero ivory-coast-accent">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              La plateforme de référence des 
              <span class="highlight">appels d'offres</span> 
              en Côte d'Ivoire
            </h1>
            <p class="hero-subtitle">
              Découvrez les opportunités d'affaires, connectez-vous avec des fournisseurs qualifiés 
              et développez votre entreprise grâce à notre plateforme digitale.
            </p>
            
            <!-- Barre de recherche principale -->
            <div class="hero-search">
              <div class="search-form">
                <input 
                  type="text" 
                  placeholder="Rechercher des appels d'offres, secteurs, entreprises..."
                  [(ngModel)]="searchQuery"
                  class="search-input">
                <select [(ngModel)]="selectedSector" class="sector-select" style="color: black;">
                  <option value="">Tous les secteurs</option>
                  <option *ngFor="let sector of sectors" [value]="sector">{{ sector }}</option>
                </select>
                <button (click)="onHeroSearch()" class="search-btn btn-ukraine">
                  <span class="icon">🔍</span>
                  Rechercher
                </button>
              </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="stats">
              <div class="stat-item">
                <span class="stat-number ukraine-wave">{{ stats().activeTenders }}</span>
                <span class="stat-label">Appels d'offres actifs</span>
              </div>
              <div class="stat-item">
                <span class="stat-number ukraine-wave">{{ stats().totalSuppliers }}</span>
                <span class="stat-label">Fournisseurs référencés</span>
              </div>
              <div class="stat-item">
                <span class="stat-number ukraine-wave">{{ stats().completedTenders }}</span>
                <span class="stat-label">Marchés conclus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Publicité top -->
      <app-advertisement-banner [position]="AdPosition.TOP"></app-advertisement-banner>

      <!-- Appels d'offres récents -->
      <section class="recent-tenders prozorro-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Appels d'offres récents</h2>
            <p class="section-subtitle">Découvrez les dernières opportunités d'affaires publiées sur notre plateforme</p>
            <a routerLink="/tenders" class="btn-ukraine btn-yellow">
              Voir tout <span class="icon">→</span>
            </a>
          </div>

          <div class="prozorro-grid" *ngIf="recentTenders().length > 0; else noTenders">
            <div class="card-prozorro" *ngFor="let tender of recentTenders()">
              <div class="card-header">
                <div class="card-title">{{ tender.title }}</div>
                <div class="card-subtitle">{{ tender.organizationName }}</div>
              </div>
              
              <div class="card-body">
                <div class="tender-header">
                  <div class="tender-type-badge badge-ukraine" [class]="'badge-' + (tender.type === 'public' ? 'orange' : 'green')">
                    {{ tender.type === 'public' ? 'Public' : 'Privé' }}
                  </div>
                  <div class="tender-deadline">
                    <span class="icon">⏰</span>
                    {{ getTimeRemaining(tender.deadline) }}
                  </div>
                </div>
                
                <p class="tender-description">{{ tender.description | slice:0:120 }}...</p>
                
                <div class="tender-meta">
                  <div class="meta-item">
                    <span class="icon">🏢</span>
                    {{ tender.organizationName }}
                  </div>
                  <div class="meta-item">
                    <span class="icon">📍</span>
                    {{ tender.location }}
                  </div>
                  <div class="meta-item">
                    <span class="icon">🏷️</span>
                    {{ tender.sector }}
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <span class="tender-amount" *ngIf="tender.estimatedAmount">
                  {{ tender.estimatedAmount | currency:'XOF':'symbol':'1.0-0' }}
                </span>
                <a [routerLink]="['/tenders', tender.id]" class="btn-ukraine">
                  Voir détails
                </a>
              </div>
            </div>
          </div>

          <ng-template #noTenders>
            <div class="empty-state">
              <span class="icon">📄</span>
              <h3>Aucun appel d'offres disponible</h3>
              <p>Les nouveaux appels d'offres apparaîtront ici.</p>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Publicité middle -->
      <app-advertisement-banner [position]="AdPosition.MIDDLE"></app-advertisement-banner>

      <!-- Fournisseurs en vedette -->
      <section class="featured-suppliers prozorro-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Fournisseurs en vedette</h2>
            <p class="section-subtitle">Découvrez notre réseau de fournisseurs qualifiés et certifiés</p>
            <a routerLink="/suppliers" class="btn-ukraine btn-yellow">
              Voir tout <span class="icon">→</span>
            </a>
          </div>

          <div class="prozorro-grid" *ngIf="featuredSuppliers().length > 0; else noSuppliers">
            <div class="card-prozorro" *ngFor="let supplier of featuredSuppliers()">
              <div class="card-header">
                <div class="card-title">{{ supplier.companyName }}</div>
                <div class="card-subtitle">{{ supplier.sector }}</div>
              </div>
              
              <div class="card-body">
                <div class="supplier-header">
                  <img 
                    [src]="supplier.logo || 'assets/images/default-company.png'" 
                    [alt]="supplier.companyName"
                    class="supplier-logo">
                  <div class="supplier-badges">
                    <span class="verified-badge badge-ukraine badge-blue" *ngIf="supplier.isVerified">
                      <span class="icon">✅</span>
                      Vérifié
                    </span>
                  </div>
                </div>

                <p class="supplier-description">{{ supplier.description | slice:0:100 }}...</p>

                <div class="supplier-meta">
                  <div class="meta-item">
                    <span class="icon">💼</span>
                    {{ supplier.sector }}
                  </div>
                  <div class="meta-item">
                    <span class="icon">📍</span>
                    {{ supplier.city }}
                  </div>
                  <div class="meta-item">
                    <span class="icon">⭐</span>
                    {{ supplier.rating }}/5 ({{ supplier.reviewsCount }})
                  </div>
                </div>

                <div class="supplier-services">
                  <span 
                    class="service-tag badge-ukraine badge-yellow" 
                    *ngFor="let service of supplier.services.slice(0, 3)">
                    {{ service }}
                  </span>
                  <span class="more-services" *ngIf="supplier.services.length > 3">
                    +{{ supplier.services.length - 3 }} autres
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <span class="experience">{{ supplier.yearsOfExperience }} ans d'expérience</span>
                <a [routerLink]="['/suppliers', supplier.id]" class="btn-ukraine">
                  Voir profil
                </a>
              </div>
            </div>
          </div>

          <ng-template #noSuppliers>
            <div class="empty-state">
              <span class="icon">👥</span>
              <h3>Aucun fournisseur en vedette</h3>
              <p>Les fournisseurs qualifiés apparaîtront ici.</p>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Section Services -->
      <section class="services prozorro-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Nos services</h2>
            <p class="section-subtitle">Des outils puissants pour faciliter vos transactions commerciales</p>
          </div>
          <div class="prozorro-grid">
            <div class="card-prozorro">
              <div class="service-icon">
                <span class="icon">📢</span>
              </div>
              <h3>Publication d'appels d'offres</h3>
              <p>Publiez vos appels d'offres et touchez un large réseau de fournisseurs qualifiés.</p>
            </div>
            
            <div class="card-prozorro">
              <div class="service-icon">
                <span class="icon">🔍</span>
              </div>
              <h3>Recherche avancée</h3>
              <p>Trouvez rapidement les opportunités qui correspondent à votre secteur d'activité.</p>
            </div>
            
            <div class="card-prozorro">
              <div class="service-icon">
                <span class="icon">👥</span>
              </div>
              <h3>Annuaire fournisseurs</h3>
              <p>Consultez notre base de données complète de fournisseurs certifiés.</p>
            </div>
            
            <div class="card-prozorro">
              <div class="service-icon">
                <span class="icon">🔔</span>
              </div>
              <h3>Alertes personnalisées</h3>
              <p>Recevez des notifications pour les appels d'offres correspondant à vos critères.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Publicité bottom -->
      <app-advertisement-banner [position]="AdPosition.BOTTOM"></app-advertisement-banner>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  selectedSector = '';
  AdPosition = AdPosition;
  
  sectors = [
    'BTP & Construction',
    'Informatique & Technologies',
    'Santé & Pharmaceutique',
    'Éducation & Formation',
    'Transport & Logistique',
    'Agriculture & Agroalimentaire',
    'Énergie & Environnement',
    'Services financiers',
    'Télécommunications',
    'Industrie & Manufacturing'
  ];

  private recentTendersSignal = signal<Tender[]>([]);
  private featuredSuppliersSignal = signal<Supplier[]>([]);
  private statsSignal = signal({
    activeTenders: 0,
    totalSuppliers: 0,
    completedTenders: 0
  });

  public recentTenders = this.recentTendersSignal.asReadonly();
  public featuredSuppliers = this.featuredSuppliersSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();

  constructor(
    private tenderService: TenderService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecentTenders();
    this.loadFeaturedSuppliers();
    this.loadStats();
  }

  onHeroSearch() {
    // Navigation vers la page de recherche avec paramètres
    const params: any = {};
    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }
    if (this.selectedSector) {
      params.sector = this.selectedSector;
    }
    
    this.router.navigate(['/tenders'], { queryParams: params });
  }

  getTimeRemaining(deadline: Date): string {
    const now = new Date();
    const diff = new Date(deadline).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expiré';
    if (days === 0) return 'Dernier jour';
    if (days === 1) return '1 jour restant';
    return `${days} jours restants`;
  }

  private loadRecentTenders() {
    this.tenderService.getRecentTenders(6).subscribe({
      next: (tenders) => this.recentTendersSignal.set(tenders),
      error: (error) => console.error('Erreur lors du chargement des appels d\'offres:', error)
    });
  }

  private loadFeaturedSuppliers() {
    this.supplierService.getFeaturedSuppliers(6).subscribe({
      next: (suppliers) => this.featuredSuppliersSignal.set(suppliers),
      error: (error) => console.error('Erreur lors du chargement des fournisseurs:', error)
    });
  }

  private loadStats() {
    // Simuler le chargement des statistiques
    this.statsSignal.set({
      activeTenders: 247,
      totalSuppliers: 1542,
      completedTenders: 856
    });
  }
} 
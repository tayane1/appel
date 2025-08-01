import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-advertisement-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="advertisement-management">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Gestion des publicités</h1>
            <p>Gérez les bannières publicitaires de la plateforme</p>
          </div>
                      <div class="header-actions">
              <button class="btn btn-primary" (click)="createAdvertisement()">
                <i class="lucide-plus"></i>
                Créer une publicité
              </button>
            </div>
        </div>

        <!-- Filtres -->
        <div class="filters-section">
          <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
            <div class="filters-grid">
              <div class="form-group">
                <label>Recherche</label>
                <input
                  type="text"
                  formControlName="keyword"
                  class="form-control"
                  placeholder="Rechercher par titre, client...">
              </div>

              <div class="form-group">
                <label>Statut</label>
                <select formControlName="status" class="form-control">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="scheduled">Programmé</option>
                  <option value="expired">Expiré</option>
                </select>
              </div>

              <div class="form-group">
                <label>Position</label>
                <select formControlName="position" class="form-control">
                  <option value="">Toutes les positions</option>
                  <option value="header">En-tête</option>
                  <option value="sidebar">Barre latérale</option>
                  <option value="footer">Pied de page</option>
                </select>
              </div>

              <div class="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  formControlName="startDate"
                  class="form-control">
              </div>
            </div>

            <div class="filters-actions">
              <button type="submit" class="btn btn-primary">
                <i class="lucide-search"></i>
                Filtrer
              </button>
              <button type="button" class="btn btn-outline" (click)="clearFilters()">
                <i class="lucide-x"></i>
                Effacer
              </button>
            </div>
          </form>
        </div>

        <!-- Statistiques -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-number">{{ stats().total }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().active }}</span>
            <span class="stat-label">Actives</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().totalViews }}</span>
            <span class="stat-label">Vues totales</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().totalClicks }}</span>
            <span class="stat-label">Clics totaux</span>
          </div>
        </div>

        <!-- Liste des publicités -->
        <div class="advertisement-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="advertisement-grid">
            <div class="advertisement-card" *ngFor="let ad of advertisements()">
              <div class="advertisement-header">
                <div class="advertisement-image">
                  <img [src]="ad.imageUrl" [alt]="ad.title">
                </div>
                <div class="advertisement-status" [class]="'status-' + ad.status">
                  {{ getStatusLabel(ad.status) }}
                </div>
              </div>

              <div class="advertisement-content">
                <h3 class="advertisement-title">{{ ad.title }}</h3>
                <p class="advertisement-description">{{ ad.description }}</p>
                
                <div class="advertisement-meta">
                  <div class="meta-item">
                    <i class="lucide-user"></i>
                    <span>{{ ad.clientName }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="lucide-map-pin"></i>
                    <span>{{ getPositionLabel(ad.position) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="lucide-calendar"></i>
                    <span>{{ ad.startDate | date:'dd/MM/yyyy' }} - {{ ad.endDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>

                <div class="advertisement-stats">
                  <div class="stat">
                    <span class="stat-label">Vues</span>
                    <span class="stat-value">{{ ad.views }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Clics</span>
                    <span class="stat-value">{{ ad.clicks }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">CTR</span>
                    <span class="stat-value">{{ getCTR(ad) }}%</span>
                  </div>
                </div>
              </div>

              <div class="advertisement-actions">
                <button class="btn btn-sm btn-outline" (click)="editAdvertisement(ad)">
                  <i class="lucide-edit"></i>
                  Modifier
                </button>
                <button class="btn btn-sm btn-outline" (click)="viewStats(ad)">
                  <i class="lucide-bar-chart"></i>
                  Statistiques
                </button>
                <button 
                  class="btn btn-sm" 
                  [class]="ad.status === 'active' ? 'btn-warning' : 'btn-success'"
                  (click)="toggleAdvertisementStatus(ad)">
                  <i [class]="ad.status === 'active' ? 'lucide-pause' : 'lucide-play'"></i>
                  {{ ad.status === 'active' ? 'Pauser' : 'Activer' }}
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteAdvertisement(ad)">
                  <i class="lucide-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages() > 1">
            <button 
              class="btn btn-outline"
              [disabled]="currentPage() === 1"
              (click)="changePage(currentPage() - 1)">
              <i class="lucide-chevron-left"></i>
              Précédent
            </button>

            <div class="page-numbers">
              <button 
                *ngFor="let page of getPageNumbers()"
                class="page-btn"
                [class.active]="page === currentPage()"
                (click)="changePage(page)">
                {{ page }}
              </button>
            </div>

            <button 
              class="btn btn-outline"
              [disabled]="currentPage() === totalPages()"
              (click)="changePage(currentPage() + 1)">
              Suivant
              <i class="lucide-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Template de chargement -->
        <ng-template #loadingTpl>
          <div class="loading-container">
            <app-loading-spinner></app-loading-spinner>
            <p>Chargement des publicités...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./advertisement-management.component.scss']
})
export class AdvertisementManagementComponent implements OnInit {
  filterForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private advertisementsSignal = signal<any[]>([]);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private statsSignal = signal({
    total: 0,
    active: 0,
    totalViews: 0,
    totalClicks: 0
  });

  public isLoading = this.isLoadingSignal.asReadonly();
  public advertisements = this.advertisementsSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
    this.loadAdvertisements();
    this.loadStats();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      status: [''],
      position: [''],
      startDate: ['']
    });
  }

  private loadAdvertisements() {
    this.isLoadingSignal.set(true);
    
    // Simulation de chargement
    setTimeout(() => {
      this.advertisementsSignal.set([
        {
          id: '1',
          title: 'Promotion spéciale fournisseurs',
          description: 'Rejoignez notre plateforme et bénéficiez de 20% de réduction sur votre première inscription',
          imageUrl: 'assets/images/ad1.jpg',
          clientName: 'CI-Tender',
          position: 'header',
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          views: 15420,
          clicks: 1234
        },
        {
          id: '2',
          title: 'Formation aux appels d\'offres',
          description: 'Formez-vous aux techniques de réponse aux appels d\'offres avec nos experts',
          imageUrl: 'assets/images/ad2.jpg',
          clientName: 'Institut de Formation',
          position: 'sidebar',
          status: 'active',
          startDate: new Date('2024-01-10'),
          endDate: new Date('2024-03-10'),
          views: 8920,
          clicks: 567
        },
        {
          id: '3',
          title: 'Certification qualité',
          description: 'Obtenez votre certification qualité pour augmenter vos chances de remporter des marchés',
          imageUrl: 'assets/images/ad3.jpg',
          clientName: 'Bureau de Certification',
          position: 'footer',
          status: 'scheduled',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-04-01'),
          views: 0,
          clicks: 0
        }
      ]);
      
      this.totalPagesSignal.set(1);
      this.isLoadingSignal.set(false);
    }, 1000);
  }

  private loadStats() {
    this.statsSignal.set({
      total: 15,
      active: 8,
      totalViews: 45678,
      totalClicks: 2345
    });
  }

  applyFilters() {
    this.currentPageSignal.set(1);
    this.loadAdvertisements();
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPageSignal.set(1);
    this.loadAdvertisements();
  }

  changePage(page: number) {
    this.currentPageSignal.set(page);
    this.loadAdvertisements();
  }

  getPageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      active: 'Actif',
      inactive: 'Inactif',
      scheduled: 'Programmé',
      expired: 'Expiré'
    };
    return labels[status] || status;
  }

  getPositionLabel(position: string): string {
    const labels: { [key: string]: string } = {
      header: 'En-tête',
      sidebar: 'Barre latérale',
      footer: 'Pied de page'
    };
    return labels[position] || position;
  }

  getCTR(ad: any): number {
    return ad.views > 0 ? Math.round((ad.clicks / ad.views) * 100 * 100) / 100 : 0;
  }

  createAdvertisement() {
    console.log('Bouton "Créer une publicité" cliqué');
    console.log('Router disponible:', this.router);
    console.log('Navigation vers:', '/admin/ads/create');
    this.router.navigate(['/admin/ads/create']);
  }

  editAdvertisement(ad: any) {
    this.router.navigate(['/admin/ads', ad.id, 'edit']);
  }

  viewStats(ad: any) {
    console.log('Voir les statistiques de la publicité:', ad.id);
  }

  toggleAdvertisementStatus(ad: any) {
    const action = ad.status === 'active' ? 'pauser' : 'activer';
    if (confirm(`Êtes-vous sûr de vouloir ${action} cette publicité ?`)) {
      console.log(`${action} la publicité:`, ad.id);
    }
  }

  deleteAdvertisement(ad: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      console.log('Supprimer la publicité:', ad.id);
      // Supprimer de la liste
      const ads = this.advertisements().filter(a => a.id !== ad.id);
      this.advertisementsSignal.set(ads);
    }
  }
} 
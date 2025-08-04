import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TenderService } from '../tender.service';
import { Tender, TenderFilter, TenderStatus, TenderType } from '../../../core/models/tender.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-tender-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="tender-list-page">
      <div class="container">
        <!-- Statistiques -->
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ totalTenders() }}</div>
            <div class="stat-label">Appels d'offres trouvés</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeTenders() }}</div>
            <div class="stat-label">Actifs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ closedTenders() }}</div>
            <div class="stat-label">Fermés</div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="main-content">
          <!-- Header avec filtres -->
          <div class="content-header">
            <div class="header-left">
              <h1>Appels d'offres</h1>
              <p>Découvrez les opportunités d'affaires disponibles en Côte d'Ivoire</p>
            </div>
            <div class="header-right">
              <button class="btn btn-outline" (click)="toggleFilters()">
                <span class="icon">🔍</span>
                Filtres
              </button>
              <button class="btn btn-primary" (click)="exportResults()">
                <span class="icon">📥</span>
                Exporter
              </button>
            </div>
          </div>

          <!-- Filtres -->
          <div class="filters-section" [class.active]="showFilters()">
            <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
              <div class="filters-grid">
                <div class="form-group">
                  <label>Recherche</label>
                  <input
                    type="text"
                    formControlName="keyword"
                    class="form-control"
                    placeholder="Rechercher par titre, description, organisation...">
                </div>

                <div class="form-group">
                  <label>Secteur</label>
                  <select formControlName="sector" class="form-control">
                    <option value="">Tous les secteurs</option>
                    <option *ngFor="let sector of sectors()" [value]="sector">{{ sector }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Type</label>
                  <select formControlName="type" class="form-control">
                    <option value="">Tous les types</option>
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Localisation</label>
                  <select formControlName="location" class="form-control">
                    <option value="">Toutes les localisations</option>
                    <option *ngFor="let location of locations()" [value]="location">{{ location }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Statut</label>
                  <select formControlName="status" class="form-control">
                    <option value="">Tous les statuts</option>
                    <option value="published">Publié</option>
                    <option value="closed">Fermé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Date de publication</label>
                  <input
                    type="date"
                    formControlName="dateFrom"
                    class="form-control">
                </div>
              </div>

              <div class="filters-actions">
                <button type="submit" class="btn btn-primary">
                  <span class="icon">🔍</span>
                  Appliquer les filtres
                </button>
                <button type="button" class="btn btn-outline" (click)="clearFilters()">
                  <span class="icon">❌</span>
                  Effacer
                </button>
              </div>
            </form>
          </div>

          <!-- Liste des appels d'offres -->
          <div class="tenders-section">
            <div class="loading-container" *ngIf="isLoading()">
              <app-loading-spinner></app-loading-spinner>
            </div>

            <div class="tenders-grid" *ngIf="!isLoading() && tenders().length > 0">
              <div class="tender-card" *ngFor="let tender of tenders()">
                <div class="tender-header">
                  <div class="tender-status" [class]="'status-' + tender.status">
                    {{ getStatusLabel(tender.status) }}
                  </div>
                  <div class="tender-type" [class]="'type-' + tender.type">
                    {{ tender.type === 'public' ? 'Public' : 'Privé' }}
                  </div>
                </div>

                <div class="tender-content">
                  <h3 class="tender-title">
                    <a [routerLink]="['/tenders', tender.id]">{{ tender.title }}</a>
                  </h3>
                  <p class="tender-description">{{ tender.description }}</p>
                  
                  <div class="tender-meta">
                    <div class="meta-item">
                      <span class="icon">🏢</span>
                      <span>{{ tender.organizationName }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="icon">📍</span>
                      <span>{{ tender.location }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="icon">📅</span>
                      <span>Échéance: {{ tender.deadline | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="icon">💰</span>
                      <span>{{ tender.estimatedAmount | number }} {{ tender.currency }}</span>
                    </div>
                  </div>

                  <div class="tender-footer">
                    <div class="time-remaining">
                      <span class="icon">⏰</span>
                      {{ getTimeRemaining(tender.deadline) }}
                    </div>
                    <button class="btn btn-primary btn-sm" (click)="downloadDocuments(tender)">
                      <span class="icon">📥</span>
                      Documents
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- État vide -->
            <div class="empty-state" *ngIf="!isLoading() && tenders().length === 0">
              <div class="empty-icon">
                <span class="icon">📄</span>
              </div>
              <h3>Aucun appel d'offres trouvé</h3>
              <p>Aucun appel d'offres ne correspond à vos critères de recherche.</p>
              <button class="btn btn-primary" (click)="clearFilters()">
                Effacer les filtres
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination-section" *ngIf="totalPages() > 1">
            <div class="pagination">
              <button 
                class="btn btn-outline" 
                [disabled]="currentPage() === 1"
                (click)="changePage(currentPage() - 1)">
                <span class="icon">←</span>
                Précédent
              </button>

              <div class="page-numbers">
                <button 
                  *ngFor="let page of getPageNumbers()"
                  class="btn"
                  [class.btn-primary]="page === currentPage()"
                  [class.btn-outline]="page !== currentPage()"
                  (click)="changePage(page)">
                  {{ page }}
                </button>
              </div>

              <button 
                class="btn btn-outline" 
                [disabled]="currentPage() === totalPages()"
                (click)="changePage(currentPage() + 1)">
                Suivant
                <span class="icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tender-list.component.scss']
})
export class TenderListComponent implements OnInit {
  filterForm!: FormGroup;
  private showFiltersSignal = signal(false);
  private tendersSignal = signal<Tender[]>([]);
  private totalSignal = signal(0);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private isLoadingSignal = signal(false);
  private sectorsSignal = signal<string[]>([]);
  private locationsSignal = signal<string[]>([]);

  public showFilters = this.showFiltersSignal.asReadonly();
  public tenders = this.tendersSignal.asReadonly();
  public totalTenders = this.totalSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public sectors = this.sectorsSignal.asReadonly();
  public locations = this.locationsSignal.asReadonly();

  public activeTenders = computed(() => 
    this.tenders().filter(t => t.status === 'published').length
  );
  public closedTenders = computed(() => 
    this.tenders().filter(t => t.status === 'closed').length
  );

  constructor(
    private fb: FormBuilder,
    private tenderService: TenderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTenders();
    this.loadSectors();
    this.loadLocations();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      sector: [''],
      type: [''],
      location: [''],
      status: [''],
      dateFrom: ['']
    });
  }

  private loadTenders() {
    this.isLoadingSignal.set(true);
    this.tenderService.getTenders().subscribe({
      next: (tenders) => {
        this.tendersSignal.set(tenders);
        this.totalSignal.set(tenders.length);
        this.totalPagesSignal.set(Math.ceil(tenders.length / 12));
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appels d\'offres:', error);
        this.isLoadingSignal.set(false);
      }
    });
  }

  private loadSectors() {
    // Utiliser les secteurs des appels d'offres existants
    this.tenderService.getTenders().subscribe({
      next: (tenders) => {
        const sectors = [...new Set(tenders.map(t => t.sector))];
        this.sectorsSignal.set(sectors);
      },
      error: (error) => console.error('Erreur lors du chargement des secteurs:', error)
    });
  }

  private loadLocations() {
    // Utiliser les localisations des appels d'offres existants
    this.tenderService.getTenders().subscribe({
      next: (tenders) => {
        const locations = [...new Set(tenders.map(t => t.location))];
        this.locationsSignal.set(locations);
      },
      error: (error) => console.error('Erreur lors du chargement des localisations:', error)
    });
  }

  applyFilters() {
    this.currentPageSignal.set(1);
    this.loadTenders();
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPageSignal.set(1);
    this.loadTenders();
  }

  changePage(page: number) {
    this.currentPageSignal.set(page);
    this.loadTenders();
  }

  toggleFilters() {
    this.showFiltersSignal.update(isOpen => !isOpen);
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
        pages.push(-1); // Separator
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1); // Separator
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Separator
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Separator
        pages.push(total);
      }
    }

    return pages;
  }

  getStatusLabel(status: TenderStatus): string {
    const labels = {
      [TenderStatus.DRAFT]: 'Brouillon',
      [TenderStatus.PUBLISHED]: 'Publié',
      [TenderStatus.CLOSED]: 'Fermé',
      [TenderStatus.CANCELLED]: 'Annulé'
    };
    return labels[status] || status;
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

  downloadDocuments(tender: Tender) {
    // Implémentation du téléchargement des documents
    console.log('Téléchargement des documents pour:', tender.id);
  }

  exportResults() {
    // Implémentation de l'export des résultats
    console.log('Export des résultats');
  }
} 
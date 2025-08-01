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
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Appels d'offres</h1>
            <p>Découvrez les opportunités d'affaires disponibles en Côte d'Ivoire</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="toggleFilters()">
              <i class="lucide-filter"></i>
              Filtres
            </button>
            <button class="btn btn-outline" (click)="exportResults()">
              <i class="lucide-download"></i>
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
                <i class="lucide-search"></i>
                Appliquer les filtres
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
            <span class="stat-number">{{ totalTenders() }}</span>
            <span class="stat-label">Appels d'offres trouvés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ activeTenders() }}</span>
            <span class="stat-label">Actifs</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ closedTenders() }}</span>
            <span class="stat-label">Fermés</span>
          </div>
        </div>

        <!-- Liste des appels d'offres -->
        <div class="tender-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="tender-grid" *ngIf="tenders().length > 0; else emptyTpl">
            <div class="tender-card" *ngFor="let tender of tenders()">
              <div class="tender-header">
                <div class="tender-type-badge" [class]="'badge-' + tender.type">
                  {{ tender.type === 'public' ? 'Public' : 'Privé' }}
                </div>
                <div class="tender-status" [class]="'status-' + tender.status">
                  {{ getStatusLabel(tender.status) }}
                </div>
              </div>

              <h3 class="tender-title">
                <a [routerLink]="['/tenders', tender.id]">{{ tender.title }}</a>
              </h3>

              <p class="tender-description">{{ tender.description | slice:0:150 }}...</p>

              <div class="tender-meta">
                <div class="meta-item">
                  <i class="lucide-building"></i>
                  {{ tender.organizationName }}
                </div>
                <div class="meta-item">
                  <i class="lucide-map-pin"></i>
                  {{ tender.location }}
                </div>
                <div class="meta-item">
                  <i class="lucide-tag"></i>
                  {{ tender.sector }}
                </div>
                <div class="meta-item">
                  <i class="lucide-calendar"></i>
                  Publié le {{ tender.publishDate | date:'dd/MM/yyyy' }}
                </div>
                <div class="meta-item">
                  <i class="lucide-clock"></i>
                  {{ getTimeRemaining(tender.deadline) }}
                </div>
              </div>

              <div class="tender-footer">
                <div class="tender-amount" *ngIf="tender.estimatedAmount">
                  <span class="amount-label">Montant estimé :</span>
                  <span class="amount-value">{{ tender.estimatedAmount | currency:'XOF':'symbol':'1.0-0' }}</span>
                </div>
                <div class="tender-actions">
                  <a [routerLink]="['/tenders', tender.id]" class="btn btn-primary btn-sm">
                    Voir détails
                  </a>
                  <button class="btn btn-outline btn-sm" (click)="downloadDocuments(tender)">
                    <i class="lucide-download"></i>
                    Documents
                  </button>
                </div>
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

        <!-- Templates -->
        <ng-template #loadingTpl>
          <div class="loading-container">
            <app-loading-spinner></app-loading-spinner>
            <p>Chargement des appels d'offres...</p>
          </div>
        </ng-template>

        <ng-template #emptyTpl>
          <div class="empty-state">
            <i class="lucide-file-text"></i>
            <h3>Aucun appel d'offres trouvé</h3>
            <p>Aucun appel d'offres ne correspond à vos critères de recherche.</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              Effacer les filtres
            </button>
          </div>
        </ng-template>
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
    this.initForm();
    this.loadSectors();
    this.loadLocations();
    this.loadTenders();
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

  private loadSectors() {
    this.tenderService.getSectors().subscribe({
      next: (sectors) => this.sectorsSignal.set(sectors),
      error: (error) => console.error('Erreur lors du chargement des secteurs:', error)
    });
  }

  private loadLocations() {
    this.tenderService.getLocations().subscribe({
      next: (locations) => this.locationsSignal.set(locations),
      error: (error) => console.error('Erreur lors du chargement des localisations:', error)
    });
  }

  private loadTenders() {
    this.isLoadingSignal.set(true);
    
    const filter: TenderFilter = this.filterForm.value;
    const page = this.currentPage();

    this.tenderService.getTenders(filter, page, 12).subscribe({
      next: (response) => {
        this.tendersSignal.set(response.tenders);
        this.totalSignal.set(response.total);
        this.totalPagesSignal.set(response.totalPages);
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appels d\'offres:', error);
        this.isLoadingSignal.set(false);
      }
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
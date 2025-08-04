import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { Supplier, SupplierFilter } from '../../../core/models/supplier.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="supplier-list-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Fournisseurs</h1>
            <p>Découvrez notre annuaire de fournisseurs certifiés et qualifiés</p>
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
                  placeholder="Rechercher par nom, description, secteur...">
              </div>

              <div class="form-group">
                <label>Secteur</label>
                <select formControlName="sector" class="form-control">
                  <option value="">Tous les secteurs</option>
                  <option *ngFor="let sector of sectors()" [value]="sector">{{ sector }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Ville</label>
                <select formControlName="city" class="form-control">
                  <option value="">Toutes les villes</option>
                  <option *ngFor="let city of cities()" [value]="city">{{ city }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Note minimum</label>
                <select formControlName="minRating" class="form-control">
                  <option value="">Toutes les notes</option>
                  <option value="4">4 étoiles et plus</option>
                  <option value="3">3 étoiles et plus</option>
                  <option value="2">2 étoiles et plus</option>
                </select>
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
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-number">{{ totalSuppliers() }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-card featured">
            <div class="stat-number">{{ featuredSuppliers() }}</div>
            <div class="stat-label">Recommandés</div>
          </div>
          <div class="stat-card verified">
            <div class="stat-number">{{ verifiedSuppliers() }}</div>
            <div class="stat-label">Vérifiés</div>
          </div>
        </div>

        <!-- Liste des fournisseurs -->
        <div class="suppliers-section">
          <div class="loading-container" *ngIf="isLoading()">
            <app-loading-spinner></app-loading-spinner>
          </div>

          <div class="suppliers-grid" *ngIf="!isLoading() && suppliers().length > 0">
            <div class="supplier-card" *ngFor="let supplier of suppliers()">
              <div class="supplier-header">
                <div class="supplier-logo">
                  <img [src]="supplier.logo || 'assets/images/supplier-placeholder.jpg'" [alt]="supplier.companyName">
                </div>
                <div class="supplier-badges">
                  <span class="badge verified" *ngIf="supplier.isVerified">
                    <i class="lucide-check-circle"></i>
                    Vérifié
                  </span>
                  <span class="badge featured" *ngIf="supplier.isFeatured">
                    <i class="lucide-star"></i>
                    Recommandé
                  </span>
                </div>
              </div>

              <div class="supplier-content">
                <h3 class="supplier-title">
                  <a [routerLink]="['/suppliers', supplier.id]">{{ supplier.companyName }}</a>
                </h3>
                <p class="supplier-description">{{ supplier.description }}</p>
                
                <div class="supplier-meta">
                  <div class="meta-item">
                    <i class="lucide-briefcase"></i>
                    <span>{{ supplier.sector }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="lucide-map-pin"></i>
                    <span>{{ supplier.city }}, {{ supplier.address }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="lucide-star"></i>
                    <span>{{ supplier.rating }}/5 ({{ supplier.reviewsCount }} avis)</span>
                  </div>
                  <div class="meta-item">
                    <i class="lucide-calendar"></i>
                    <span>Membre depuis {{ supplier.createdAt | date:'yyyy' }}</span>
                  </div>
                </div>

                <div class="supplier-footer">
                  <div class="supplier-tags">
                    <span class="tag" *ngFor="let service of supplier.services?.slice(0, 3)">{{ service }}</span>
                  </div>
                  <button class="btn btn-primary btn-sm" [routerLink]="['/suppliers', supplier.id]">
                    <i class="lucide-eye"></i>
                    Voir profil
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!isLoading() && suppliers().length === 0">
            <div class="empty-icon">
              <i class="lucide-users"></i>
            </div>
            <h3>Aucun fournisseur trouvé</h3>
            <p>Aucun fournisseur ne correspond à vos critères de recherche.</p>
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
              <i class="lucide-chevron-left"></i>
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
              <i class="lucide-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  filterForm!: FormGroup;
  private showFiltersSignal = signal(false);
  private suppliersSignal = signal<Supplier[]>([]);
  private totalSignal = signal(0);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private isLoadingSignal = signal(false);
  private sectorsSignal = signal<string[]>([]);
  private citiesSignal = signal<string[]>([]);

  public showFilters = this.showFiltersSignal.asReadonly();
  public suppliers = this.suppliersSignal.asReadonly();
  public totalSuppliers = this.totalSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public sectors = this.sectorsSignal.asReadonly();
  public cities = this.citiesSignal.asReadonly();

  public verifiedSuppliers = computed(() => 
    this.suppliers().filter(s => s.isVerified).length
  );
  public featuredSuppliers = computed(() => 
    this.suppliers().filter(s => s.isFeatured).length
  );

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSuppliers();
    this.loadSectors();
    this.loadCities();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      sector: [''],
      city: [''],
      rating: [''],
      isVerified: [false]
    });
  }

  private loadSuppliers() {
    this.isLoadingSignal.set(true);
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliersSignal.set(suppliers);
        this.totalSignal.set(suppliers.length);
        this.totalPagesSignal.set(Math.ceil(suppliers.length / 12));
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        this.isLoadingSignal.set(false);
      }
    });
  }

  private loadSectors() {
    // Utiliser les secteurs des fournisseurs existants
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        const sectors = [...new Set(suppliers.map(s => s.sector))];
        this.sectorsSignal.set(sectors);
      },
      error: (error) => console.error('Erreur lors du chargement des secteurs:', error)
    });
  }

  private loadCities() {
    // Utiliser les villes des fournisseurs existants
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        const cities = [...new Set(suppliers.map(s => s.city))];
        this.citiesSignal.set(cities);
      },
      error: (error) => console.error('Erreur lors du chargement des villes:', error)
    });
  }

  applyFilters() {
    this.currentPageSignal.set(1);
    this.loadSuppliers();
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPageSignal.set(1);
    this.loadSuppliers();
  }

  changePage(page: number) {
    this.currentPageSignal.set(page);
    this.loadSuppliers();
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

  contactSupplier(supplier: Supplier) {
    // Implémentation du contact
    console.log('Contact du fournisseur:', supplier.id);
  }

  exportResults() {
    // Implémentation de l'export
    console.log('Export des résultats');
  }
} 
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
            <h1>Annuaire des fournisseurs</h1>
            <p>Découvrez des fournisseurs qualifiés et certifiés en Côte d'Ivoire</p>
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
                  placeholder="Rechercher par nom, secteur, services...">
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
                <select formControlName="rating" class="form-control">
                  <option value="">Toutes les notes</option>
                  <option value="4">4 étoiles et plus</option>
                  <option value="3">3 étoiles et plus</option>
                  <option value="2">2 étoiles et plus</option>
                </select>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="isVerified">
                  <span class="checkmark"></span>
                  Fournisseurs vérifiés uniquement
                </label>
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
            <span class="stat-number">{{ totalSuppliers() }}</span>
            <span class="stat-label">Fournisseurs trouvés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ verifiedSuppliers() }}</span>
            <span class="stat-label">Vérifiés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ featuredSuppliers() }}</span>
            <span class="stat-label">En vedette</span>
          </div>
        </div>

        <!-- Liste des fournisseurs -->
        <div class="supplier-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="supplier-grid" *ngIf="suppliers().length > 0; else emptyTpl">
            <div class="supplier-card" *ngFor="let supplier of suppliers()">
              <div class="supplier-header">
                <img 
                  [src]="supplier.logo || 'assets/images/default-company.png'" 
                  [alt]="supplier.companyName"
                  class="supplier-logo">
                <div class="supplier-badges">
                  <span class="verified-badge" *ngIf="supplier.isVerified">
                    <i class="lucide-shield-check"></i>
                    Vérifié
                  </span>
                  <span class="featured-badge" *ngIf="supplier.isFeatured">
                    <i class="lucide-star"></i>
                    En vedette
                  </span>
                </div>
              </div>

              <h3 class="supplier-name">
                <a [routerLink]="['/suppliers', supplier.id]">{{ supplier.companyName }}</a>
              </h3>

              <p class="supplier-description">{{ supplier.description | slice:0:120 }}...</p>

              <div class="supplier-meta">
                <div class="meta-item">
                  <i class="lucide-briefcase"></i>
                  {{ supplier.sector }}
                </div>
                <div class="meta-item">
                  <i class="lucide-map-pin"></i>
                  {{ supplier.city }}
                </div>
                <div class="meta-item">
                  <i class="lucide-star"></i>
                  {{ supplier.rating }}/5 ({{ supplier.reviewsCount }} avis)
                </div>
                <div class="meta-item">
                  <i class="lucide-clock"></i>
                  {{ supplier.yearsOfExperience }} ans d'expérience
                </div>
              </div>

              <div class="supplier-services">
                <span 
                  class="service-tag" 
                  *ngFor="let service of supplier.services.slice(0, 3)">
                  {{ service }}
                </span>
                <span class="more-services" *ngIf="supplier.services.length > 3">
                  +{{ supplier.services.length - 3 }} autres
                </span>
              </div>

              <div class="supplier-footer">
                <div class="supplier-actions">
                  <a [routerLink]="['/suppliers', supplier.id]" class="btn btn-primary btn-sm">
                    Voir profil
                  </a>
                  <button class="btn btn-outline btn-sm" (click)="contactSupplier(supplier)">
                    <i class="lucide-mail"></i>
                    Contacter
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
            <p>Chargement des fournisseurs...</p>
          </div>
        </ng-template>

        <ng-template #emptyTpl>
          <div class="empty-state">
            <i class="lucide-users"></i>
            <h3>Aucun fournisseur trouvé</h3>
            <p>Aucun fournisseur ne correspond à vos critères de recherche.</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              Effacer les filtres
            </button>
          </div>
        </ng-template>
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
    this.initForm();
    this.loadSectors();
    this.loadCities();
    this.loadSuppliers();
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

  private loadSectors() {
    this.supplierService.getSectors().subscribe({
      next: (sectors) => this.sectorsSignal.set(sectors),
      error: (error) => console.error('Erreur lors du chargement des secteurs:', error)
    });
  }

  private loadCities() {
    this.supplierService.getCities().subscribe({
      next: (cities) => this.citiesSignal.set(cities),
      error: (error) => console.error('Erreur lors du chargement des villes:', error)
    });
  }

  private loadSuppliers() {
    this.isLoadingSignal.set(true);
    
    const filter: SupplierFilter = this.filterForm.value;
    const page = this.currentPage();

    this.supplierService.getSuppliers(filter, page, 12).subscribe({
      next: (response) => {
        this.suppliersSignal.set(response.suppliers);
        this.totalSignal.set(response.total);
        this.totalPagesSignal.set(response.totalPages);
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        this.isLoadingSignal.set(false);
      }
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
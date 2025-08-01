import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="supplier-management">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Gestion des fournisseurs</h1>
            <p>Gérez et modérez les fournisseurs de la plateforme</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="verifyPendingSuppliers()">
              <i class="lucide-shield-check"></i>
              Vérifier les demandes
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
                  placeholder="Rechercher par nom, secteur...">
              </div>

              <div class="form-group">
                <label>Statut de vérification</label>
                <select formControlName="verificationStatus" class="form-control">
                  <option value="">Tous les statuts</option>
                  <option value="verified">Vérifiés</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>

              <div class="form-group">
                <label>Secteur</label>
                <select formControlName="sector" class="form-control">
                  <option value="">Tous les secteurs</option>
                  <option value="informatique">Informatique</option>
                  <option value="batiment">Bâtiment</option>
                  <option value="services">Services</option>
                </select>
              </div>

              <div class="form-group">
                <label>Ville</label>
                <select formControlName="city" class="form-control">
                  <option value="">Toutes les villes</option>
                  <option value="abidjan">Abidjan</option>
                  <option value="yamoussoukro">Yamoussoukro</option>
                  <option value="bouake">Bouaké</option>
                </select>
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
            <span class="stat-number">{{ stats().verified }}</span>
            <span class="stat-label">Vérifiés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().pending }}</span>
            <span class="stat-label">En attente</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().featured }}</span>
            <span class="stat-label">En vedette</span>
          </div>
        </div>

        <!-- Liste des fournisseurs -->
        <div class="supplier-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" (change)="toggleSelectAll($event)">
                  </th>
                  <th>Fournisseur</th>
                  <th>Secteur</th>
                  <th>Ville</th>
                  <th>Note</th>
                  <th>Statut</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let supplier of suppliers()">
                  <td>
                    <input type="checkbox" [checked]="selectedSuppliers().includes(supplier.id)" (change)="toggleSupplierSelection(supplier.id)">
                  </td>
                  <td>
                    <div class="supplier-info">
                      <img 
                        [src]="supplier.logo || 'assets/images/default-company.png'" 
                        [alt]="supplier.companyName"
                        class="supplier-logo">
                      <div class="supplier-details">
                        <a [routerLink]="['/admin/suppliers', supplier.id]" class="supplier-name">
                          {{ supplier.companyName }}
                        </a>
                        <span class="supplier-email">{{ supplier.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ supplier.sector }}</td>
                  <td>{{ supplier.city }}</td>
                  <td>
                    <div class="rating">
                      <div class="stars">
                        <i 
                          *ngFor="let star of [1,2,3,4,5]" 
                          [class]="star <= supplier.rating ? 'lucide-star filled' : 'lucide-star'">
                        </i>
                      </div>
                      <span class="rating-value">{{ supplier.rating }}/5</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" [class]="'status-' + supplier.verificationStatus">
                      {{ getVerificationStatusLabel(supplier.verificationStatus) }}
                    </span>
                  </td>
                  <td>{{ supplier.registrationDate | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-sm btn-outline" (click)="viewSupplier(supplier)">
                        <i class="lucide-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline" (click)="editSupplier(supplier)">
                        <i class="lucide-edit"></i>
                      </button>
                      <button 
                        class="btn btn-sm" 
                        [class]="supplier.isFeatured ? 'btn-warning' : 'btn-outline'"
                        (click)="toggleFeatured(supplier)">
                        <i class="lucide-star"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="deleteSupplier(supplier)">
                        <i class="lucide-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Actions en lot -->
          <div class="bulk-actions" *ngIf="selectedSuppliers().length > 0">
            <div class="bulk-info">
              {{ selectedSuppliers().length }} élément(s) sélectionné(s)
            </div>
            <div class="bulk-buttons">
              <button class="btn btn-outline" (click)="bulkVerify()">
                <i class="lucide-shield-check"></i>
                Vérifier
              </button>
              <button class="btn btn-outline" (click)="bulkReject()">
                <i class="lucide-x"></i>
                Rejeter
              </button>
              <button class="btn btn-outline" (click)="bulkFeature()">
                <i class="lucide-star"></i>
                Mettre en vedette
              </button>
              <button class="btn btn-danger" (click)="bulkDelete()">
                <i class="lucide-trash"></i>
                Supprimer
              </button>
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
            <p>Chargement des fournisseurs...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./supplier-management.component.scss']
})
export class SupplierManagementComponent implements OnInit {
  filterForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private suppliersSignal = signal<any[]>([]);
  private selectedSuppliersSignal = signal<string[]>([]);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private statsSignal = signal({
    total: 0,
    verified: 0,
    pending: 0,
    featured: 0
  });

  public isLoading = this.isLoadingSignal.asReadonly();
  public suppliers = this.suppliersSignal.asReadonly();
  public selectedSuppliers = this.selectedSuppliersSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadSuppliers();
    this.loadStats();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      verificationStatus: [''],
      sector: [''],
      city: ['']
    });
  }

  private loadSuppliers() {
    this.isLoadingSignal.set(true);
    
    // Simulation de chargement
    setTimeout(() => {
      this.suppliersSignal.set([
        {
          id: '1',
          companyName: 'Tech Solutions CI',
          email: 'contact@techsolutions.ci',
          logo: 'assets/images/company1.png',
          sector: 'Informatique',
          city: 'Abidjan',
          rating: 4.5,
          verificationStatus: 'verified',
          isFeatured: true,
          registrationDate: new Date('2024-01-15')
        },
        {
          id: '2',
          companyName: 'Construction Plus',
          email: 'info@constructionplus.ci',
          logo: null,
          sector: 'Bâtiment',
          city: 'Yamoussoukro',
          rating: 4.2,
          verificationStatus: 'pending',
          isFeatured: false,
          registrationDate: new Date('2024-01-14')
        },
        {
          id: '3',
          companyName: 'Clean Services',
          email: 'contact@cleanservices.ci',
          logo: 'assets/images/company3.png',
          sector: 'Services',
          city: 'Abidjan',
          rating: 4.8,
          verificationStatus: 'verified',
          isFeatured: true,
          registrationDate: new Date('2024-01-13')
        }
      ]);
      
      this.totalPagesSignal.set(1);
      this.isLoadingSignal.set(false);
    }, 1000);
  }

  private loadStats() {
    this.statsSignal.set({
      total: 892,
      verified: 756,
      pending: 45,
      featured: 23
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

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      const allIds = this.suppliers().map(s => s.id);
      this.selectedSuppliersSignal.set(allIds);
    } else {
      this.selectedSuppliersSignal.set([]);
    }
  }

  toggleSupplierSelection(supplierId: string) {
    const current = this.selectedSuppliers();
    const index = current.indexOf(supplierId);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(supplierId);
    }
    
    this.selectedSuppliersSignal.set([...current]);
  }

  getVerificationStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      verified: 'Vérifié',
      pending: 'En attente',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  }

  verifyPendingSuppliers() {
    console.log('Vérifier les fournisseurs en attente');
  }

  viewSupplier(supplier: any) {
    console.log('Voir le fournisseur:', supplier.id);
  }

  editSupplier(supplier: any) {
    console.log('Éditer le fournisseur:', supplier.id);
  }

  toggleFeatured(supplier: any) {
    console.log('Basculer en vedette:', supplier.id);
  }

  deleteSupplier(supplier: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      console.log('Supprimer le fournisseur:', supplier.id);
    }
  }

  bulkVerify() {
    if (confirm(`Vérifier ${this.selectedSuppliers().length} fournisseur(s) ?`)) {
      console.log('Vérifier en lot:', this.selectedSuppliers());
    }
  }

  bulkReject() {
    if (confirm(`Rejeter ${this.selectedSuppliers().length} fournisseur(s) ?`)) {
      console.log('Rejeter en lot:', this.selectedSuppliers());
    }
  }

  bulkFeature() {
    if (confirm(`Mettre en vedette ${this.selectedSuppliers().length} fournisseur(s) ?`)) {
      console.log('Mettre en vedette en lot:', this.selectedSuppliers());
    }
  }

  bulkDelete() {
    if (confirm(`Supprimer ${this.selectedSuppliers().length} fournisseur(s) ?`)) {
      console.log('Supprimer en lot:', this.selectedSuppliers());
    }
  }
} 
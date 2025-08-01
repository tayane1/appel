import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-tender-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="tender-management-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Gestion des appels d'offres</h1>
            <p>Gérez et modérez les appels d'offres de la plateforme</p>
          </div>
          <div class="header-actions">
            <a routerLink="/admin/tenders/create" class="btn btn-primary">
              <i class="lucide-plus"></i>
              Créer un appel d'offres
            </a>
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
                  placeholder="Rechercher par titre, organisation...">
              </div>

              <div class="form-group">
                <label>Statut</label>
                <select formControlName="status" class="form-control">
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="closed">Fermé</option>
                  <option value="cancelled">Annulé</option>
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
            <span class="stat-number">{{ stats().published }}</span>
            <span class="stat-label">Publiés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().pending }}</span>
            <span class="stat-label">En attente</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().closed }}</span>
            <span class="stat-label">Fermés</span>
          </div>
        </div>

        <!-- Liste des appels d'offres -->
        <div class="tender-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" (change)="toggleSelectAll($event)">
                  </th>
                  <th>Titre</th>
                  <th>Organisation</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date de publication</th>
                  <th>Date limite</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let tender of tenders()" [class.selected]="selectedTenders().includes(tender.id)">
                  <td>
                    <input 
                      type="checkbox" 
                      [checked]="selectedTenders().includes(tender.id)"
                      (change)="toggleTenderSelection(tender.id)">
                  </td>
                  <td>
                    <div class="tender-title">
                      <strong>{{ tender.title }}</strong>
                      <span class="tender-location">{{ tender.location }}</span>
                    </div>
                  </td>
                  <td>{{ tender.organizationName }}</td>
                  <td>
                    <span class="badge" [class]="'badge-' + tender.type">
                      {{ tender.type === 'public' ? 'Public' : 'Privé' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class]="'badge-' + tender.status">
                      {{ getStatusLabel(tender.status) }}
                    </span>
                  </td>
                  <td>{{ tender.publishDate | date:'dd/MM/yyyy' }}</td>
                  <td>{{ tender.deadline | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline" (click)="viewTender(tender)" title="Voir">
                        <i class="lucide-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline" (click)="editTender(tender)" title="Modifier">
                        <i class="lucide-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="deleteTender(tender)" title="Supprimer">
                        <i class="lucide-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
                class="btn"
                [class]="page === currentPage() ? 'btn-primary' : 'btn-outline'"
                [disabled]="page === -1"
                (click)="page !== -1 ? changePage(page) : null">
                {{ page === -1 ? '...' : page }}
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

        <!-- Actions en lot -->
        <div class="bulk-actions" *ngIf="selectedTenders().length > 0">
          <div class="bulk-info">
            {{ selectedTenders().length }} élément(s) sélectionné(s)
          </div>
          <div class="bulk-buttons">
            <button class="btn btn-outline" (click)="bulkPublish()">
              <i class="lucide-check"></i>
              Publier
            </button>
            <button class="btn btn-outline" (click)="bulkClose()">
              <i class="lucide-lock"></i>
              Fermer
            </button>
            <button class="btn btn-danger" (click)="bulkDelete()">
              <i class="lucide-trash"></i>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template de chargement -->
    <ng-template #loadingTpl>
      <app-loading-spinner></app-loading-spinner>
    </ng-template>
  `,
  styleUrls: ['./tender-management.component.scss']
})
export class TenderManagementComponent implements OnInit {
  filterForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private tendersSignal = signal<any[]>([]);
  private selectedTendersSignal = signal<string[]>([]);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private statsSignal = signal({
    total: 0,
    published: 0,
    pending: 0,
    closed: 0
  });

  public isLoading = this.isLoadingSignal.asReadonly();
  public tenders = this.tendersSignal.asReadonly();
  public selectedTenders = this.selectedTendersSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
    this.loadTenders();
    this.loadStats();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      status: [''],
      type: [''],
      dateFrom: ['']
    });
  }

  private loadTenders() {
    this.isLoadingSignal.set(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      const mockTenders = [
        {
          id: '1',
          title: 'Construction d\'un bâtiment administratif',
          organizationName: 'Mairie d\'Abidjan',
          type: 'public',
          status: 'published',
          location: 'Abidjan',
          publishDate: new Date('2024-01-15'),
          deadline: new Date('2024-02-15')
        },
        {
          id: '2',
          title: 'Fourniture de matériel informatique',
          organizationName: 'Ministère de l\'Éducation',
          type: 'public',
          status: 'draft',
          location: 'Abidjan',
          publishDate: new Date('2024-01-10'),
          deadline: new Date('2024-02-10')
        },
        {
          id: '3',
          title: 'Services de maintenance informatique',
          organizationName: 'Banque Atlantique',
          type: 'private',
          status: 'published',
          location: 'Abidjan',
          publishDate: new Date('2024-01-20'),
          deadline: new Date('2024-02-20')
        }
      ];
      
      this.tendersSignal.set(mockTenders);
      this.totalPagesSignal.set(1);
      this.isLoadingSignal.set(false);
    }, 1000);
  }

  private loadStats() {
    this.statsSignal.set({
      total: 3,
      published: 2,
      pending: 1,
      closed: 0
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
      const allIds = this.tenders().map(t => t.id);
      this.selectedTendersSignal.set(allIds);
    } else {
      this.selectedTendersSignal.set([]);
    }
  }

  toggleTenderSelection(tenderId: string) {
    const selected = this.selectedTenders();
    const index = selected.indexOf(tenderId);
    
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(tenderId);
    }
    
    this.selectedTendersSignal.set([...selected]);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      draft: 'Brouillon',
      published: 'Publié',
      closed: 'Fermé',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  }

  editTender(tender: any) {
    this.router.navigate(['/admin/tenders', tender.id, 'edit']);
  }

  viewTender(tender: any) {
    console.log('Voir l\'appel d\'offres:', tender.id);
  }

  deleteTender(tender: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appel d\'offres ?')) {
      console.log('Supprimer l\'appel d\'offres:', tender.id);
      // Supprimer de la liste
      const tenders = this.tenders().filter(t => t.id !== tender.id);
      this.tendersSignal.set(tenders);
    }
  }

  bulkPublish() {
    console.log('Publier en lot:', this.selectedTenders());
  }

  bulkClose() {
    console.log('Fermer en lot:', this.selectedTenders());
  }

  bulkDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer les appels d\'offres sélectionnés ?')) {
      console.log('Supprimer en lot:', this.selectedTenders());
    }
  }
} 
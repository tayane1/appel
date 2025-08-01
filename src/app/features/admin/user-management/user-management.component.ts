import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="user-management">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Gestion des utilisateurs</h1>
            <p>Gérez les comptes utilisateurs de la plateforme</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="createUser()">
              <i class="lucide-user-plus"></i>
              Créer un utilisateur
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
                  placeholder="Rechercher par nom, email...">
              </div>

              <div class="form-group">
                <label>Rôle</label>
                <select formControlName="role" class="form-control">
                  <option value="">Tous les rôles</option>
                  <option value="admin">Administrateur</option>
                  <option value="user">Utilisateur</option>
                  <option value="supplier">Fournisseur</option>
                </select>
              </div>

              <div class="form-group">
                <label>Statut</label>
                <select formControlName="status" class="form-control">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>

              <div class="form-group">
                <label>Date d'inscription</label>
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
            <span class="stat-number">{{ stats().active }}</span>
            <span class="stat-label">Actifs</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().newThisMonth }}</span>
            <span class="stat-label">Nouveaux ce mois</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().suspended }}</span>
            <span class="stat-label">Suspendus</span>
          </div>
        </div>

        <!-- Liste des utilisateurs -->
        <div class="user-list" *ngIf="!isLoading(); else loadingTpl">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" (change)="toggleSelectAll($event)">
                  </th>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users()">
                  <td>
                    <input type="checkbox" [checked]="selectedUsers().includes(user.id)" (change)="toggleUserSelection(user.id)">
                  </td>
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">
                        <img 
                          [src]="user.avatar || 'assets/images/default-avatar.png'" 
                          [alt]="user.fullName">
                      </div>
                      <div class="user-details">
                        <span class="user-name">{{ user.fullName }}</span>
                        <span class="user-company" *ngIf="user.company">{{ user.company }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class]="'role-' + user.role">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" [class]="'status-' + user.status">
                      {{ getStatusLabel(user.status) }}
                    </span>
                  </td>
                  <td>{{ user.lastLogin | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ user.registrationDate | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-sm btn-outline" (click)="viewUser(user)">
                        <i class="lucide-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline" (click)="editUser(user)">
                        <i class="lucide-edit"></i>
                      </button>
                      <button 
                        class="btn btn-sm" 
                        [class]="user.status === 'suspended' ? 'btn-success' : 'btn-warning'"
                        (click)="toggleUserStatus(user)">
                        <i [class]="user.status === 'suspended' ? 'lucide-unlock' : 'lucide-lock'"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="deleteUser(user)">
                        <i class="lucide-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Actions en lot -->
          <div class="bulk-actions" *ngIf="selectedUsers().length > 0">
            <div class="bulk-info">
              {{ selectedUsers().length }} élément(s) sélectionné(s)
            </div>
            <div class="bulk-buttons">
              <button class="btn btn-outline" (click)="bulkActivate()">
                <i class="lucide-unlock"></i>
                Activer
              </button>
              <button class="btn btn-outline" (click)="bulkSuspend()">
                <i class="lucide-lock"></i>
                Suspendre
              </button>
              <button class="btn btn-outline" (click)="bulkDelete()">
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
            <p>Chargement des utilisateurs...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  filterForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private usersSignal = signal<any[]>([]);
  private selectedUsersSignal = signal<string[]>([]);
  private currentPageSignal = signal(1);
  private totalPagesSignal = signal(1);
  private statsSignal = signal({
    total: 0,
    active: 0,
    newThisMonth: 0,
    suspended: 0
  });

  public isLoading = this.isLoadingSignal.asReadonly();
  public users = this.usersSignal.asReadonly();
  public selectedUsers = this.selectedUsersSignal.asReadonly();
  public currentPage = this.currentPageSignal.asReadonly();
  public totalPages = this.totalPagesSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
    this.loadStats();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      role: [''],
      status: [''],
      dateFrom: ['']
    });
  }

  private loadUsers() {
    this.isLoadingSignal.set(true);
    
    // Simulation de chargement
    setTimeout(() => {
      this.usersSignal.set([
        {
          id: '1',
          fullName: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          avatar: 'assets/images/avatar1.png',
          company: 'Tech Solutions CI',
          role: 'supplier',
          status: 'active',
          lastLogin: new Date('2024-01-15T10:30:00'),
          registrationDate: new Date('2024-01-01')
        },
        {
          id: '2',
          fullName: 'Marie Martin',
          email: 'marie.martin@email.com',
          avatar: null,
          company: null,
          role: 'user',
          status: 'active',
          lastLogin: new Date('2024-01-14T15:45:00'),
          registrationDate: new Date('2024-01-05')
        },
        {
          id: '3',
          fullName: 'Admin System',
          email: 'admin@ci-tender.com',
          avatar: 'assets/images/admin-avatar.png',
          company: 'CI-Tender',
          role: 'admin',
          status: 'active',
          lastLogin: new Date('2024-01-15T09:15:00'),
          registrationDate: new Date('2023-12-01')
        }
      ]);
      
      this.totalPagesSignal.set(1);
      this.isLoadingSignal.set(false);
    }, 1000);
  }

  private loadStats() {
    this.statsSignal.set({
      total: 3456,
      active: 3120,
      newThisMonth: 156,
      suspended: 45
    });
  }

  applyFilters() {
    this.currentPageSignal.set(1);
    this.loadUsers();
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPageSignal.set(1);
    this.loadUsers();
  }

  changePage(page: number) {
    this.currentPageSignal.set(page);
    this.loadUsers();
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
      const allIds = this.users().map(u => u.id);
      this.selectedUsersSignal.set(allIds);
    } else {
      this.selectedUsersSignal.set([]);
    }
  }

  toggleUserSelection(userId: string) {
    const current = this.selectedUsers();
    const index = current.indexOf(userId);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(userId);
    }
    
    this.selectedUsersSignal.set([...current]);
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      admin: 'Administrateur',
      user: 'Utilisateur',
      supplier: 'Fournisseur'
    };
    return labels[role] || role;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    return labels[status] || status;
  }

  createUser() {
    console.log('Créer un nouvel utilisateur');
  }

  viewUser(user: any) {
    console.log('Voir l\'utilisateur:', user.id);
  }

  editUser(user: any) {
    console.log('Éditer l\'utilisateur:', user.id);
  }

  toggleUserStatus(user: any) {
    const action = user.status === 'suspended' ? 'réactiver' : 'suspendre';
    if (confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`)) {
      console.log(`${action} l'utilisateur:`, user.id);
    }
  }

  deleteUser(user: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('Supprimer l\'utilisateur:', user.id);
    }
  }

  bulkActivate() {
    if (confirm(`Activer ${this.selectedUsers().length} utilisateur(s) ?`)) {
      console.log('Activer en lot:', this.selectedUsers());
    }
  }

  bulkSuspend() {
    if (confirm(`Suspendre ${this.selectedUsers().length} utilisateur(s) ?`)) {
      console.log('Suspendre en lot:', this.selectedUsers());
    }
  }

  bulkDelete() {
    if (confirm(`Supprimer ${this.selectedUsers().length} utilisateur(s) ?`)) {
      console.log('Supprimer en lot:', this.selectedUsers());
    }
  }
} 
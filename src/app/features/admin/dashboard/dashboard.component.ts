import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="admin-dashboard">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble de la plateforme CI-Tender</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="refreshData()">
              <i class="lucide-refresh-cw"></i>
              Actualiser
            </button>
            <button class="btn btn-outline" (click)="exportReport()">
              <i class="lucide-download"></i>
              Exporter
            </button>
          </div>
        </div>

        <!-- Statistiques principales -->
        <div class="stats-grid" *ngIf="!isLoading(); else loadingTpl">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="lucide-file-text"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats().totalTenders }}</h3>
              <p>Appels d'offres</p>
              <span class="stat-change positive">
                <i class="lucide-trending-up"></i>
                +{{ stats().tendersGrowth }}%
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="lucide-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats().totalSuppliers }}</h3>
              <p>Fournisseurs</p>
              <span class="stat-change positive">
                <i class="lucide-trending-up"></i>
                +{{ stats().suppliersGrowth }}%
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="lucide-user"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats().totalUsers }}</h3>
              <p>Utilisateurs</p>
              <span class="stat-change positive">
                <i class="lucide-trending-up"></i>
                +{{ stats().usersGrowth }}%
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="lucide-eye"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats().totalViews }}</h3>
              <p>Vues</p>
              <span class="stat-change positive">
                <i class="lucide-trending-up"></i>
                +{{ stats().viewsGrowth }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Graphiques et analyses -->
        <div class="charts-section" *ngIf="!isLoading()">
          <div class="chart-grid">
            <!-- Graphique des appels d'offres par mois -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Appels d'offres par mois</h3>
                <div class="chart-actions">
                  <select class="form-control" (change)="updateTendersChart($event)">
                    <option value="6">6 derniers mois</option>
                    <option value="12">12 derniers mois</option>
                    <option value="24">24 derniers mois</option>
                  </select>
                </div>
              </div>
              <div class="chart-container">
                <canvas #tendersChart></canvas>
              </div>
            </div>

            <!-- Graphique des secteurs -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Répartition par secteur</h3>
              </div>
              <div class="chart-container">
                <canvas #sectorsChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div class="recent-activity" *ngIf="!isLoading()">
          <div class="activity-grid">
            <!-- Derniers appels d'offres -->
            <div class="activity-card">
              <div class="activity-header">
                <h3>Derniers appels d'offres</h3>
                <a routerLink="/admin/tenders" class="view-all">Voir tout</a>
              </div>
              <div class="activity-list">
                <div class="activity-item" *ngFor="let tender of recentTenders()">
                  <div class="activity-icon">
                    <i class="lucide-file-text"></i>
                  </div>
                  <div class="activity-content">
                    <h4>{{ tender.title }}</h4>
                    <p>{{ tender.organizationName }}</p>
                    <span class="activity-time">{{ tender.publishDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="activity-status" [class]="'status-' + tender.status">
                    {{ getStatusLabel(tender.status) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Nouveaux fournisseurs -->
            <div class="activity-card">
              <div class="activity-header">
                <h3>Nouveaux fournisseurs</h3>
                <a routerLink="/admin/suppliers" class="view-all">Voir tout</a>
              </div>
              <div class="activity-list">
                <div class="activity-item" *ngFor="let supplier of recentSuppliers()">
                  <div class="activity-icon">
                    <i class="lucide-users"></i>
                  </div>
                  <div class="activity-content">
                    <h4>{{ supplier.companyName }}</h4>
                    <p>{{ supplier.sector }}</p>
                    <span class="activity-time">{{ supplier.registrationDate | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="activity-status" [class]="supplier.isVerified ? 'verified' : 'pending'">
                    {{ supplier.isVerified ? 'Vérifié' : 'En attente' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="quick-actions" *ngIf="!isLoading()">
          <h3>Actions rapides</h3>
          <div class="actions-grid">
            <a routerLink="/admin/tenders/create" class="action-card">
              <i class="lucide-plus"></i>
              <h4>Créer un appel d'offres</h4>
              <p>Publier un nouvel appel d'offres</p>
            </a>
            <a routerLink="/admin/suppliers/verify" class="action-card">
              <i class="lucide-shield-check"></i>
              <h4>Vérifier des fournisseurs</h4>
              <p>Approuver les demandes de vérification</p>
            </a>
            <a routerLink="/admin/users" class="action-card">
              <i class="lucide-user-check"></i>
              <h4>Gérer les utilisateurs</h4>
              <p>Voir et gérer les comptes utilisateurs</p>
            </a>
            <a routerLink="/admin/ads" class="action-card">
              <i class="lucide-megaphone"></i>
              <h4>Gérer les publicités</h4>
              <p>Configurer les bannières publicitaires</p>
            </a>
          </div>
        </div>
      </div>

      <!-- Template de chargement -->
      <ng-template #loadingTpl>
        <div class="loading-container">
          <app-loading-spinner></app-loading-spinner>
          <p>Chargement du tableau de bord...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private isLoadingSignal = signal(false);
  private statsSignal = signal({
    totalTenders: 0,
    totalSuppliers: 0,
    totalUsers: 0,
    totalViews: 0,
    tendersGrowth: 0,
    suppliersGrowth: 0,
    usersGrowth: 0,
    viewsGrowth: 0
  });
  private recentTendersSignal = signal<any[]>([]);
  private recentSuppliersSignal = signal<any[]>([]);

  public isLoading = this.isLoadingSignal.asReadonly();
  public stats = this.statsSignal.asReadonly();
  public recentTenders = this.recentTendersSignal.asReadonly();
  public recentSuppliers = this.recentSuppliersSignal.asReadonly();

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.isLoadingSignal.set(true);
    
    // Simulation de chargement des données
    setTimeout(() => {
      this.statsSignal.set({
        totalTenders: 1247,
        totalSuppliers: 892,
        totalUsers: 3456,
        totalViews: 15678,
        tendersGrowth: 12,
        suppliersGrowth: 8,
        usersGrowth: 15,
        viewsGrowth: 23
      });

      this.recentTendersSignal.set([
        {
          id: '1',
          title: 'Fourniture de matériel informatique',
          organizationName: 'Ministère de l\'Éducation',
          publishDate: new Date('2024-01-15'),
          status: 'published'
        },
        {
          id: '2',
          title: 'Construction d\'un pont',
          organizationName: 'Ministère des Travaux Publics',
          publishDate: new Date('2024-01-14'),
          status: 'published'
        },
        {
          id: '3',
          title: 'Services de nettoyage',
          organizationName: 'Hôpital Général',
          publishDate: new Date('2024-01-13'),
          status: 'closed'
        }
      ]);

      this.recentSuppliersSignal.set([
        {
          id: '1',
          companyName: 'Tech Solutions CI',
          sector: 'Informatique',
          registrationDate: new Date('2024-01-15'),
          isVerified: true
        },
        {
          id: '2',
          companyName: 'Construction Plus',
          sector: 'Bâtiment',
          registrationDate: new Date('2024-01-14'),
          isVerified: false
        },
        {
          id: '3',
          companyName: 'Clean Services',
          sector: 'Services',
          registrationDate: new Date('2024-01-13'),
          isVerified: true
        }
      ]);

      this.isLoadingSignal.set(false);
    }, 1000);
  }

  refreshData() {
    this.loadDashboardData();
  }

  exportReport() {
    // Implémentation de l'export
    console.log('Export du rapport');
  }

  updateTendersChart(event: any) {
    // Implémentation de la mise à jour du graphique
    console.log('Mise à jour du graphique:', event.target.value);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      published: 'Publié',
      closed: 'Fermé',
      cancelled: 'Annulé',
      draft: 'Brouillon'
    };
    return labels[status] || status;
  }
} 
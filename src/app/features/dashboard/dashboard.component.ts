import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page prozorro-section">
      <div class="container">
        <!-- Header -->
        <div class="dashboard-header">
          <h1 class="form-title">Tableau de bord</h1>
          <p class="form-subtitle">Bienvenue, {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
        </div>

        <!-- Statistiques -->
        <div class="stats-grid prozorro-grid">
          <div class="stat-card card-prozorro">
            <div class="card-header">
              <span class="icon icon-lg">📊</span>
              <h3>Appels d'offres consultés</h3>
            </div>
            <div class="card-body">
              <div class="stat-number ukraine-wave">24</div>
              <p class="stat-label">Ce mois</p>
            </div>
          </div>

          <div class="stat-card card-prozorro">
            <div class="card-header">
              <span class="icon icon-lg">⭐</span>
              <h3>Favoris</h3>
            </div>
            <div class="card-body">
              <div class="stat-number ukraine-wave">8</div>
              <p class="stat-label">Appels d'offres</p>
            </div>
          </div>

          <div class="stat-card card-prozorro">
            <div class="card-header">
              <span class="icon icon-lg">🔔</span>
              <h3>Alertes actives</h3>
            </div>
            <div class="card-body">
              <div class="stat-number ukraine-wave">3</div>
              <p class="stat-label">Secteurs surveillés</p>
            </div>
          </div>

          <div class="stat-card card-prozorro">
            <div class="card-header">
              <span class="icon icon-lg">📄</span>
              <h3>Documents téléchargés</h3>
            </div>
            <div class="card-body">
              <div class="stat-number ukraine-wave">12</div>
              <p class="stat-label">Ce mois</p>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="quick-actions prozorro-section">
          <h2 class="section-title">Actions rapides</h2>
          <div class="actions-grid prozorro-grid">
            <a routerLink="/tenders" class="action-card card-prozorro">
              <span class="icon icon-lg">🔍</span>
              <h3>Rechercher des appels d'offres</h3>
              <p>Parcourez les derniers appels d'offres publiés</p>
            </a>

            <a routerLink="/suppliers" class="action-card card-prozorro">
              <span class="icon icon-lg">🏢</span>
              <h3>Consulter les fournisseurs</h3>
              <p>Découvrez les entreprises partenaires</p>
            </a>

            <div class="action-card card-prozorro">
              <span class="icon icon-lg">⚙️</span>
              <h3>Paramètres du compte</h3>
              <p>Gérez vos préférences et alertes</p>
            </div>

            <div class="action-card card-prozorro">
              <span class="icon icon-lg">📧</span>
              <h3>Mes alertes</h3>
              <p>Configurez vos notifications</p>
            </div>
          </div>
        </div>

        <!-- Appels d'offres récents -->
        <div class="recent-tenders prozorro-section">
          <div class="section-header">
            <h2 class="section-title">Appels d'offres récents</h2>
            <a routerLink="/tenders" class="btn-ukraine btn-yellow">Voir tout</a>
          </div>
          <div class="tenders-grid prozorro-grid">
            <div class="tender-card card-prozorro" *ngFor="let tender of recentTenders()">
              <div class="card-header">
                <span class="badge-ukraine" [class]="tender.type === 'public' ? 'badge-orange' : 'badge-green'">
                  {{ tender.type === 'public' ? 'Public' : 'Privé' }}
                </span>
                <span class="tender-date">{{ tender.deadline }}</span>
              </div>
              <div class="card-body">
                <h3 class="tender-title">{{ tender.title }}</h3>
                <p class="tender-description">{{ tender.description }}</p>
                <div class="tender-meta">
                  <span class="meta-item">
                    <span class="icon">🏢</span>
                    {{ tender.organization }}
                  </span>
                  <span class="meta-item">
                    <span class="icon">📍</span>
                    {{ tender.location }}
                  </span>
                </div>
              </div>
              <div class="card-footer">
                <a [routerLink]="['/tenders', tender.id]" class="btn-ukraine">Voir détails</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public currentUser = this.authService.currentUser;

  private recentTendersSignal = signal([
    {
      id: 1,
      title: 'Fourniture de matériel informatique',
      description: 'Acquisition de matériel informatique pour les services administratifs',
      type: 'public',
      organization: 'Ministère des Finances',
      location: 'Abidjan',
      deadline: '15/08/2024'
    },
    {
      id: 2,
      title: 'Construction d\'une école primaire',
      description: 'Construction et équipement d\'une école primaire de 6 classes',
      type: 'public',
      organization: 'Ministère de l\'Éducation',
      location: 'Bouaké',
      deadline: '20/08/2024'
    },
    {
      id: 3,
      title: 'Services de maintenance informatique',
      description: 'Contrat de maintenance informatique pour les systèmes gouvernementaux',
      type: 'private',
      organization: 'Agence Nationale de l\'Informatique',
      location: 'Abidjan',
      deadline: '25/08/2024'
    }
  ]);

  public recentTenders = this.recentTendersSignal.asReadonly();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Le composant est déjà initialisé avec les données mockées
  }
} 
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../../../core/models/supplier.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="supplier-detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/suppliers">Fournisseurs</a>
          <i class="lucide-chevron-right"></i>
          <span>Profil</span>
        </nav>

        <!-- Loading -->
        <div class="loading-container" *ngIf="isLoading(); else contentTpl">
          <app-loading-spinner></app-loading-spinner>
          <p>Chargement du profil fournisseur...</p>
        </div>

        <!-- Contenu principal -->
        <ng-template #contentTpl>
          <div class="supplier-detail" *ngIf="supplier(); else notFoundTpl">
            <!-- Header -->
            <div class="supplier-header">
              <div class="supplier-info">
                <img 
                  [src]="supplier()?.logo || 'assets/images/default-company.png'" 
                  [alt]="supplier()?.companyName"
                  class="supplier-logo">
                <div class="supplier-details">
                  <h1 class="supplier-name">{{ supplier()?.companyName }}</h1>
                  <p class="supplier-tagline">{{ supplier()?.tagline }}</p>
                  <div class="supplier-badges">
                    <span class="verified-badge" *ngIf="supplier()?.isVerified">
                      <i class="lucide-shield-check"></i>
                      Vérifié
                    </span>
                    <span class="featured-badge" *ngIf="supplier()?.isFeatured">
                      <i class="lucide-star"></i>
                      En vedette
                    </span>
                  </div>
                </div>
              </div>

              <div class="supplier-rating">
                <div class="rating-stars">
                  <i 
                    *ngFor="let star of [1,2,3,4,5]" 
                    [class]="star <= (supplier()?.rating || 0) ? 'lucide-star filled' : 'lucide-star'">
                  </i>
                </div>
                <span class="rating-value">{{ supplier()?.rating }}/5</span>
                <span class="rating-count">({{ supplier()?.reviewsCount }} avis)</span>
              </div>
            </div>

            <div class="supplier-content">
              <!-- Colonne principale -->
              <div class="main-content">
                <!-- Description -->
                <section class="content-section">
                  <h2>À propos</h2>
                  <div class="description-content">
                    <p>{{ supplier()?.description }}</p>
                  </div>
                </section>

                <!-- Services -->
                <section class="content-section">
                  <h2>Services proposés</h2>
                  <div class="services-grid">
                    <div class="service-item" *ngFor="let service of supplier()?.services">
                      <i class="lucide-check-circle"></i>
                      <span>{{ service }}</span>
                    </div>
                  </div>
                </section>

                <!-- Expérience -->
                <section class="content-section">
                  <h2>Expérience et expertise</h2>
                  <div class="experience-info">
                    <div class="experience-item">
                      <i class="lucide-clock"></i>
                      <div class="experience-details">
                        <span class="experience-label">Années d'expérience</span>
                        <span class="experience-value">{{ supplier()?.yearsOfExperience }} ans</span>
                      </div>
                    </div>
                    <div class="experience-item">
                      <i class="lucide-briefcase"></i>
                      <div class="experience-details">
                        <span class="experience-label">Secteur d'activité</span>
                        <span class="experience-value">{{ supplier()?.sector }}</span>
                      </div>
                    </div>
                    <div class="experience-item">
                      <i class="lucide-award"></i>
                      <div class="experience-details">
                        <span class="experience-label">Certifications</span>
                        <span class="experience-value">{{ supplier()?.certifications?.length || 0 }} certification(s)</span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Projets réalisés -->
                <section class="content-section" *ngIf="supplier()?.projects?.length">
                  <h2>Projets réalisés</h2>
                  <div class="projects-grid">
                    <div class="project-item" *ngFor="let project of supplier()?.projects">
                      <div class="project-header">
                        <h4>{{ project.title }}</h4>
                        <span class="project-year">{{ project.year }}</span>
                      </div>
                      <p class="project-description">{{ project.description }}</p>
                      <div class="project-meta">
                        <span class="project-client">{{ project.client }}</span>
                        <span class="project-value">{{ project.value | currency:'XOF':'symbol':'1.0-0' }}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Avis clients -->
                <section class="content-section" *ngIf="supplier()?.reviews?.length">
                  <h2>Avis clients</h2>
                  <div class="reviews-list">
                    <div class="review-item" *ngFor="let review of supplier()?.reviews">
                      <div class="review-header">
                        <div class="reviewer-info">
                          <span class="reviewer-name">{{ review.reviewerName }}</span>
                          <span class="review-date">{{ review.date | date:'dd/MM/yyyy' }}</span>
                        </div>
                        <div class="review-rating">
                          <i 
                            *ngFor="let star of [1,2,3,4,5]" 
                            [class]="star <= review.rating ? 'lucide-star filled' : 'lucide-star'">
                          </i>
                        </div>
                      </div>
                      <p class="review-comment">{{ review.comment }}</p>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Sidebar -->
              <div class="sidebar">
                <!-- Informations de contact -->
                <div class="contact-card">
                  <h3>Contact</h3>
                  <div class="contact-info">
                    <div class="contact-item">
                      <i class="lucide-mail"></i>
                      <a [href]="'mailto:' + supplier()?.email">{{ supplier()?.email }}</a>
                    </div>
                    <div class="contact-item" *ngIf="supplier()?.phone">
                      <i class="lucide-phone"></i>
                      <a [href]="'tel:' + supplier()?.phone">{{ supplier()?.phone }}</a>
                    </div>
                    <div class="contact-item" *ngIf="supplier()?.website">
                      <i class="lucide-globe"></i>
                      <a [href]="supplier()?.website" target="_blank">{{ supplier()?.website }}</a>
                    </div>
                    <div class="contact-item">
                      <i class="lucide-map-pin"></i>
                      <span>{{ supplier()?.address }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="actions-card">
                  <button class="btn btn-primary btn-lg" (click)="contactSupplier()">
                    <i class="lucide-mail"></i>
                    Contacter
                  </button>
                  <button class="btn btn-outline" (click)="requestQuote()">
                    <i class="lucide-file-text"></i>
                    Demander un devis
                  </button>
                  <button class="btn btn-outline" (click)="shareSupplier()">
                    <i class="lucide-share-2"></i>
                    Partager
                  </button>
                </div>

                <!-- Statistiques -->
                <div class="stats-card">
                  <h3>Statistiques</h3>
                  <div class="stats-list">
                    <div class="stat-item">
                      <span class="stat-label">Projets réalisés</span>
                      <span class="stat-value">{{ supplier()?.projects?.length || 0 }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Clients satisfaits</span>
                      <span class="stat-value">{{ supplier()?.satisfiedClients || 0 }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Taux de réussite</span>
                      <span class="stat-value">{{ supplier()?.successRate || 0 }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Certifications -->
                <div class="certifications-card" *ngIf="supplier()?.certifications?.length">
                  <h3>Certifications</h3>
                  <div class="certifications-list">
                    <div class="certification-item" *ngFor="let cert of supplier()?.certifications">
                      <i class="lucide-award"></i>
                      <span>{{ cert }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Not found -->
        <ng-template #notFoundTpl>
          <div class="not-found">
            <i class="lucide-user-x"></i>
            <h2>Fournisseur non trouvé</h2>
            <p>Le fournisseur que vous recherchez n'existe pas ou a été supprimé.</p>
            <a routerLink="/suppliers" class="btn btn-primary">
              Retour aux fournisseurs
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent implements OnInit {
  private supplierSignal = signal<Supplier | null>(null);
  private isLoadingSignal = signal(false);

  public supplier = this.supplierSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSupplier();
  }

  private loadSupplier() {
    this.isLoadingSignal.set(true);
    
    const supplierId = this.route.snapshot.paramMap.get('id');
    if (!supplierId) {
      this.router.navigate(['/suppliers']);
      return;
    }

    this.supplierService.getSupplierById(supplierId).subscribe({
      next: (supplier) => {
        this.supplierSignal.set(supplier);
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du fournisseur:', error);
        this.isLoadingSignal.set(false);
      }
    });
  }

  contactSupplier() {
    // Implémentation du contact
    console.log('Contact du fournisseur:', this.supplier()?.id);
  }

  requestQuote() {
    // Implémentation de la demande de devis
    console.log('Demande de devis pour:', this.supplier()?.id);
  }

  shareSupplier() {
    // Implémentation du partage
    if (navigator.share) {
      navigator.share({
        title: this.supplier()?.companyName,
        text: this.supplier()?.description,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  }
} 
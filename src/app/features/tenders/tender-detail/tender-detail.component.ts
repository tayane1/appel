import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../tender.service';
import { Tender, TenderStatus, TenderDocument } from '../../../core/models/tender.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-tender-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="tender-detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/tenders">Appels d'offres</a>
          <i class="lucide-chevron-right"></i>
          <span>Détails</span>
        </nav>

        <!-- Loading -->
        <div class="loading-container" *ngIf="isLoading(); else contentTpl">
          <app-loading-spinner></app-loading-spinner>
          <p>Chargement de l'appel d'offres...</p>
        </div>

        <!-- Contenu principal -->
        <ng-template #contentTpl>
          <div class="tender-detail" *ngIf="tender(); else notFoundTpl">
            <!-- Header -->
            <div class="tender-header">
              <div class="tender-badges">
                <div class="tender-type-badge" [class]="'badge-' + tender()?.type">
                  {{ tender()?.type === 'public' ? 'Public' : 'Privé' }}
                </div>
                <div class="tender-status" [class]="'status-' + tender()?.status">
                  {{ getStatusLabel(tender()?.status) }}
                </div>
              </div>

              <h1 class="tender-title">{{ tender()?.title }}</h1>
              
              <div class="tender-meta">
                <div class="meta-item">
                  <i class="lucide-building"></i>
                  <span>{{ tender()?.organizationName }}</span>
                </div>
                <div class="meta-item">
                  <i class="lucide-map-pin"></i>
                  <span>{{ tender()?.location }}</span>
                </div>
                <div class="meta-item">
                  <i class="lucide-tag"></i>
                  <span>{{ tender()?.sector }}</span>
                </div>
                <div class="meta-item">
                  <i class="lucide-calendar"></i>
                  <span>Publié le {{ tender()?.publishDate | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="meta-item">
                  <i class="lucide-clock"></i>
                  <span>{{ getTimeRemaining(tender()?.deadline) }}</span>
                </div>
              </div>
            </div>

            <div class="tender-content">
              <!-- Colonne principale -->
              <div class="main-content">
                <!-- Description -->
                <section class="content-section">
                  <h2>Description</h2>
                  <div class="description-content">
                    <p>{{ tender()?.description }}</p>
                  </div>
                </section>

                <!-- Exigences -->
                <section class="content-section" *ngIf="tender()?.requirements?.length">
                  <h2>Exigences</h2>
                  <ul class="requirements-list">
                    <li *ngFor="let requirement of tender()?.requirements">
                      {{ requirement }}
                    </li>
                  </ul>
                </section>

                <!-- Documents -->
                <section class="content-section" *ngIf="tender()?.documents?.length">
                  <h2>Documents</h2>
                  <div class="documents-list">
                    <div class="document-item" *ngFor="let document of tender()?.documents">
                      <div class="document-info">
                        <i class="lucide-file-text"></i>
                        <div class="document-details">
                          <span class="document-name">{{ document.name }}</span>
                          <span class="document-size">{{ formatFileSize(document.size) }}</span>
                        </div>
                      </div>
                      <button class="btn btn-outline btn-sm" (click)="downloadDocument(document)">
                        <i class="lucide-download"></i>
                        Télécharger
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Sidebar -->
              <div class="sidebar">
                <!-- Informations clés -->
                <div class="info-card">
                  <h3>Informations clés</h3>
                  <div class="info-list">
                    <div class="info-item" *ngIf="tender()?.estimatedAmount">
                      <span class="info-label">Montant estimé</span>
                      <span class="info-value">{{ tender()?.estimatedAmount | currency:'XOF':'symbol':'1.0-0' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Référence</span>
                      <span class="info-value">{{ tender()?.reference }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Date limite</span>
                      <span class="info-value">{{ tender()?.deadline | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Devise</span>
                      <span class="info-value">{{ tender()?.currency }}</span>
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                <div class="contact-card">
                  <h3>Contact</h3>
                  <div class="contact-info">
                    <div class="contact-item">
                      <i class="lucide-mail"></i>
                      <a [href]="'mailto:' + tender()?.contactEmail">{{ tender()?.contactEmail }}</a>
                    </div>
                    <div class="contact-item" *ngIf="tender()?.contactPhone">
                      <i class="lucide-phone"></i>
                      <a [href]="'tel:' + tender()?.contactPhone">{{ tender()?.contactPhone }}</a>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="actions-card">
                  <button class="btn btn-primary btn-lg" (click)="applyForTender()">
                    <i class="lucide-send"></i>
                    Postuler
                  </button>
                  <button class="btn btn-outline" (click)="shareTender()">
                    <i class="lucide-share-2"></i>
                    Partager
                  </button>
                  <button class="btn btn-outline" (click)="saveTender()">
                    <i class="lucide-bookmark"></i>
                    Sauvegarder
                  </button>
                </div>

                <!-- Fournisseurs similaires -->
                <div class="similar-card">
                  <h3>Fournisseurs similaires</h3>
                  <p>Découvrez des fournisseurs spécialisés dans ce secteur</p>
                  <a routerLink="/suppliers" class="btn btn-outline">
                    Voir les fournisseurs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Not found -->
        <ng-template #notFoundTpl>
          <div class="not-found">
            <i class="lucide-file-x"></i>
            <h2>Appel d'offres non trouvé</h2>
            <p>L'appel d'offres que vous recherchez n'existe pas ou a été supprimé.</p>
            <a routerLink="/tenders" class="btn btn-primary">
              Retour aux appels d'offres
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit {
  private tenderSignal = signal<Tender | null>(null);
  private loadingSignal = signal(false);

  public tender = this.tenderSignal.asReadonly();
  public isLoading = this.loadingSignal.asReadonly();

  constructor(
    private tenderService: TenderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const tenderId = this.route.snapshot.paramMap.get('id');
    if (tenderId) {
      this.tenderService.getTender(tenderId).subscribe({
        next: (tender: Tender | null) => {
          if (tender) {
            this.tenderSignal.set(tender);
            this.loadingSignal.set(false);
          } else {
            this.router.navigate(['/tenders']);
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement de l\'appel d\'offres:', error);
          this.router.navigate(['/tenders']);
        }
      });
    }
  }

  getStatusLabel(status: TenderStatus | undefined): string {
    if (!status) return '';
    
    const labels = {
      [TenderStatus.DRAFT]: 'Brouillon',
      [TenderStatus.PUBLISHED]: 'Publié',
      [TenderStatus.CLOSED]: 'Fermé',
      [TenderStatus.CANCELLED]: 'Annulé'
    };
    return labels[status] || status;
  }

  getTimeRemaining(deadline: Date | undefined): string {
    if (!deadline) return '';
    
    const now = new Date();
    const diff = new Date(deadline).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expiré';
    if (days === 0) return 'Dernier jour';
    if (days === 1) return '1 jour restant';
    return `${days} jours restants`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadDocument(tenderDocument: TenderDocument) {
    // Simulation du téléchargement
    const link = document.createElement('a');
    link.href = tenderDocument.url;
    link.download = tenderDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  applyForTender() {
    // Implémentation de la postulation
    console.log('Postulation pour l\'appel d\'offres:', this.tender()?.id);
  }

  shareTender() {
    // Implémentation du partage
    if (navigator.share) {
      navigator.share({
        title: this.tender()?.title,
        text: this.tender()?.description,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  }

  saveTender() {
    // Implémentation de la sauvegarde
    console.log('Sauvegarde de l\'appel d\'offres:', this.tender()?.id);
  }
} 
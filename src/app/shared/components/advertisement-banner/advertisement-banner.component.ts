import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Advertisement, AdPosition, AdType } from '../../../core/models/advertisement.model';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-advertisement-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="ad-banner"
      [class.vertical]="isVertical()"
      [class.left]="advertisement()?.position === 'left'"
      [class.right]="advertisement()?.position === 'right'"
      (click)="onAdClick()">
      
      <div class="ad-content">
        <div class="ad-image">
          <img [src]="getImageUrl()" [alt]="advertisement()?.title">
        </div>
        
        <div class="ad-text">
          <h3>{{ advertisement()?.title || 'Promouvez votre entreprise' }}</h3>
          <p>{{ advertisement()?.description || 'Faites-vous connaître auprès de milliers de professionnels' }}</p>
          
          <button class="btn btn-primary" *ngIf="!isVertical()">
            En savoir plus
          </button>
        </div>
      </div>
      
      <div class="ad-badge" *ngIf="!isVertical()">
        <span class="badge-icon">🌿</span>
        <span>Publicité</span>
      </div>
    </div>
  `,
  styleUrls: ['./advertisement-banner.component.scss']
})
export class AdvertisementBannerComponent implements OnInit {
  @Input() position: AdPosition = AdPosition.TOP;
  
  advertisement = signal<Advertisement | null>(null);
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialiser avec une publicité par défaut
    const defaultAd: Advertisement = {
      id: 'default',
      title: 'Promouvez votre entreprise',
      description: 'Faites-vous connaître auprès de milliers de professionnels',
      imageUrl: '',
      linkUrl: '/promote',
                type: AdType.BANNER,
      position: this.position,
      isActive: true,
      startDate: new Date(),
      endDate: new Date('2024-12-31'),
      clickCount: 0,
      impressionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.advertisement.set(defaultAd);
  }
  
  ngOnInit() {
    this.loadAdvertisement();
  }
  
  private loadAdvertisement() {
    this.apiService.getRandomAdvertisement(this.position).subscribe({
      next: (ad) => {
        if (ad) {
          this.advertisement.set(ad);
        }
      },
      error: (error) => {
        console.error('Erreur chargement publicité:', error);
      }
    });
  }
  
  isVertical(): boolean {
    return this.position === AdPosition.LEFT || this.position === AdPosition.RIGHT;
  }
  
  getImageUrl(): string {
    const ad = this.advertisement();
    // Toujours utiliser l'image par défaut SVG pour éviter les erreurs 404
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">CI-Tender</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dy=".3em">Plateforme</text>
        <text x="50%" y="80%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Appels d'offres</text>
      </svg>
    `);
  }
  
  onAdClick() {
    const ad = this.advertisement();
    if (ad) {
      // Simuler un clic sur la publicité
      console.log('Publicité cliquée:', ad.title);
      
      // Rediriger vers l'URL de la publicité
      if (ad.linkUrl.startsWith('http')) {
        window.open(ad.linkUrl, '_blank');
      } else {
        this.router.navigate([ad.linkUrl]);
      }
    }
  }
} 
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdPosition } from '../../../core/models/advertisement.model';

@Component({
  selector: 'app-advertisement-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ad-banner" [class]="'position-' + position">
      <div class="container">
        <div class="ad-content">
          <div class="ad-text">
            <h3>Promouvez votre entreprise</h3>
            <p>Faites-vous connaître auprès de milliers de professionnels</p>
            <a href="#" class="btn btn-primary" style="color: black;">En savoir plus</a>
          </div>
          <div class="ad-image">
            <img src="assets/images/ad-placeholder.jpg" alt="Publicité">
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./advertisement-banner.component.scss']
})
export class AdvertisementBannerComponent {
  @Input() position: AdPosition = AdPosition.MIDDLE;
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer footer-ukraine">
      <div class="container">
        <div class="footer-content">
          <!-- Section principale -->
          <div class="footer-main">
            <div class="footer-brand">
              <div class="brand">
                <div class="ivory-coast-flag" style="width: 2.5rem; height: 2.5rem; display: flex;">
                  <div class="flag-stripe orange" style="flex: 1; background-color: #ff7900;"></div>
                  <div class="flag-stripe white" style="flex: 1; background-color: #ffffff;"></div>
                  <div class="flag-stripe green" style="flex: 1; background-color: #00a651;"></div>
                </div>
                <span class="brand-name">CI-Tender</span>
              </div>
              <p class="brand-description">
                La plateforme de référence des appels d'offres en Côte d'Ivoire. 
                Connectez-vous avec des fournisseurs qualifiés et développez votre entreprise.
              </p>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook">
                  <span class="icon">📘</span>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <span class="icon">🐦</span>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <span class="icon">💼</span>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <span class="icon">📷</span>
                </a>
              </div>
            </div>

            <!-- Liens rapides -->
            <div class="footer-links">
              <div class="link-group footer-section">
                <h3>Appels d'offres</h3>
                <ul>
                  <li><a routerLink="/tenders">Tous les appels d'offres</a></li>
                  <li><a href="#">Appels d'offres publics</a></li>
                  <li><a href="#">Appels d'offres privés</a></li>
                  <li><a href="#">Alertes email</a></li>
                </ul>
              </div>

              <div class="link-group footer-section">
                <h3>Fournisseurs</h3>
                <ul>
                  <li><a routerLink="/suppliers">Annuaire fournisseurs</a></li>
                  <li><a href="#">Fournisseurs vérifiés</a></li>
                  <li><a href="#">Inscription fournisseur</a></li>
                  <li><a href="#">Certifications</a></li>
                </ul>
              </div>

              <div class="link-group footer-section">
                <h3>Services</h3>
                <ul>
                  <li><a href="#">Publication d'appels d'offres</a></li>
                  <li><a href="#">Recherche avancée</a></li>
                  <li><a href="#">Statistiques</a></li>
                  <li><a href="#">API publique</a></li>
                </ul>
              </div>

              <div class="link-group footer-section">
                <h3>Support</h3>
                <ul>
                  <li><a href="#">Centre d'aide</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Signalement</a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Section inférieure -->
          <div class="footer-bottom">
            <div class="footer-info">
              <p>&copy; 2024 CI-Tender. Tous droits réservés.</p>
              <div class="legal-links">
                <a href="#">Conditions d'utilisation</a>
                <a href="#">Politique de confidentialité</a>
                <a href="#">Mentions légales</a>
              </div>
            </div>
            <div class="footer-stats">
              <div class="stat">
                <span class="stat-number ukraine-wave">247</span>
                <span class="stat-label">Appels d'offres actifs</span>
              </div>
              <div class="stat">
                <span class="stat-number ukraine-wave">1,542</span>
                <span class="stat-label">Fournisseurs</span>
              </div>
              <div class="stat">
                <span class="stat-number ukraine-wave">856</span>
                <span class="stat-label">Marchés conclus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {} 
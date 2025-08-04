import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="background-pattern"></div>
        <div class="background-overlay"></div>
      </div>
      
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-container">
              <div class="ivory-coast-flag">
                <div class="flag-stripe orange"></div>
                <div class="flag-stripe white"></div>
                <div class="flag-stripe green"></div>
              </div>
              <div class="logo-text">
                <span class="logo-title">CI-Tender</span>
                <span class="logo-subtitle">Plateforme d'Appels d'Offres</span>
              </div>
            </div>
          </div>
          
          <div class="welcome-section">
            <h1>Bienvenue</h1>
            <p>Connectez-vous à votre espace d'administration</p>
          </div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Votre adresse email"
                [class.error]="isFieldInvalid('email')"
                required>
              <div class="input-focus-border"></div>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {{ getFieldError('email') }}
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                formControlName="password"
                placeholder="Votre mot de passe"
                [class.error]="isFieldInvalid('password')"
                required>
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                <svg *ngIf="!showPassword()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showPassword()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
              <div class="input-focus-border"></div>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {{ getFieldError('password') }}
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary login-btn"
              [disabled]="loginForm.invalid || isLoading()">
              <span *ngIf="!isLoading()" class="btn-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10,17 15,12 10,7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Se connecter
              </span>
              <span *ngIf="isLoading()" class="loading-spinner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                Connexion en cours...
              </span>
            </button>
          </div>

          <div class="error-alert" *ngIf="errorMessage()">
            <div class="alert-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="alert-content">
              <strong>Erreur de connexion</strong>
              <p>{{ errorMessage() }}</p>
            </div>
          </div>
        </form>

        <div class="login-footer">
          <a href="/" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Retour au site public
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private errorMessageSignal = signal('');
  private showPasswordSignal = signal(false);

  public isLoading = this.isLoadingSignal.asReadonly();
  public errorMessage = this.errorMessageSignal.asReadonly();
  public showPassword = this.showPasswordSignal.asReadonly();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (field.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }
    return '';
  }

  togglePassword() {
    this.showPasswordSignal.update(value => !value);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoadingSignal.set(true);
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoadingSignal.set(false);
          // Rediriger vers le dashboard admin
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.isLoadingSignal.set(false);
          this.errorMessageSignal.set('Erreur de connexion. Veuillez réessayer.');
          console.error('Erreur de connexion:', error);
        }
      });
    }
  }

  quickLogin(type: 'demo' | 'admin') {
    const credentials = type === 'admin' 
      ? { email: 'admin@ci-tender.com', password: 'admin123' }
      : { email: 'user@ci-tender.com', password: 'user123' };

    this.loginForm.patchValue(credentials);
    this.onSubmit();
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
} 
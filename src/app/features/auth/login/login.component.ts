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
    <div class="auth-page form-container">
      <div class="auth-container">
        <div class="auth-card content-card">
          <!-- Header -->
          <div class="auth-header">
            <div class="brand">
              <div class="ivory-coast-flag" style="width: 2.5rem; height: 2.5rem; display: flex;">
                <div class="flag-stripe orange" style="flex: 1; background-color: #ff7900;"></div>
                <div class="flag-stripe white" style="flex: 1; background-color: #ffffff;"></div>
                <div class="flag-stripe green" style="flex: 1; background-color: #00a651;"></div>
              </div>
              <h1 class="form-title">CI-Tender</h1>
            </div>
            <h2 class="form-title">Connexion à votre compte</h2>
            <p class="form-subtitle">Accédez à la plateforme d'appels d'offres de Côte d'Ivoire</p>
          </div>

          <!-- Formulaire -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email" class="form-label">Adresse email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control form-input"
                [class.error]="isFieldInvalid('email')"
                placeholder="votre@email.com">
              <div class="form-error" *ngIf="isFieldInvalid('email')">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">L'email est requis</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Format d'email invalide</span>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Mot de passe</label>
              <div class="password-input">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  formControlName="password"
                  class="form-control form-input"
                  [class.error]="isFieldInvalid('password')"
                  placeholder="Votre mot de passe">
                <button
                  type="button"
                  class="password-toggle"
                  (click)="togglePassword()">
                  <span class="icon">{{ showPassword() ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              <div class="form-error" *ngIf="isFieldInvalid('password')">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe">
                <span class="checkmark"></span>
                <span class="form-text">Se souvenir de moi</span>
              </label>
              <a routerLink="/forgot-password" class="form-link">Mot de passe oublié ?</a>
            </div>

            <!-- Erreur générale -->
            <div class="form-error" *ngIf="errorMessage()">
              <span class="icon">⚠️</span>
              {{ errorMessage() }}
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg submit-btn"
              [disabled]="loginForm.invalid || isLoading()">
              <app-loading-spinner *ngIf="isLoading()"></app-loading-spinner>
              <span>{{ isLoading() ? 'Connexion...' : 'Se connecter' }}</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="auth-footer">
            <p class="form-text">Vous n'avez pas de compte ?</p>
            <a routerLink="/register" class="form-link">Créer un compte</a>
          </div>

          <!-- Séparateur -->
          <div class="separator">
            <span class="form-text">ou</span>
          </div>

          <!-- Connexion rapide (demo) -->
          <div class="quick-login">
            <button
              type="button"
              class="btn btn-outline"
              (click)="quickLogin('demo')">
              Connexion démo utilisateur
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              (click)="quickLogin('admin')">
              Connexion démo admin
            </button>
          </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="auth-info content-card">
          <h3 class="form-title">Pourquoi rejoindre CI-Tender ?</h3>
          <ul>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Accès aux appels d'offres publics et privés</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Annuaire complet des fournisseurs</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Alertes personnalisées par email</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Téléchargement des documents d'appel d'offres</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private showPasswordSignal = signal(false);
  private errorMessageSignal = signal('');

  public isLoading = this.isLoadingSignal.asReadonly();
  public showPassword = this.showPasswordSignal.asReadonly();
  public errorMessage = this.errorMessageSignal.asReadonly();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword() {
    this.showPasswordSignal.update(show => !show);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoadingSignal.set(true);
      this.errorMessageSignal.set('');

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoadingSignal.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoadingSignal.set(false);
          this.errorMessageSignal.set(
            error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.'
          );
        }
      });
    } else {
      this.markFormGroupTouched();
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
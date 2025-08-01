import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
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
            <h2 class="form-title">Créer votre compte</h2>
            <p class="form-subtitle">Rejoignez la plateforme d'appels d'offres de Côte d'Ivoire</p>
          </div>

          <!-- Formulaire -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  class="form-control form-input"
                  [class.error]="isFieldInvalid('firstName')"
                  placeholder="Votre prénom">
                <div class="form-error" *ngIf="isFieldInvalid('firstName')">
                  <span *ngIf="registerForm.get('firstName')?.errors?.['required']">Le prénom est requis</span>
                </div>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  class="form-control form-input"
                  [class.error]="isFieldInvalid('lastName')"
                  placeholder="Votre nom">
                <div class="form-error" *ngIf="isFieldInvalid('lastName')">
                  <span *ngIf="registerForm.get('lastName')?.errors?.['required']">Le nom est requis</span>
                </div>
              </div>
            </div>

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
                <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
              </div>
            </div>

            <div class="form-group">
              <label for="phoneNumber" class="form-label">Numéro de téléphone</label>
              <input
                type="tel"
                id="phoneNumber"
                formControlName="phoneNumber"
                class="form-control form-input"
                [class.error]="isFieldInvalid('phoneNumber')"
                placeholder="+225 0123456789">
              <div class="form-error" *ngIf="isFieldInvalid('phoneNumber')">
                <span *ngIf="registerForm.get('phoneNumber')?.errors?.['pattern']">Format de téléphone invalide</span>
              </div>
            </div>

            <div class="form-group">
              <label for="company" class="form-label">Entreprise (optionnel)</label>
              <input
                type="text"
                id="company"
                formControlName="company"
                class="form-control form-input"
                placeholder="Nom de votre entreprise">
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
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Le mot de passe doit contenir au moins 8 caractères</span>
                <span *ngIf="registerForm.get('password')?.errors?.['pattern']">Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
              <div class="password-input">
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  class="form-control form-input"
                  [class.error]="isFieldInvalid('confirmPassword')"
                  placeholder="Confirmez votre mot de passe">
                <button
                  type="button"
                  class="password-toggle"
                  (click)="toggleConfirmPassword()">
                  <span class="icon">{{ showConfirmPassword() ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              <div class="form-error" *ngIf="isFieldInvalid('confirmPassword')">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">La confirmation du mot de passe est requise</span>
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Les mots de passe ne correspondent pas</span>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="acceptTerms">
                <span class="checkmark"></span>
                <span class="form-text">J'accepte les <a href="#" class="form-link">conditions d'utilisation</a> et la <a href="#" class="form-link">politique de confidentialité</a></span>
              </label>
              <div class="form-error" *ngIf="isFieldInvalid('acceptTerms')">
                <span *ngIf="registerForm.get('acceptTerms')?.errors?.['required']">Vous devez accepter les conditions d'utilisation</span>
              </div>
            </div>

            <!-- Erreur générale -->
            <div class="form-error" *ngIf="errorMessage()">
              <span class="icon">⚠️</span>
              {{ errorMessage() }}
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg submit-btn"
              [disabled]="registerForm.invalid || isLoading()">
              <app-loading-spinner *ngIf="isLoading()"></app-loading-spinner>
              <span>{{ isLoading() ? 'Création du compte...' : 'Créer mon compte' }}</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="auth-footer">
            <p class="form-text">Vous avez déjà un compte ?</p>
            <a routerLink="/login" class="form-link">Se connecter</a>
          </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="auth-info content-card">
          <h3 class="form-title">Avantages de l'inscription</h3>
          <ul>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Accès complet aux appels d'offres</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Alertes personnalisées par email</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Téléchargement des documents</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Contact direct avec les fournisseurs</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Statistiques et analyses</span>
            </li>
            <li>
              <span class="icon">✅</span>
              <span class="form-text">Support client prioritaire</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  private isLoadingSignal = signal(false);
  private showPasswordSignal = signal(false);
  private showConfirmPasswordSignal = signal(false);
  private errorMessageSignal = signal('');

  public isLoading = this.isLoadingSignal.asReadonly();
  public showPassword = this.showPasswordSignal.asReadonly();
  public showConfirmPassword = this.showConfirmPasswordSignal.asReadonly();
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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+225\s?\d{8,10}$/)]],
      company: [''],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword() {
    this.showPasswordSignal.update(show => !show);
  }

  toggleConfirmPassword() {
    this.showConfirmPasswordSignal.update(show => !show);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoadingSignal.set(true);
      this.errorMessageSignal.set('');

      const userData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phoneNumber: this.registerForm.value.phoneNumber,
        company: this.registerForm.value.company,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoadingSignal.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoadingSignal.set(false);
          this.errorMessageSignal.set(
            error.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.'
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
} 
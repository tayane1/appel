import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-page prozorro-section">
      <div class="container">
        <!-- Header -->
        <div class="profile-header">
          <h1 class="form-title">Mon Profil</h1>
          <p class="form-subtitle">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div class="profile-content">
          <!-- Informations personnelles -->
          <div class="profile-section card-prozorro">
            <div class="section-header">
              <h2 class="section-title">Informations personnelles</h2>
              <span class="icon icon-lg">👤</span>
            </div>
            
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
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
                    <span *ngIf="profileForm.get('firstName')?.errors?.['required']">Le prénom est requis</span>
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
                    <span *ngIf="profileForm.get('lastName')?.errors?.['required']">Le nom est requis</span>
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
                    <span *ngIf="profileForm.get('email')?.errors?.['required']">L'email est requis</span>
                    <span *ngIf="profileForm.get('email')?.errors?.['email']">Format d'email invalide</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="phoneNumber" class="form-label">Numéro de téléphone</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    formControlName="phoneNumber"
                    class="form-control form-input"
                    placeholder="+225 0123456789">
                </div>

                <div class="form-group full-width">
                  <label for="company" class="form-label">Entreprise</label>
                  <input
                    type="text"
                    id="company"
                    formControlName="company"
                    class="form-control form-input"
                    placeholder="Nom de votre entreprise">
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-ukraine"
                  [disabled]="profileForm.invalid || isLoading()">
                  <span *ngIf="isLoading()">Enregistrement...</span>
                  <span *ngIf="!isLoading()">Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Sécurité -->
          <div class="profile-section card-prozorro">
            <div class="section-header">
              <h2 class="section-title">Sécurité</h2>
              <span class="icon icon-lg">🔒</span>
            </div>
            
            <form [formGroup]="passwordForm" (ngSubmit)="onPasswordChange()">
              <div class="form-grid">
                <div class="form-group">
                  <label for="currentPassword" class="form-label">Mot de passe actuel</label>
                  <div class="password-input">
                    <input
                      [type]="showCurrentPassword() ? 'text' : 'password'"
                      id="currentPassword"
                      formControlName="currentPassword"
                      class="form-control form-input"
                      [class.error]="isPasswordFieldInvalid('currentPassword')"
                      placeholder="Votre mot de passe actuel">
                    <button
                      type="button"
                      class="password-toggle"
                      (click)="toggleCurrentPassword()">
                      <span class="icon">{{ showCurrentPassword() ? '🙈' : '👁️' }}</span>
                    </button>
                  </div>
                  <div class="form-error" *ngIf="isPasswordFieldInvalid('currentPassword')">
                    <span *ngIf="passwordForm.get('currentPassword')?.errors?.['required']">Le mot de passe actuel est requis</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="newPassword" class="form-label">Nouveau mot de passe</label>
                  <div class="password-input">
                    <input
                      [type]="showNewPassword() ? 'text' : 'password'"
                      id="newPassword"
                      formControlName="newPassword"
                      class="form-control form-input"
                      [class.error]="isPasswordFieldInvalid('newPassword')"
                      placeholder="Nouveau mot de passe">
                    <button
                      type="button"
                      class="password-toggle"
                      (click)="toggleNewPassword()">
                      <span class="icon">{{ showNewPassword() ? '🙈' : '👁️' }}</span>
                    </button>
                  </div>
                  <div class="form-error" *ngIf="isPasswordFieldInvalid('newPassword')">
                    <span *ngIf="passwordForm.get('newPassword')?.errors?.['required']">Le nouveau mot de passe est requis</span>
                    <span *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
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
                      [class.error]="isPasswordFieldInvalid('confirmPassword')"
                      placeholder="Confirmer le nouveau mot de passe">
                    <button
                      type="button"
                      class="password-toggle"
                      (click)="toggleConfirmPassword()">
                      <span class="icon">{{ showConfirmPassword() ? '🙈' : '👁️' }}</span>
                    </button>
                  </div>
                  <div class="form-error" *ngIf="isPasswordFieldInvalid('confirmPassword')">
                    <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['required']">La confirmation est requise</span>
                    <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['passwordMismatch']">Les mots de passe ne correspondent pas</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-ukraine btn-yellow"
                  [disabled]="passwordForm.invalid || isPasswordLoading()">
                  <span *ngIf="isPasswordLoading()">Modification...</span>
                  <span *ngIf="!isPasswordLoading()">Modifier le mot de passe</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Préférences -->
          <div class="profile-section card-prozorro">
            <div class="section-header">
              <h2 class="section-title">Préférences</h2>
              <span class="icon icon-lg">⚙️</span>
            </div>
            
            <div class="preferences-grid">
              <div class="preference-item">
                <div class="preference-info">
                  <h3>Notifications par email</h3>
                  <p>Recevoir des alertes par email pour les nouveaux appels d'offres</p>
                </div>
                <label class="switch">
                  <input type="checkbox" [checked]="preferences.emailNotifications" (change)="toggleEmailNotifications()">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="preference-item">
                <div class="preference-info">
                  <h3>Notifications push</h3>
                  <p>Recevoir des notifications push dans le navigateur</p>
                </div>
                <label class="switch">
                  <input type="checkbox" [checked]="preferences.pushNotifications" (change)="togglePushNotifications()">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="preference-item">
                <div class="preference-info">
                  <h3>Mode sombre</h3>
                  <p>Utiliser le thème sombre par défaut</p>
                </div>
                <label class="switch">
                  <input type="checkbox" [checked]="preferences.darkMode" (change)="toggleDarkMode()">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  private isLoadingSignal = signal(false);
  private isPasswordLoadingSignal = signal(false);
  private showCurrentPasswordSignal = signal(false);
  private showNewPasswordSignal = signal(false);
  private showConfirmPasswordSignal = signal(false);
  
  public isLoading = this.isLoadingSignal.asReadonly();
  public isPasswordLoading = this.isPasswordLoadingSignal.asReadonly();
  public showCurrentPassword = this.showCurrentPasswordSignal.asReadonly();
  public showNewPassword = this.showNewPasswordSignal.asReadonly();
  public showConfirmPassword = this.showConfirmPasswordSignal.asReadonly();
  
  public currentUser = this.authService.currentUser;
  
  preferences = {
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadUserData();
  }

  private initForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      company: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private loadUserData() {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        company: user.company || ''
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  toggleCurrentPassword() {
    this.showCurrentPasswordSignal.update(show => !show);
  }

  toggleNewPassword() {
    this.showNewPasswordSignal.update(show => !show);
  }

  toggleConfirmPassword() {
    this.showConfirmPasswordSignal.update(show => !show);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoadingSignal.set(true);
      
      // Simulation de mise à jour
      setTimeout(() => {
        this.isLoadingSignal.set(false);
        // Ici vous ajouteriez la logique de mise à jour réelle
        console.log('Profil mis à jour:', this.profileForm.value);
      }, 1000);
    }
  }

  onPasswordChange() {
    if (this.passwordForm.valid) {
      this.isPasswordLoadingSignal.set(true);
      
      // Simulation de changement de mot de passe
      setTimeout(() => {
        this.isPasswordLoadingSignal.set(false);
        this.passwordForm.reset();
        // Ici vous ajouteriez la logique de changement de mot de passe réelle
        console.log('Mot de passe modifié');
      }, 1000);
    }
  }

  toggleEmailNotifications() {
    this.preferences.emailNotifications = !this.preferences.emailNotifications;
  }

  togglePushNotifications() {
    this.preferences.pushNotifications = !this.preferences.pushNotifications;
  }

  toggleDarkMode() {
    this.preferences.darkMode = !this.preferences.darkMode;
  }
} 
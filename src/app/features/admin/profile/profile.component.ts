import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-profile">
      <div class="profile-header">
        <h1>Mon Profil Administrateur</h1>
        <p>Gérez vos informations personnelles et vos paramètres de compte</p>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar">
              <span class="avatar-text">AD</span>
            </div>
            <h3>Administrateur CI-Tender</h3>
            <p>admin&#64;ci-tender.com</p>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  placeholder="Votre prénom">
              </div>
              <div class="form-group">
                <label for="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  placeholder="Votre nom">
              </div>
            </div>

            <div class="form-group">
              <label for="email">Adresse email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="votre@email.com">
            </div>

            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                placeholder="+225 27 22 49 12 34">
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="profileForm.invalid || isSaving()">
                <span *ngIf="!isSaving()">Enregistrer les modifications</span>
                <span *ngIf="isSaving()" class="loading-spinner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                  Enregistrement...
                </span>
              </button>
            </div>
          </form>
        </div>

        <div class="profile-card">
          <h3>Changer le mot de passe</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="password-form">
            <div class="form-group">
              <label for="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                formControlName="currentPassword"
                placeholder="Votre mot de passe actuel">
            </div>

            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                formControlName="newPassword"
                placeholder="Nouveau mot de passe">
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe">
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-secondary"
                [disabled]="passwordForm.invalid || isChangingPassword()">
                <span *ngIf="!isChangingPassword()">Changer le mot de passe</span>
                <span *ngIf="isChangingPassword()" class="loading-spinner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                  Modification...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  private isSavingSignal = signal(false);
  private isChangingPasswordSignal = signal(false);

  public isSaving = this.isSavingSignal.asReadonly();
  public isChangingPassword = this.isChangingPasswordSignal.asReadonly();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadProfile();
  }

  private initForms() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  private loadProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSavingSignal.set(true);
      // Simulation de la sauvegarde
      setTimeout(() => {
        this.isSavingSignal.set(false);
        console.log('Profil mis à jour:', this.profileForm.value);
      }, 1000);
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        console.error('Les mots de passe ne correspondent pas');
        return;
      }

      this.isChangingPasswordSignal.set(true);
      // Simulation du changement de mot de passe
      setTimeout(() => {
        this.isChangingPasswordSignal.set(false);
        this.passwordForm.reset();
        console.log('Mot de passe changé');
      }, 1000);
    }
  }
} 
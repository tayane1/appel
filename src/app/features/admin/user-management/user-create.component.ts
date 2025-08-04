import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="user-create">
      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>Créer un nouvel utilisateur</h1>
            <p>Ajoutez un nouveau compte utilisateur à la plateforme</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline" routerLink="/admin/users">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Retour à la liste
            </button>
          </div>
        </div>

        <div class="form-container">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
            <div class="form-section">
              <h3>Informations personnelles</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    placeholder="Prénom de l'utilisateur"
                    [class.error]="isFieldInvalid('firstName')">
                  <div class="error-message" *ngIf="isFieldInvalid('firstName')">
                    {{ getFieldError('firstName') }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    placeholder="Nom de l'utilisateur"
                    [class.error]="isFieldInvalid('lastName')">
                  <div class="error-message" *ngIf="isFieldInvalid('lastName')">
                    {{ getFieldError('lastName') }}
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Adresse email *</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  placeholder="email@exemple.com"
                  [class.error]="isFieldInvalid('email')">
                <div class="error-message" *ngIf="isFieldInvalid('email')">
                  {{ getFieldError('email') }}
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  placeholder="+225 27 22 49 12 34">
              </div>

              <div class="form-group">
                <label for="company">Entreprise</label>
                <input
                  type="text"
                  id="company"
                  formControlName="company"
                  placeholder="Nom de l'entreprise">
              </div>
            </div>

            <div class="form-section">
              <h3>Paramètres du compte</h3>
              
              <div class="form-group">
                <label for="role">Rôle *</label>
                <select
                  id="role"
                  formControlName="role"
                  [class.error]="isFieldInvalid('role')">
                  <option value="">Sélectionner un rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="user">Utilisateur</option>
                  <option value="supplier">Fournisseur</option>
                </select>
                <div class="error-message" *ngIf="isFieldInvalid('role')">
                  {{ getFieldError('role') }}
                </div>
              </div>

              <div class="form-group">
                <label for="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  formControlName="password"
                  placeholder="Mot de passe sécurisé"
                  [class.error]="isFieldInvalid('password')">
                <div class="error-message" *ngIf="isFieldInvalid('password')">
                  {{ getFieldError('password') }}
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  [class.error]="isFieldInvalid('confirmPassword')">
                <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
                  {{ getFieldError('confirmPassword') }}
                </div>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="isActive">
                  <span class="checkmark"></span>
                  Compte actif
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="userForm.invalid || isSaving()">
                <span *ngIf="!isSaving()">Créer l'utilisateur</span>
                <span *ngIf="isSaving()" class="loading-spinner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                  Création en cours...
                </span>
              </button>
              <button
                type="button"
                class="btn btn-outline"
                routerLink="/admin/users">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  private isSavingSignal = signal(false);
  public isSaving = this.isSavingSignal.asReadonly();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      isActive: [true]
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
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
    }
    return '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSavingSignal.set(true);
      
      // Simulation de la création d'utilisateur
      setTimeout(() => {
        console.log('Utilisateur créé:', this.userForm.value);
        this.isSavingSignal.set(false);
        this.router.navigate(['/admin/users']);
      }, 1000);
    }
  }
} 
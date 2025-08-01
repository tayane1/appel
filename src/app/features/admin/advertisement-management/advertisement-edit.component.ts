import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-advertisement-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="advertisement-edit-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Modifier la publicité</h1>
            <p>Modifiez les informations de la publicité</p>
          </div>
          <div class="header-actions">
            <a routerLink="/admin/ads" class="btn btn-outline">
              <i class="lucide-arrow-left"></i>
              Retour
            </a>
          </div>
        </div>

        <!-- Formulaire -->
        <div class="form-container">
          <form [formGroup]="adForm" (ngSubmit)="onSubmit()" class="advertisement-form">
            <div class="form-grid">
              <!-- Informations de base -->
              <div class="form-section">
                <h3>Informations de base</h3>
                
                <div class="form-group">
                  <label for="title">Titre *</label>
                  <input 
                    id="title"
                    type="text" 
                    formControlName="title"
                    class="form-control"
                    placeholder="Titre de la publicité">
                  <div class="error-message" *ngIf="adForm.get('title')?.invalid && adForm.get('title')?.touched">
                    Le titre est requis
                  </div>
                </div>

                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea 
                    id="description"
                    formControlName="description"
                    class="form-control"
                    rows="3"
                    placeholder="Description de la publicité"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="type">Type *</label>
                    <select id="type" formControlName="type" class="form-control">
                      <option value="">Sélectionner un type</option>
                      <option value="banner">Bannière</option>
                      <option value="sidebar">Barre latérale</option>
                      <option value="inline">Intégré</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="position">Position *</label>
                    <select id="position" formControlName="position" class="form-control">
                      <option value="">Sélectionner une position</option>
                      <option value="top">Haut</option>
                      <option value="middle">Milieu</option>
                      <option value="bottom">Bas</option>
                      <option value="left">Gauche</option>
                      <option value="right">Droite</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Contenu -->
              <div class="form-section">
                <h3>Contenu</h3>
                
                <div class="form-group">
                  <label for="linkUrl">Lien de destination *</label>
                  <input 
                    id="linkUrl"
                    type="url" 
                    formControlName="linkUrl"
                    class="form-control"
                    placeholder="https://example.com">
                  <div class="error-message" *ngIf="adForm.get('linkUrl')?.invalid && adForm.get('linkUrl')?.touched">
                    L'URL est requise et doit être valide
                  </div>
                </div>

                <div class="form-group">
                  <label for="imageUrl">Image (URL)</label>
                  <input 
                    id="imageUrl"
                    type="url" 
                    formControlName="imageUrl"
                    class="form-control"
                    placeholder="https://example.com/image.jpg">
                  <small class="help-text">URL de l'image de la publicité</small>
                </div>
              </div>

              <!-- Programmation -->
              <div class="form-section">
                <h3>Programmation</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="startDate">Date de début *</label>
                    <input 
                      id="startDate"
                      type="date" 
                      formControlName="startDate"
                      class="form-control">
                  </div>

                  <div class="form-group">
                    <label for="endDate">Date de fin *</label>
                    <input 
                      id="endDate"
                      type="date" 
                      formControlName="endDate"
                      class="form-control">
                  </div>
                </div>

                <div class="form-group">
                  <label for="isActive">Statut</label>
                  <div class="checkbox-group">
                    <input 
                      id="isActive"
                      type="checkbox" 
                      formControlName="isActive"
                      class="form-checkbox">
                    <label for="isActive" class="checkbox-label">Actif</label>
                  </div>
                </div>
              </div>

              <!-- Ciblage -->
              <div class="form-section">
                <h3>Ciblage</h3>
                
                <div class="form-group">
                  <label for="targetAudience">Audience cible</label>
                  <input 
                    id="targetAudience"
                    type="text" 
                    formControlName="targetAudience"
                    class="form-control"
                    placeholder="ex: Fournisseurs BTP, Administrateurs">
                  <small class="help-text">Audience cible pour cette publicité</small>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="cancel()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="adForm.invalid || isSubmitting">
                <span *ngIf="isSubmitting">Modification...</span>
                <span *ngIf="!isSubmitting">Modifier la publicité</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./advertisement-edit.component.scss']
})
export class AdvertisementEditComponent implements OnInit {
  adForm!: FormGroup;
  isSubmitting = false;
  adId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.adId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadAdData();
  }

  private initForm() {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      type: ['banner', Validators.required],
      position: ['top', Validators.required],
      linkUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      imageUrl: [''],
      startDate: [this.formatDate(new Date()), Validators.required],
      endDate: ['', Validators.required],
      isActive: [true],
      targetAudience: ['']
    });
  }

  private loadAdData() {
    // Simuler le chargement des données d'une publicité
    const mockAd = {
      title: 'Promotion spéciale BTP',
      description: 'Offres spéciales pour les entreprises du BTP',
      type: 'banner',
      position: 'top',
      linkUrl: 'https://example.com/promotion-btp',
      imageUrl: 'https://example.com/images/promotion-btp.jpg',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      isActive: true,
      targetAudience: 'Entreprises BTP'
    };

    this.adForm.patchValue({
      ...mockAd,
      startDate: this.formatDate(mockAd.startDate),
      endDate: this.formatDate(mockAd.endDate)
    });
  }

  onSubmit() {
    if (this.adForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.adForm.value;
      console.log('Modifier la publicité:', this.adId, formData);
      
      // Simuler un délai d'enregistrement
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/ads']);
      }, 1000);
    }
  }

  cancel() {
    this.router.navigate(['/admin/ads']);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 
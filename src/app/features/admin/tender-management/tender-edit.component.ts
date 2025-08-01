import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tender-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tender-edit-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Modifier l'appel d'offres</h1>
            <p>Modifiez les informations de l'appel d'offres</p>
          </div>
          <div class="header-actions">
            <a routerLink="/admin/tenders" class="btn btn-outline">
              <i class="lucide-arrow-left"></i>
              Retour
            </a>
          </div>
        </div>

        <!-- Formulaire -->
        <div class="form-container">
          <form [formGroup]="tenderForm" (ngSubmit)="onSubmit()" class="tender-form">
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
                    placeholder="Titre de l'appel d'offres">
                  <div class="error-message" *ngIf="tenderForm.get('title')?.invalid && tenderForm.get('title')?.touched">
                    Le titre est requis
                  </div>
                </div>

                <div class="form-group">
                  <label for="description">Description *</label>
                  <textarea 
                    id="description"
                    formControlName="description"
                    class="form-control"
                    rows="4"
                    placeholder="Description détaillée de l'appel d'offres"></textarea>
                  <div class="error-message" *ngIf="tenderForm.get('description')?.invalid && tenderForm.get('description')?.touched">
                    La description est requise
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="type">Type *</label>
                    <select id="type" formControlName="type" class="form-control">
                      <option value="">Sélectionner un type</option>
                      <option value="public">Public</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="status">Statut *</label>
                    <select id="status" formControlName="status" class="form-control">
                      <option value="">Sélectionner un statut</option>
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="closed">Fermé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="sector">Secteur *</label>
                    <select id="sector" formControlName="sector" class="form-control">
                      <option value="">Sélectionner un secteur</option>
                      <option value="BTP & Construction">BTP & Construction</option>
                      <option value="Informatique & Technologies">Informatique & Technologies</option>
                      <option value="Santé & Pharmaceutique">Santé & Pharmaceutique</option>
                      <option value="Éducation & Formation">Éducation & Formation</option>
                      <option value="Transport & Logistique">Transport & Logistique</option>
                      <option value="Agriculture & Agroalimentaire">Agriculture & Agroalimentaire</option>
                      <option value="Énergie & Environnement">Énergie & Environnement</option>
                      <option value="Services financiers">Services financiers</option>
                      <option value="Télécommunications">Télécommunications</option>
                      <option value="Industrie & Manufacturing">Industrie & Manufacturing</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="location">Localisation *</label>
                    <input 
                      id="location"
                      type="text" 
                      formControlName="location"
                      class="form-control"
                      placeholder="Ville, région">
                  </div>
                </div>
              </div>

              <!-- Détails du marché -->
              <div class="form-section">
                <h3>Détails du marché</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="estimatedAmount">Montant estimé</label>
                    <input 
                      id="estimatedAmount"
                      type="number" 
                      formControlName="estimatedAmount"
                      class="form-control"
                      placeholder="Montant en XOF">
                  </div>

                  <div class="form-group">
                    <label for="currency">Devise</label>
                    <select id="currency" formControlName="currency" class="form-control">
                      <option value="XOF">XOF (Franc CFA)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar US)</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="publishDate">Date de publication</label>
                    <input 
                      id="publishDate"
                      type="date" 
                      formControlName="publishDate"
                      class="form-control">
                  </div>

                  <div class="form-group">
                    <label for="deadline">Date limite *</label>
                    <input 
                      id="deadline"
                      type="date" 
                      formControlName="deadline"
                      class="form-control">
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <div class="form-section">
                <h3>Contact</h3>
                
                <div class="form-group">
                  <label for="contactEmail">Email de contact *</label>
                  <input 
                    id="contactEmail"
                    type="email" 
                    formControlName="contactEmail"
                    class="form-control"
                    placeholder="contact@organisation.com">
                </div>

                <div class="form-group">
                  <label for="contactPhone">Téléphone</label>
                  <input 
                    id="contactPhone"
                    type="tel" 
                    formControlName="contactPhone"
                    class="form-control"
                    placeholder="+225 0123456789">
                </div>

                <div class="form-group">
                  <label for="organizationName">Nom de l'organisation *</label>
                  <input 
                    id="organizationName"
                    type="text" 
                    formControlName="organizationName"
                    class="form-control"
                    placeholder="Nom de l'organisation">
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="cancel()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="tenderForm.invalid || isSubmitting">
                <span *ngIf="isSubmitting">Modification...</span>
                <span *ngIf="!isSubmitting">Modifier l'appel d'offres</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tender-edit.component.scss']
})
export class TenderEditComponent implements OnInit {
  tenderForm!: FormGroup;
  isSubmitting = false;
  tenderId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tenderId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadTenderData();
  }

  private initForm() {
    this.tenderForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      type: ['', Validators.required],
      status: ['draft', Validators.required],
      sector: ['', Validators.required],
      location: ['', Validators.required],
      estimatedAmount: [null],
      currency: ['XOF'],
      publishDate: [this.formatDate(new Date())],
      deadline: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: [''],
      organizationName: ['', Validators.required]
    });
  }

  private loadTenderData() {
    // Simuler le chargement des données d'un appel d'offres
    const mockTender = {
      title: 'Appel d\'offres pour la construction d\'un bâtiment administratif',
      description: 'Construction d\'un bâtiment administratif de 3 étages avec parking souterrain...',
      type: 'public',
      status: 'published',
      sector: 'BTP & Construction',
      location: 'Abidjan',
      estimatedAmount: 50000000,
      currency: 'XOF',
      publishDate: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      contactEmail: 'contact@mairie-abidjan.ci',
      contactPhone: '+225 0123456789',
      organizationName: 'Mairie d\'Abidjan'
    };

    this.tenderForm.patchValue({
      ...mockTender,
      publishDate: this.formatDate(mockTender.publishDate),
      deadline: this.formatDate(mockTender.deadline)
    });
  }

  onSubmit() {
    if (this.tenderForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.tenderForm.value;
      console.log('Modifier l\'appel d\'offres:', this.tenderId, formData);
      
      // Simuler un délai d'enregistrement
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/tenders']);
      }, 1000);
    }
  }

  cancel() {
    this.router.navigate(['/admin/tenders']);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tender } from '../../core/models/tender.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  constructor(private apiService: ApiService) {}

  getTenders(): Observable<Tender[]> {
    return this.apiService.getTenders();
  }

  getTender(id: string): Observable<Tender | null> {
    return this.apiService.getTender(id);
  }

  getRecentTenders(limit: number = 6): Observable<Tender[]> {
    return this.apiService.getRecentTenders(limit);
  }

  searchTenders(query: string): Observable<Tender[]> {
    return this.apiService.searchTenders(query);
  }

  // Méthodes pour l'administration
  createTender(tender: Partial<Tender>): Observable<Tender> {
    return this.apiService.createTender(tender);
  }

  updateTender(id: string, updates: Partial<Tender>): Observable<Tender> {
    return this.apiService.updateTender(id, updates);
  }

  deleteTender(id: string): Observable<void> {
    return this.apiService.deleteTender(id);
  }
} 
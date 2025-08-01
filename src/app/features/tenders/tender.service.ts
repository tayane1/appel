import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Tender, TenderFilter } from '../../core/models/tender.model';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  constructor(private apiService: ApiService) {}

  getTenders(filter?: TenderFilter, page = 1, limit = 10): Observable<{
    tenders: Tender[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = {
      page,
      limit,
      ...filter
    };
    
    return this.apiService.get<{
      tenders: Tender[];
      total: number;
      page: number;
      totalPages: number;
    }>('/tenders', params);
  }

  getTenderById(id: string): Observable<Tender> {
    return this.apiService.get<Tender>(`/tenders/${id}`);
  }

  getRecentTenders(limit = 6): Observable<Tender[]> {
    return this.apiService.get<{ tenders: Tender[] }>('/tenders/recent', { limit })
      .pipe(map(response => response.tenders));
  }

  createTender(tender: Partial<Tender>): Observable<Tender> {
    return this.apiService.post<Tender>('/tenders', tender);
  }

  updateTender(id: string, tender: Partial<Tender>): Observable<Tender> {
    return this.apiService.put<Tender>(`/tenders/${id}`, tender);
  }

  deleteTender(id: string): Observable<void> {
    return this.apiService.delete<void>(`/tenders/${id}`);
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.apiService.get<Blob>(`/tenders/documents/${documentId}/download`);
  }

  getSectors(): Observable<string[]> {
    return this.apiService.get<string[]>('/tenders/sectors');
  }

  getLocations(): Observable<string[]> {
    return this.apiService.get<string[]>('/tenders/locations');
  }
} 
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Supplier, SupplierFilter } from '../../core/models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private apiService: ApiService) {}

  getSuppliers(filter?: SupplierFilter, page = 1, limit = 12): Observable<{
    suppliers: Supplier[];
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
      suppliers: Supplier[];
      total: number;
      page: number;
      totalPages: number;
    }>('/suppliers', params);
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.apiService.get<Supplier>(`/suppliers/${id}`);
  }

  getFeaturedSuppliers(limit = 6): Observable<Supplier[]> {
    return this.apiService.get<{ suppliers: Supplier[] }>('/suppliers/featured', { limit })
      .pipe(map(response => response.suppliers));
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.apiService.post<Supplier>('/suppliers', supplier);
  }

  updateSupplier(id: string, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.apiService.put<Supplier>(`/suppliers/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.apiService.delete<void>(`/suppliers/${id}`);
  }

  getSectors(): Observable<string[]> {
    return this.apiService.get<string[]>('/suppliers/sectors');
  }

  getCities(): Observable<string[]> {
    return this.apiService.get<string[]>('/suppliers/cities');
  }
} 
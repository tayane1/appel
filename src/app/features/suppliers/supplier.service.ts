import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../../core/models/supplier.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private apiService: ApiService) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.apiService.getSuppliers();
  }

  getSupplier(id: string): Observable<Supplier | null> {
    return this.apiService.getSupplier(id);
  }

  getFeaturedSuppliers(limit: number = 6): Observable<Supplier[]> {
    return this.apiService.getFeaturedSuppliers(limit);
  }

  searchSuppliers(query: string): Observable<Supplier[]> {
    return this.apiService.searchSuppliers(query);
  }
} 
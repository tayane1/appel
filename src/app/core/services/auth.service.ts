import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  
  private isAuthenticatedSignal = signal(false);
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // Données mockées pour les utilisateurs
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@ci-tender.com',
      firstName: 'Admin',
      lastName: 'CI-Tender',
      role: UserRole.ADMIN,
      company: 'CI-Tender Admin',
      phoneNumber: '+225 0123456789',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'user@ci-tender.com',
      firstName: 'Utilisateur',
      lastName: 'Standard',
      role: UserRole.USER,
      company: 'Entreprise Test',
      phoneNumber: '+225 0987654321',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<{ user: User; token: string }> {
    // Simulation d'une API avec données mockées
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (user && (credentials.password === 'admin123' || credentials.password === 'user123')) {
      const token = 'mock-jwt-token-' + user.id;
      const response = { user, token };
      
      // Simuler un délai réseau
      return of(response).pipe(
        tap(response => {
          this.setCurrentUser(response.user, response.token);
        })
      );
    } else {
      throw new Error('Identifiants invalides');
    }
  }

  register(userData: RegisterRequest): Observable<{ user: User; token: string }> {
    // Simulation d'une inscription
    const newUser: User = {
      id: (this.mockUsers.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: UserRole.USER,
      company: userData.company || 'Nouvelle entreprise',
      phoneNumber: userData.phoneNumber || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockUsers.push(newUser);
    const token = 'mock-jwt-token-' + newUser.id;
    const response = { user: newUser, token };
    
    return of(response).pipe(
      tap(response => {
        this.setCurrentUser(response.user, response.token);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }
} 
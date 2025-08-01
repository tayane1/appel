import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'tenders',
    loadComponent: () => import('./features/tenders/tender-list/tender-list.component').then(m => m.TenderListComponent)
  },
  {
    path: 'tenders/:id',
    loadComponent: () => import('./features/tenders/tender-detail/tender-detail.component').then(m => m.TenderDetailComponent)
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./features/suppliers/supplier-list/supplier-list.component').then(m => m.SupplierListComponent)
  },
  {
    path: 'suppliers/:id',
    loadComponent: () => import('./features/suppliers/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tenders',
        loadComponent: () => import('./features/admin/tender-management/tender-management.component').then(m => m.TenderManagementComponent)
      },
      {
        path: 'tenders/create',
        loadComponent: () => import('./features/admin/tender-management/tender-create.component').then(m => m.TenderCreateComponent)
      },
      {
        path: 'tenders/:id/edit',
        loadComponent: () => import('./features/admin/tender-management/tender-edit.component').then(m => m.TenderEditComponent)
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./features/admin/supplier-management/supplier-management.component').then(m => m.SupplierManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'ads',
        loadComponent: () => import('./features/admin/advertisement-management/advertisement-management.component').then(m => m.AdvertisementManagementComponent)
      },
      {
        path: 'ads/create',
        loadComponent: () => import('./features/admin/advertisement-management/advertisement-create.component').then(m => m.AdvertisementCreateComponent)
      },
      {
        path: 'ads/:id/edit',
        loadComponent: () => import('./features/admin/advertisement-management/advertisement-edit.component').then(m => m.AdvertisementEditComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 
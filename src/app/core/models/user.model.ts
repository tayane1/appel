export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPPLIER = 'supplier'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  company?: string;
  role: UserRole;
  status?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: Date;
  registrationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  company?: string;
} 
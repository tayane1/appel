import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request to login endpoint', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { token: 'mock-token', user: { id: 1, email: 'test@example.com' } };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = { status: 401, error: { message: 'Invalid credentials' } };

      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error.message).toBe('Invalid credentials');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should send POST request to register endpoint', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        phoneNumber: '+225 0123456789',
        company: 'Test Company'
      };
      const mockResponse = { message: 'User registered successfully' };

      service.register(userData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123'
      };
      const mockError = { status: 400, error: { message: 'Email already exists' } };

      service.register(userData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe('Email already exists');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should send POST request to logout endpoint', () => {
      const mockResponse = { message: 'Logged out successfully' };

      service.logout().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle logout error', () => {
      const mockError = { status: 500, error: { message: 'Server error' } };

      service.logout().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('refreshToken', () => {
    it('should send POST request to refresh token endpoint', () => {
      const mockResponse = { token: 'new-token' };

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should send GET request to current user endpoint', () => {
      const mockResponse = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };

      service.getCurrentUser().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updateProfile', () => {
    it('should send PUT request to update profile endpoint', () => {
      const profileData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+225 0123456789',
        company: 'Updated Company'
      };
      const mockResponse = { message: 'Profile updated successfully' };

      service.updateProfile(profileData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(profileData);
      req.flush(mockResponse);
    });
  });

  describe('changePassword', () => {
    it('should send POST request to change password endpoint', () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123'
      };
      const mockResponse = { message: 'Password changed successfully' };

      service.changePassword(passwordData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(passwordData);
      req.flush(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should send POST request to forgot password endpoint', () => {
      const email = 'test@example.com';
      const mockResponse = { message: 'Password reset email sent' };

      service.forgotPassword(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should send POST request to reset password endpoint', () => {
      const resetData = {
        token: 'reset-token',
        newPassword: 'newpassword123'
      };
      const mockResponse = { message: 'Password reset successfully' };

      service.resetPassword(resetData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(resetData);
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'mock-token';
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);
      expect(service.getToken()).toBe(mockToken);
    });

    it('should return null when token does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const mockToken = 'new-token';
      spyOn(localStorage, 'setItem');
      
      service.setToken(mockToken);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      spyOn(localStorage, 'removeItem');
      
      service.removeToken();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });
}); 
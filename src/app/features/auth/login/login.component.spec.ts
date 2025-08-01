import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    fixture.detectChanges();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    const form = component.loginForm;
    
    expect(form.valid).toBeFalsy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    fixture.detectChanges();
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('123');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('123456');
    expect(passwordControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should show loading state during login', () => {
    fixture.detectChanges();
    authService.login.and.returnValue(of({}));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(component.isLoading()).toBe(true);
  });

  it('should call auth service on valid form submission', () => {
    fixture.detectChanges();
    authService.login.and.returnValue(of({}));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should navigate to home on successful login', () => {
    fixture.detectChanges();
    authService.login.and.returnValue(of({}));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on login failure', () => {
    fixture.detectChanges();
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage()).toBe(errorMessage);
  });

  it('should toggle password visibility', () => {
    fixture.detectChanges();
    
    expect(component.showPassword()).toBe(false);
    
    component.togglePassword();
    expect(component.showPassword()).toBe(true);
    
    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should mark form as touched on invalid submission', () => {
    fixture.detectChanges();
    const form = component.loginForm;
    
    component.onSubmit();
    
    expect(form.get('email')?.touched).toBe(true);
    expect(form.get('password')?.touched).toBe(true);
  });

  it('should perform quick login for demo user', () => {
    fixture.detectChanges();
    authService.login.and.returnValue(of({}));
    
    component.quickLogin('demo');
    
    expect(component.loginForm.get('email')?.value).toBe('user@ci-tender.com');
    expect(component.loginForm.get('password')?.value).toBe('user123');
    expect(authService.login).toHaveBeenCalled();
  });

  it('should perform quick login for admin user', () => {
    fixture.detectChanges();
    authService.login.and.returnValue(of({}));
    
    component.quickLogin('admin');
    
    expect(component.loginForm.get('email')?.value).toBe('admin@ci-tender.com');
    expect(component.loginForm.get('password')?.value).toBe('admin123');
    expect(authService.login).toHaveBeenCalled();
  });

  it('should check field validity correctly', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('test@example.com');
    emailControl?.markAsTouched();
    
    expect(component.isFieldInvalid('email')).toBe(false);
    
    emailControl?.setValue('');
    expect(component.isFieldInvalid('email')).toBe(true);
  });
}); 
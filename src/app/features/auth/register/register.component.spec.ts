import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    fixture.detectChanges();
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('acceptTerms')?.value).toBe(false);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    const form = component.registerForm;
    
    expect(form.valid).toBeFalsy();
    expect(form.get('firstName')?.errors?.['required']).toBeTruthy();
    expect(form.get('lastName')?.errors?.['required']).toBeTruthy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
    expect(form.get('confirmPassword')?.errors?.['required']).toBeTruthy();
    expect(form.get('acceptTerms')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    fixture.detectChanges();
    const passwordControl = component.registerForm.get('password');
    
    passwordControl?.setValue('123');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('12345678');
    expect(passwordControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should validate password complexity', () => {
    fixture.detectChanges();
    const passwordControl = component.registerForm.get('password');
    
    passwordControl?.setValue('password');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    passwordControl?.setValue('Password123');
    expect(passwordControl?.errors?.['pattern']).toBeFalsy();
  });

  it('should validate password confirmation match', () => {
    fixture.detectChanges();
    const form = component.registerForm;
    
    form.patchValue({
      password: 'Password123',
      confirmPassword: 'DifferentPassword123'
    });
    
    expect(form.errors?.['passwordMismatch']).toBeTruthy();
    
    form.patchValue({
      password: 'Password123',
      confirmPassword: 'Password123'
    });
    
    expect(form.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('should validate phone number format', () => {
    fixture.detectChanges();
    const phoneControl = component.registerForm.get('phoneNumber');
    
    phoneControl?.setValue('123456789');
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();
    
    phoneControl?.setValue('+225 0123456789');
    expect(phoneControl?.errors?.['pattern']).toBeFalsy();
  });

  it('should show loading state during registration', () => {
    fixture.detectChanges();
    authService.register.and.returnValue(of({}));
    
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
    });
    
    component.onSubmit();
    
    expect(component.isLoading()).toBe(true);
  });

  it('should call auth service on valid form submission', () => {
    fixture.detectChanges();
    authService.register.and.returnValue(of({}));
    
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+225 0123456789',
      company: 'Test Company',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
    });
    
    component.onSubmit();
    
    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+225 0123456789',
      company: 'Test Company',
      password: 'Password123'
    });
  });

  it('should navigate to home on successful registration', () => {
    fixture.detectChanges();
    authService.register.and.returnValue(of({}));
    
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
    });
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on registration failure', () => {
    fixture.detectChanges();
    const errorMessage = 'Email already exists';
    authService.register.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
    
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
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

  it('should toggle confirm password visibility', () => {
    fixture.detectChanges();
    
    expect(component.showConfirmPassword()).toBe(false);
    
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(true);
    
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(false);
  });

  it('should mark form as touched on invalid submission', () => {
    fixture.detectChanges();
    const form = component.registerForm;
    
    component.onSubmit();
    
    expect(form.get('firstName')?.touched).toBe(true);
    expect(form.get('lastName')?.touched).toBe(true);
    expect(form.get('email')?.touched).toBe(true);
    expect(form.get('password')?.touched).toBe(true);
    expect(form.get('confirmPassword')?.touched).toBe(true);
    expect(form.get('acceptTerms')?.touched).toBe(true);
  });

  it('should check field validity correctly', () => {
    fixture.detectChanges();
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('test@example.com');
    emailControl?.markAsTouched();
    
    expect(component.isFieldInvalid('email')).toBe(false);
    
    emailControl?.setValue('');
    expect(component.isFieldInvalid('email')).toBe(true);
  });

  it('should handle optional company field', () => {
    fixture.detectChanges();
    const companyControl = component.registerForm.get('company');
    
    companyControl?.setValue('Test Company');
    expect(companyControl?.valid).toBe(true);
    
    companyControl?.setValue('');
    expect(companyControl?.valid).toBe(true);
  });

  it('should handle optional phone number field', () => {
    fixture.detectChanges();
    const phoneControl = component.registerForm.get('phoneNumber');
    
    phoneControl?.setValue('');
    expect(phoneControl?.valid).toBe(true);
    
    phoneControl?.setValue('+225 0123456789');
    expect(phoneControl?.valid).toBe(true);
  });
}); 
import { browser, logging } from 'protractor';
import { AppPage } from '../page-objects/app.po';
import { LoginPage } from '../page-objects/login.po';
import { RegisterPage } from '../page-objects/register.po';

describe('Authentication E2E Tests', () => {
  let appPage: AppPage;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  beforeEach(() => {
    appPage = new AppPage();
    loginPage = new LoginPage();
    registerPage = new RegisterPage();
  });

  describe('Login Page', () => {
    beforeEach(() => {
      loginPage.navigateTo();
    });

    it('should display login form', () => {
      expect(loginPage.getTitleText()).toContain('Connexion à votre compte');
      expect(loginPage.getEmailInput().isPresent()).toBe(true);
      expect(loginPage.getPasswordInput().isPresent()).toBe(true);
      expect(loginPage.getLoginButton().isPresent()).toBe(true);
    });

    it('should show validation errors for empty form', async () => {
      await loginPage.getLoginButton().click();
      
      expect(loginPage.getEmailError().isPresent()).toBe(true);
      expect(loginPage.getPasswordError().isPresent()).toBe(true);
    });

    it('should show validation error for invalid email', async () => {
      await loginPage.getEmailInput().sendKeys('invalid-email');
      await loginPage.getEmailInput().blur();
      
      expect(loginPage.getEmailError().getText()).toContain('Format d\'email invalide');
    });

    it('should show validation error for short password', async () => {
      await loginPage.getPasswordInput().sendKeys('123');
      await loginPage.getPasswordInput().blur();
      
      expect(loginPage.getPasswordError().getText()).toContain('au moins 6 caractères');
    });

    it('should navigate to register page', async () => {
      await loginPage.getRegisterLink().click();
      expect(browser.getCurrentUrl()).toContain('/register');
    });

    it('should perform demo login', async () => {
      await loginPage.getDemoLoginButton().click();
      
      // Wait for navigation
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/');
    });
  });

  describe('Register Page', () => {
    beforeEach(() => {
      registerPage.navigateTo();
    });

    it('should display register form', () => {
      expect(registerPage.getTitleText()).toContain('Créer votre compte');
      expect(registerPage.getFirstNameInput().isPresent()).toBe(true);
      expect(registerPage.getLastNameInput().isPresent()).toBe(true);
      expect(registerPage.getEmailInput().isPresent()).toBe(true);
      expect(registerPage.getPasswordInput().isPresent()).toBe(true);
      expect(registerPage.getConfirmPasswordInput().isPresent()).toBe(true);
      expect(registerPage.getRegisterButton().isPresent()).toBe(true);
    });

    it('should show validation errors for empty form', async () => {
      await registerPage.getRegisterButton().click();
      
      expect(registerPage.getFirstNameError().isPresent()).toBe(true);
      expect(registerPage.getLastNameError().isPresent()).toBe(true);
      expect(registerPage.getEmailError().isPresent()).toBe(true);
      expect(registerPage.getPasswordError().isPresent()).toBe(true);
      expect(registerPage.getConfirmPasswordError().isPresent()).toBe(true);
    });

    it('should show validation error for password mismatch', async () => {
      await registerPage.getPasswordInput().sendKeys('Password123');
      await registerPage.getConfirmPasswordInput().sendKeys('DifferentPassword123');
      await registerPage.getConfirmPasswordInput().blur();
      
      expect(registerPage.getConfirmPasswordError().getText()).toContain('ne correspondent pas');
    });

    it('should show validation error for weak password', async () => {
      await registerPage.getPasswordInput().sendKeys('password');
      await registerPage.getPasswordInput().blur();
      
      expect(registerPage.getPasswordError().getText()).toContain('majuscule, une minuscule et un chiffre');
    });

    it('should navigate to login page', async () => {
      await registerPage.getLoginLink().click();
      expect(browser.getCurrentUrl()).toContain('/login');
    });

    it('should toggle password visibility', async () => {
      await registerPage.getPasswordInput().sendKeys('Password123');
      
      // Password should be hidden by default
      expect(registerPage.getPasswordInput().getAttribute('type')).toBe('password');
      
      await registerPage.getPasswordToggleButton().click();
      expect(registerPage.getPasswordInput().getAttribute('type')).toBe('text');
      
      await registerPage.getPasswordToggleButton().click();
      expect(registerPage.getPasswordInput().getAttribute('type')).toBe('password');
    });
  });

  describe('Authentication Flow', () => {
    it('should complete registration and login flow', async () => {
      // Navigate to register page
      registerPage.navigateTo();
      
      // Fill registration form
      await registerPage.getFirstNameInput().sendKeys('Test');
      await registerPage.getLastNameInput().sendKeys('User');
      await registerPage.getEmailInput().sendKeys('testuser@example.com');
      await registerPage.getPasswordInput().sendKeys('Password123');
      await registerPage.getConfirmPasswordInput().sendKeys('Password123');
      await registerPage.getAcceptTermsCheckbox().click();
      
      // Submit registration
      await registerPage.getRegisterButton().click();
      
      // Wait for navigation to home page
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/');
      
      // Logout
      await appPage.getLogoutButton().click();
      
      // Navigate to login page
      loginPage.navigateTo();
      
      // Login with registered credentials
      await loginPage.getEmailInput().sendKeys('testuser@example.com');
      await loginPage.getPasswordInput().sendKeys('Password123');
      await loginPage.getLoginButton().click();
      
      // Wait for navigation to home page
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/');
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
}); 
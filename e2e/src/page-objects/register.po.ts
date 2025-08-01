import { browser, by, element, ElementFinder } from 'protractor';

export class RegisterPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/register') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('h2')).getText() as Promise<string>;
  }

  getFirstNameInput(): ElementFinder {
    return element(by.css('input[formControlName="firstName"]'));
  }

  getLastNameInput(): ElementFinder {
    return element(by.css('input[formControlName="lastName"]'));
  }

  getEmailInput(): ElementFinder {
    return element(by.css('input[formControlName="email"]'));
  }

  getPhoneNumberInput(): ElementFinder {
    return element(by.css('input[formControlName="phoneNumber"]'));
  }

  getCompanyInput(): ElementFinder {
    return element(by.css('input[formControlName="company"]'));
  }

  getPasswordInput(): ElementFinder {
    return element(by.css('input[formControlName="password"]'));
  }

  getConfirmPasswordInput(): ElementFinder {
    return element(by.css('input[formControlName="confirmPassword"]'));
  }

  getAcceptTermsCheckbox(): ElementFinder {
    return element(by.css('input[formControlName="acceptTerms"]'));
  }

  getRegisterButton(): ElementFinder {
    return element(by.css('button[type="submit"]'));
  }

  getLoginLink(): ElementFinder {
    return element(by.css('a[routerLink="/login"]'));
  }

  getPasswordToggleButton(): ElementFinder {
    return element(by.css('.password-input .password-toggle'));
  }

  getConfirmPasswordToggleButton(): ElementFinder {
    return element(by.cssAll('.password-input .password-toggle')).get(1);
  }

  getFirstNameError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getLastNameError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getEmailError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getPasswordError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getConfirmPasswordError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getAcceptTermsError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getGeneralError(): ElementFinder {
    return element(by.css('.form-error i.lucide-alert-circle'));
  }

  getLoadingSpinner(): ElementFinder {
    return element(by.css('app-loading-spinner'));
  }

  // Helper methods
  async fillRegisterForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }): Promise<void> {
    await this.getFirstNameInput().clear();
    await this.getFirstNameInput().sendKeys(data.firstName);
    
    await this.getLastNameInput().clear();
    await this.getLastNameInput().sendKeys(data.lastName);
    
    await this.getEmailInput().clear();
    await this.getEmailInput().sendKeys(data.email);
    
    if (data.phoneNumber) {
      await this.getPhoneNumberInput().clear();
      await this.getPhoneNumberInput().sendKeys(data.phoneNumber);
    }
    
    if (data.company) {
      await this.getCompanyInput().clear();
      await this.getCompanyInput().sendKeys(data.company);
    }
    
    await this.getPasswordInput().clear();
    await this.getPasswordInput().sendKeys(data.password);
    
    await this.getConfirmPasswordInput().clear();
    await this.getConfirmPasswordInput().sendKeys(data.confirmPassword);
    
    if (data.acceptTerms) {
      await this.getAcceptTermsCheckbox().click();
    }
  }

  async submitRegisterForm(): Promise<void> {
    await this.getRegisterButton().click();
  }

  async registerWithData(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }): Promise<void> {
    await this.fillRegisterForm(data);
    await this.submitRegisterForm();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.getPasswordToggleButton().click();
  }

  async toggleConfirmPasswordVisibility(): Promise<void> {
    await this.getConfirmPasswordToggleButton().click();
  }

  async navigateToLogin(): Promise<void> {
    await this.getLoginLink().click();
  }

  // Validation methods
  async isFirstNameErrorVisible(): Promise<boolean> {
    return await this.getFirstNameError().isPresent();
  }

  async isLastNameErrorVisible(): Promise<boolean> {
    return await this.getLastNameError().isPresent();
  }

  async isEmailErrorVisible(): Promise<boolean> {
    return await this.getEmailError().isPresent();
  }

  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.getPasswordError().isPresent();
  }

  async isConfirmPasswordErrorVisible(): Promise<boolean> {
    return await this.getConfirmPasswordError().isPresent();
  }

  async isAcceptTermsErrorVisible(): Promise<boolean> {
    return await this.getAcceptTermsError().isPresent();
  }

  async isGeneralErrorVisible(): Promise<boolean> {
    return await this.getGeneralError().isPresent();
  }

  async isLoading(): Promise<boolean> {
    return await this.getLoadingSpinner().isPresent();
  }

  async getFirstNameErrorText(): Promise<string> {
    return await this.getFirstNameError().getText();
  }

  async getLastNameErrorText(): Promise<string> {
    return await this.getLastNameError().getText();
  }

  async getEmailErrorText(): Promise<string> {
    return await this.getEmailError().getText();
  }

  async getPasswordErrorText(): Promise<string> {
    return await this.getPasswordError().getText();
  }

  async getConfirmPasswordErrorText(): Promise<string> {
    return await this.getConfirmPasswordError().getText();
  }

  async getAcceptTermsErrorText(): Promise<string> {
    return await this.getAcceptTermsError().getText();
  }

  async getGeneralErrorText(): Promise<string> {
    return await element(by.css('.form-error')).getText();
  }

  // Form state methods
  async isFormValid(): Promise<boolean> {
    const submitButton = this.getRegisterButton();
    const isDisabled = await submitButton.getAttribute('disabled');
    return isDisabled === null;
  }

  async isFirstNameValid(): Promise<boolean> {
    const firstNameInput = this.getFirstNameInput();
    const hasErrorClass = await firstNameInput.getAttribute('class');
    return !hasErrorClass.includes('error');
  }

  async isLastNameValid(): Promise<boolean> {
    const lastNameInput = this.getLastNameInput();
    const hasErrorClass = await lastNameInput.getAttribute('class');
    return !hasErrorClass.includes('error');
  }

  async isEmailValid(): Promise<boolean> {
    const emailInput = this.getEmailInput();
    const hasErrorClass = await emailInput.getAttribute('class');
    return !hasErrorClass.includes('error');
  }

  async isPasswordValid(): Promise<boolean> {
    const passwordInput = this.getPasswordInput();
    const hasErrorClass = await passwordInput.getAttribute('class');
    return !hasErrorClass.includes('error');
  }

  async isConfirmPasswordValid(): Promise<boolean> {
    const confirmPasswordInput = this.getConfirmPasswordInput();
    const hasErrorClass = await confirmPasswordInput.getAttribute('class');
    return !hasErrorClass.includes('error');
  }

  // Navigation methods
  async getCurrentUrl(): Promise<string> {
    return await browser.getCurrentUrl();
  }

  async waitForNavigation(): Promise<void> {
    await browser.waitForAngular();
  }

  // Accessibility methods
  async getFirstNameInputLabel(): Promise<string> {
    const firstNameInput = this.getFirstNameInput();
    const id = await firstNameInput.getAttribute('id');
    const label = element(by.css(`label[for="${id}"]`));
    return await label.getText();
  }

  async getLastNameInputLabel(): Promise<string> {
    const lastNameInput = this.getLastNameInput();
    const id = await lastNameInput.getAttribute('id');
    const label = element(by.css(`label[for="${id}"]`));
    return await label.getText();
  }

  async getEmailInputLabel(): Promise<string> {
    const emailInput = this.getEmailInput();
    const id = await emailInput.getAttribute('id');
    const label = element(by.css(`label[for="${id}"]`));
    return await label.getText();
  }

  async getPasswordInputLabel(): Promise<string> {
    const passwordInput = this.getPasswordInput();
    const id = await passwordInput.getAttribute('id');
    const label = element(by.css(`label[for="${id}"]`));
    return await label.getText();
  }

  async getConfirmPasswordInputLabel(): Promise<string> {
    const confirmPasswordInput = this.getConfirmPasswordInput();
    const id = await confirmPasswordInput.getAttribute('id');
    const label = element(by.css(`label[for="${id}"]`));
    return await label.getText();
  }

  async getRegisterButtonText(): Promise<string> {
    return await this.getRegisterButton().getText();
  }

  // Responsive design methods
  async isMobileView(): Promise<boolean> {
    const windowSize = await browser.manage().window().getSize();
    return windowSize.width < 768;
  }

  async isTabletView(): Promise<boolean> {
    const windowSize = await browser.manage().window().getSize();
    return windowSize.width >= 768 && windowSize.width < 1024;
  }

  async isDesktopView(): Promise<boolean> {
    const windowSize = await browser.manage().window().getSize();
    return windowSize.width >= 1024;
  }

  // Performance methods
  async getPageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.navigateTo();
    await browser.waitForAngular();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async getFormSubmissionTime(): Promise<number> {
    const startTime = Date.now();
    await this.submitRegisterForm();
    await browser.waitForAngular();
    const endTime = Date.now();
    return endTime - startTime;
  }

  // Password strength validation
  async isPasswordStrong(): Promise<boolean> {
    const passwordInput = this.getPasswordInput();
    const password = await passwordInput.getAttribute('value');
    
    // Check if password meets complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
  }

  // Phone number validation
  async isPhoneNumberValid(): Promise<boolean> {
    const phoneInput = this.getPhoneNumberInput();
    const phone = await phoneInput.getAttribute('value');
    
    // Check if phone number matches Ivory Coast format
    const phoneRegex = /^\+225\s?\d{8,10}$/;
    return phoneRegex.test(phone);
  }

  // Terms acceptance validation
  async isTermsAccepted(): Promise<boolean> {
    const checkbox = this.getAcceptTermsCheckbox();
    return await checkbox.isSelected();
  }
} 
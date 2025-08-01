import { browser, by, element, ElementFinder } from 'protractor';

export class LoginPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/login') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('h2')).getText() as Promise<string>;
  }

  getEmailInput(): ElementFinder {
    return element(by.css('input[formControlName="email"]'));
  }

  getPasswordInput(): ElementFinder {
    return element(by.css('input[formControlName="password"]'));
  }

  getLoginButton(): ElementFinder {
    return element(by.css('button[type="submit"]'));
  }

  getRegisterLink(): ElementFinder {
    return element(by.css('a[routerLink="/register"]'));
  }

  getDemoLoginButton(): ElementFinder {
    return element(by.css('button[class*="btn-secondary"]'));
  }

  getEmailError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getPasswordError(): ElementFinder {
    return element(by.css('.form-error'));
  }

  getRememberMeCheckbox(): ElementFinder {
    return element(by.css('input[formControlName="rememberMe"]'));
  }

  getForgotPasswordLink(): ElementFinder {
    return element(by.css('a[routerLink="/forgot-password"]'));
  }

  getPasswordToggleButton(): ElementFinder {
    return element(by.css('.password-toggle'));
  }

  getGeneralError(): ElementFinder {
    return element(by.css('.form-error i.lucide-alert-circle'));
  }

  getLoadingSpinner(): ElementFinder {
    return element(by.css('app-loading-spinner'));
  }

  // Helper methods
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.getEmailInput().clear();
    await this.getEmailInput().sendKeys(email);
    await this.getPasswordInput().clear();
    await this.getPasswordInput().sendKeys(password);
  }

  async submitLoginForm(): Promise<void> {
    await this.getLoginButton().click();
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.submitLoginForm();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.getPasswordToggleButton().click();
  }

  async toggleRememberMe(): Promise<void> {
    await this.getRememberMeCheckbox().click();
  }

  async navigateToRegister(): Promise<void> {
    await this.getRegisterLink().click();
  }

  async performDemoLogin(): Promise<void> {
    await this.getDemoLoginButton().click();
  }

  // Validation methods
  async isEmailErrorVisible(): Promise<boolean> {
    return await this.getEmailError().isPresent();
  }

  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.getPasswordError().isPresent();
  }

  async isGeneralErrorVisible(): Promise<boolean> {
    return await this.getGeneralError().isPresent();
  }

  async isLoading(): Promise<boolean> {
    return await this.getLoadingSpinner().isPresent();
  }

  async getEmailErrorText(): Promise<string> {
    return await this.getEmailError().getText();
  }

  async getPasswordErrorText(): Promise<string> {
    return await this.getPasswordError().getText();
  }

  async getGeneralErrorText(): Promise<string> {
    return await element(by.css('.form-error')).getText();
  }

  // Form state methods
  async isFormValid(): Promise<boolean> {
    const submitButton = this.getLoginButton();
    const isDisabled = await submitButton.getAttribute('disabled');
    return isDisabled === null;
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

  // Navigation methods
  async getCurrentUrl(): Promise<string> {
    return await browser.getCurrentUrl();
  }

  async waitForNavigation(): Promise<void> {
    await browser.waitForAngular();
  }

  // Accessibility methods
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

  async getLoginButtonText(): Promise<string> {
    return await this.getLoginButton().getText();
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
    await this.submitLoginForm();
    await browser.waitForAngular();
    const endTime = Date.now();
    return endTime - startTime;
  }
} 
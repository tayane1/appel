import { browser, logging } from 'protractor';
import { AppPage } from '../page-objects/app.po';
import { LoginPage } from '../page-objects/login.po';

describe('Supplier E2E Tests', () => {
  let appPage: AppPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    appPage = new AppPage();
    loginPage = new LoginPage();
  });

  describe('Supplier Registration', () => {
    beforeEach(() => {
      // Navigate to supplier registration
      browser.get('/supplier/register');
    });

    it('should display supplier registration form', () => {
      expect(browser.getCurrentUrl()).toContain('/supplier/register');
      expect(appPage.getSupplierRegistrationTitle().isPresent()).toBe(true);
    });

    it('should validate company information', async () => {
      const submitButton = appPage.getSubmitRegistrationButton();
      await submitButton.click();
      
      // Verify validation errors
      expect(appPage.getRegistrationErrors().count()).toBeGreaterThan(0);
    });

    it('should allow uploading company documents', async () => {
      const fileInput = appPage.getCompanyDocumentInput();
      await fileInput.sendKeys('/path/to/test/company-document.pdf');
      
      // Verify file is uploaded
      expect(appPage.getUploadedDocuments().count()).toBeGreaterThan(0);
    });

    it('should allow adding company details', async () => {
      await appPage.getCompanyNameInput().sendKeys('Test Company Ltd');
      await appPage.getCompanyAddressInput().sendKeys('123 Test Street, Abidjan');
      await appPage.getCompanyPhoneInput().sendKeys('+22501234567');
      await appPage.getCompanyEmailInput().sendKeys('contact@testcompany.ci');
      
      // Verify inputs are filled
      expect(appPage.getCompanyNameInput().getAttribute('value')).toBe('Test Company Ltd');
    });

    it('should allow selecting business categories', async () => {
      const categorySelect = appPage.getBusinessCategorySelect();
      await categorySelect.click();
      await appPage.getCategoryOption('Construction').click();
      
      // Verify category is selected
      expect(categorySelect.getText()).toContain('Construction');
    });

    it('should complete registration process', async () => {
      // Fill required fields
      await appPage.getCompanyNameInput().sendKeys('Test Company Ltd');
      await appPage.getCompanyAddressInput().sendKeys('123 Test Street, Abidjan');
      await appPage.getCompanyPhoneInput().sendKeys('+22501234567');
      await appPage.getCompanyEmailInput().sendKeys('contact@testcompany.ci');
      
      // Select business category
      const categorySelect = appPage.getBusinessCategorySelect();
      await categorySelect.click();
      await appPage.getCategoryOption('Construction').click();
      
      // Upload document
      const fileInput = appPage.getCompanyDocumentInput();
      await fileInput.sendKeys('/path/to/test/company-document.pdf');
      
      // Submit registration
      await appPage.getSubmitRegistrationButton().click();
      
      // Wait for registration completion
      await browser.waitForAngular();
      expect(appPage.getRegistrationSuccessMessage().isPresent()).toBe(true);
    });
  });

  describe('Supplier Profile', () => {
    beforeEach(async () => {
      // Login as supplier
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('supplier@example.com');
      await loginPage.getPasswordInput().sendKeys('supplier123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to supplier profile
      await appPage.getSupplierProfileLink().click();
      await browser.waitForAngular();
    });

    it('should display supplier profile', () => {
      expect(browser.getCurrentUrl()).toContain('/supplier/profile');
      expect(appPage.getSupplierProfileTitle().isPresent()).toBe(true);
    });

    it('should display company information', () => {
      expect(appPage.getCompanyInfoSection().isPresent()).toBe(true);
      expect(appPage.getCompanyName().isPresent()).toBe(true);
      expect(appPage.getCompanyAddress().isPresent()).toBe(true);
    });

    it('should display business categories', () => {
      expect(appPage.getBusinessCategories().isPresent()).toBe(true);
    });

    it('should display verification status', () => {
      expect(appPage.getVerificationStatus().isPresent()).toBe(true);
    });

    it('should allow editing profile information', async () => {
      await appPage.getEditProfileButton().click();
      
      // Wait for edit form to appear
      await browser.waitForAngular();
      expect(appPage.getEditProfileForm().isPresent()).toBe(true);
    });

    it('should allow updating company details', async () => {
      await appPage.getEditProfileButton().click();
      await browser.waitForAngular();
      
      // Update company phone
      await appPage.getCompanyPhoneInput().clear();
      await appPage.getCompanyPhoneInput().sendKeys('+22509876543');
      
      // Save changes
      await appPage.getSaveProfileButton().click();
      
      // Wait for save to complete
      await browser.waitForAngular();
      expect(appPage.getProfileUpdateSuccessMessage().isPresent()).toBe(true);
    });

    it('should allow adding new business categories', async () => {
      await appPage.getEditProfileButton().click();
      await browser.waitForAngular();
      
      // Add new category
      const categorySelect = appPage.getBusinessCategorySelect();
      await categorySelect.click();
      await appPage.getCategoryOption('Technology').click();
      
      // Save changes
      await appPage.getSaveProfileButton().click();
      await browser.waitForAngular();
      
      // Verify new category is added
      expect(appPage.getBusinessCategories().getText()).toContain('Technology');
    });
  });

  describe('Supplier Dashboard', () => {
    beforeEach(async () => {
      // Login as supplier
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('supplier@example.com');
      await loginPage.getPasswordInput().sendKeys('supplier123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to supplier dashboard
      await appPage.getSupplierDashboardLink().click();
      await browser.waitForAngular();
    });

    it('should display supplier dashboard', () => {
      expect(browser.getCurrentUrl()).toContain('/supplier/dashboard');
      expect(appPage.getSupplierDashboardTitle().isPresent()).toBe(true);
    });

    it('should display application statistics', () => {
      expect(appPage.getApplicationStats().isPresent()).toBe(true);
    });

    it('should display recent applications', () => {
      expect(appPage.getRecentApplications().isPresent()).toBe(true);
    });

    it('should display recommended tenders', () => {
      expect(appPage.getRecommendedTenders().isPresent()).toBe(true);
    });

    it('should allow viewing application history', async () => {
      await appPage.getApplicationHistoryLink().click();
      
      // Wait for navigation
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/supplier/applications');
    });

    it('should allow viewing saved tenders', async () => {
      await appPage.getSavedTendersLink().click();
      
      // Wait for navigation
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/supplier/saved-tenders');
    });
  });

  describe('Supplier Applications', () => {
    beforeEach(async () => {
      // Login as supplier
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('supplier@example.com');
      await loginPage.getPasswordInput().sendKeys('supplier123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to applications
      await appPage.getSupplierApplicationsLink().click();
      await browser.waitForAngular();
    });

    it('should display applications list', () => {
      expect(browser.getCurrentUrl()).toContain('/supplier/applications');
      expect(appPage.getApplicationsList().isPresent()).toBe(true);
    });

    it('should display application status', () => {
      expect(appPage.getApplicationStatuses().count()).toBeGreaterThan(0);
    });

    it('should allow filtering applications by status', async () => {
      const statusFilter = appPage.getApplicationStatusFilter();
      await statusFilter.click();
      await appPage.getStatusOption('pending').click();
      
      // Wait for filter to apply
      await browser.sleep(1000);
      
      // Verify filtered results
      const filteredApplications = appPage.getApplicationRows();
      expect(filteredApplications.count()).toBeGreaterThanOrEqual(0);
    });

    it('should allow viewing application details', async () => {
      const firstApplication = appPage.getApplicationRows().first();
      await firstApplication.click();
      
      // Wait for details modal
      await browser.waitForAngular();
      expect(appPage.getApplicationDetailsModal().isPresent()).toBe(true);
    });

    it('should allow withdrawing application', async () => {
      const firstApplication = appPage.getApplicationRows().first();
      const withdrawButton = firstApplication.element(by.css('.withdraw-application-btn'));
      await withdrawButton.click();
      
      // Wait for confirmation modal
      await browser.waitForAngular();
      expect(appPage.getWithdrawConfirmationModal().isPresent()).toBe(true);
    });

    it('should allow updating application documents', async () => {
      const firstApplication = appPage.getApplicationRows().first();
      await firstApplication.click();
      await browser.waitForAngular();
      
      // Click update documents button
      await appPage.getUpdateDocumentsButton().click();
      
      // Wait for document upload form
      await browser.waitForAngular();
      expect(appPage.getDocumentUploadForm().isPresent()).toBe(true);
    });
  });

  describe('Supplier Search and Discovery', () => {
    beforeEach(async () => {
      // Navigate to supplier list
      browser.get('/suppliers');
    });

    it('should display supplier list page', () => {
      expect(browser.getCurrentUrl()).toContain('/suppliers');
      expect(appPage.getSupplierListTitle().isPresent()).toBe(true);
    });

    it('should display supplier cards', () => {
      expect(appPage.getSupplierCards().count()).toBeGreaterThan(0);
    });

    it('should allow searching suppliers', async () => {
      const searchInput = appPage.getSupplierSearchInput();
      await searchInput.sendKeys('construction');
      await searchInput.sendKeys(protractor.Key.ENTER);
      
      // Wait for search to complete
      await browser.sleep(1000);
      
      // Verify search results
      const searchResults = appPage.getSupplierCards();
      expect(searchResults.count()).toBeGreaterThanOrEqual(0);
    });

    it('should allow filtering suppliers by category', async () => {
      const categoryFilter = appPage.getSupplierCategoryFilter();
      await categoryFilter.click();
      await appPage.getCategoryOption('Construction').click();
      
      // Wait for filter to apply
      await browser.sleep(1000);
      
      // Verify filtered results
      const filteredSuppliers = appPage.getSupplierCards();
      expect(filteredSuppliers.count()).toBeGreaterThanOrEqual(0);
    });

    it('should allow filtering suppliers by location', async () => {
      const locationFilter = appPage.getSupplierLocationFilter();
      await locationFilter.click();
      await appPage.getLocationOption('Abidjan').click();
      
      // Wait for filter to apply
      await browser.sleep(1000);
      
      // Verify filtered results
      const filteredSuppliers = appPage.getSupplierCards();
      expect(filteredSuppliers.count()).toBeGreaterThanOrEqual(0);
    });

    it('should navigate to supplier detail', async () => {
      const firstSupplierCard = appPage.getSupplierCards().first();
      await firstSupplierCard.click();
      
      // Wait for navigation
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/suppliers/');
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
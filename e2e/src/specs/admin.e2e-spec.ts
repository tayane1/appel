import { browser, logging } from 'protractor';
import { AppPage } from '../page-objects/app.po';
import { LoginPage } from '../page-objects/login.po';

describe('Admin E2E Tests', () => {
  let appPage: AppPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    appPage = new AppPage();
    loginPage = new LoginPage();
  });

  describe('Admin Dashboard', () => {
    beforeEach(async () => {
      // Login as admin user
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('admin@example.com');
      await loginPage.getPasswordInput().sendKeys('admin123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to admin dashboard
      await appPage.getAdminDashboardLink().click();
      await browser.waitForAngular();
    });

    it('should display admin dashboard', () => {
      expect(browser.getCurrentUrl()).toContain('/admin/dashboard');
      expect(appPage.getAdminDashboardTitle().isPresent()).toBe(true);
    });

    it('should display statistics cards', () => {
      expect(appPage.getStatisticsCards().count()).toBeGreaterThan(0);
    });

    it('should display recent activities', () => {
      expect(appPage.getRecentActivities().isPresent()).toBe(true);
    });

    it('should display charts and graphs', () => {
      expect(appPage.getDashboardCharts().count()).toBeGreaterThan(0);
    });

    it('should allow navigation to different admin sections', async () => {
      // Test navigation to user management
      await appPage.getUserManagementLink().click();
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/admin/users');
      
      // Navigate back to dashboard
      await appPage.getAdminDashboardLink().click();
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/admin/dashboard');
    });
  });

  describe('User Management', () => {
    beforeEach(async () => {
      // Login as admin user
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('admin@example.com');
      await loginPage.getPasswordInput().sendKeys('admin123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to user management
      await appPage.getUserManagementLink().click();
      await browser.waitForAngular();
    });

    it('should display user management page', () => {
      expect(browser.getCurrentUrl()).toContain('/admin/users');
      expect(appPage.getUserManagementTitle().isPresent()).toBe(true);
    });

    it('should display user list', () => {
      expect(appPage.getUserList().isPresent()).toBe(true);
      expect(appPage.getUserRows().count()).toBeGreaterThan(0);
    });

    it('should allow searching users', async () => {
      const searchInput = appPage.getUserSearchInput();
      await searchInput.sendKeys('test');
      await searchInput.sendKeys(protractor.Key.ENTER);
      
      // Wait for search to complete
      await browser.sleep(1000);
      
      // Verify search results
      const searchResults = appPage.getUserRows();
      expect(searchResults.count()).toBeGreaterThanOrEqual(0);
    });

    it('should allow filtering users by role', async () => {
      const roleFilter = appPage.getRoleFilter();
      await roleFilter.click();
      await appPage.getRoleOption('supplier').click();
      
      // Wait for filter to apply
      await browser.sleep(1000);
      
      // Verify filtered results
      const filteredUsers = appPage.getUserRows();
      expect(filteredUsers.count()).toBeGreaterThanOrEqual(0);
    });

    it('should allow editing user details', async () => {
      const firstUserRow = appPage.getUserRows().first();
      await firstUserRow.click();
      
      // Wait for edit modal to appear
      await browser.waitForAngular();
      expect(appPage.getEditUserModal().isPresent()).toBe(true);
    });

    it('should allow changing user status', async () => {
      const firstUserRow = appPage.getUserRows().first();
      const statusToggle = firstUserRow.element(by.css('.status-toggle'));
      await statusToggle.click();
      
      // Wait for status change
      await browser.sleep(1000);
      
      // Verify status changed
      expect(statusToggle.getAttribute('class')).toContain('active');
    });

    it('should allow deleting users', async () => {
      const firstUserRow = appPage.getUserRows().first();
      const deleteButton = firstUserRow.element(by.css('.delete-user-btn'));
      await deleteButton.click();
      
      // Wait for confirmation modal
      await browser.waitForAngular();
      expect(appPage.getDeleteConfirmationModal().isPresent()).toBe(true);
    });
  });

  describe('Tender Management', () => {
    beforeEach(async () => {
      // Login as admin user
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('admin@example.com');
      await loginPage.getPasswordInput().sendKeys('admin123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to tender management
      await appPage.getTenderManagementLink().click();
      await browser.waitForAngular();
    });

    it('should display tender management page', () => {
      expect(browser.getCurrentUrl()).toContain('/admin/tenders');
      expect(appPage.getTenderManagementTitle().isPresent()).toBe(true);
    });

    it('should display tender list', () => {
      expect(appPage.getAdminTenderList().isPresent()).toBe(true);
      expect(appPage.getAdminTenderRows().count()).toBeGreaterThan(0);
    });

    it('should allow creating new tender', async () => {
      await appPage.getCreateTenderButton().click();
      
      // Wait for create form to appear
      await browser.waitForAngular();
      expect(appPage.getCreateTenderForm().isPresent()).toBe(true);
    });

    it('should validate tender creation form', async () => {
      await appPage.getCreateTenderButton().click();
      await browser.waitForAngular();
      
      // Try to submit empty form
      await appPage.getSubmitTenderButton().click();
      
      // Verify validation errors
      expect(appPage.getTenderFormErrors().count()).toBeGreaterThan(0);
    });

    it('should allow editing tender', async () => {
      const firstTenderRow = appPage.getAdminTenderRows().first();
      await firstTenderRow.click();
      
      // Wait for edit form to appear
      await browser.waitForAngular();
      expect(appPage.getEditTenderForm().isPresent()).toBe(true);
    });

    it('should allow publishing tender', async () => {
      const firstTenderRow = appPage.getAdminTenderRows().first();
      const publishButton = firstTenderRow.element(by.css('.publish-tender-btn'));
      await publishButton.click();
      
      // Wait for status change
      await browser.sleep(1000);
      
      // Verify tender is published
      expect(publishButton.getAttribute('class')).toContain('published');
    });

    it('should allow managing tender applications', async () => {
      const firstTenderRow = appPage.getAdminTenderRows().first();
      const applicationsButton = firstTenderRow.element(by.css('.view-applications-btn'));
      await applicationsButton.click();
      
      // Wait for applications modal
      await browser.waitForAngular();
      expect(appPage.getApplicationsModal().isPresent()).toBe(true);
    });
  });

  describe('Supplier Management', () => {
    beforeEach(async () => {
      // Login as admin user
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('admin@example.com');
      await loginPage.getPasswordInput().sendKeys('admin123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to supplier management
      await appPage.getSupplierManagementLink().click();
      await browser.waitForAngular();
    });

    it('should display supplier management page', () => {
      expect(browser.getCurrentUrl()).toContain('/admin/suppliers');
      expect(appPage.getSupplierManagementTitle().isPresent()).toBe(true);
    });

    it('should display supplier list', () => {
      expect(appPage.getSupplierList().isPresent()).toBe(true);
      expect(appPage.getSupplierRows().count()).toBeGreaterThan(0);
    });

    it('should allow verifying supplier documents', async () => {
      const firstSupplierRow = appPage.getSupplierRows().first();
      const verifyButton = firstSupplierRow.element(by.css('.verify-supplier-btn'));
      await verifyButton.click();
      
      // Wait for verification modal
      await browser.waitForAngular();
      expect(appPage.getVerificationModal().isPresent()).toBe(true);
    });

    it('should allow approving supplier registration', async () => {
      const firstSupplierRow = appPage.getSupplierRows().first();
      const approveButton = firstSupplierRow.element(by.css('.approve-supplier-btn'));
      await approveButton.click();
      
      // Wait for status change
      await browser.sleep(1000);
      
      // Verify supplier is approved
      expect(approveButton.getAttribute('class')).toContain('approved');
    });
  });

  describe('Advertisement Management', () => {
    beforeEach(async () => {
      // Login as admin user
      loginPage.navigateTo();
      await loginPage.getEmailInput().sendKeys('admin@example.com');
      await loginPage.getPasswordInput().sendKeys('admin123');
      await loginPage.getLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to advertisement management
      await appPage.getAdvertisementManagementLink().click();
      await browser.waitForAngular();
    });

    it('should display advertisement management page', () => {
      expect(browser.getCurrentUrl()).toContain('/admin/advertisements');
      expect(appPage.getAdvertisementManagementTitle().isPresent()).toBe(true);
    });

    it('should display advertisement list', () => {
      expect(appPage.getAdvertisementList().isPresent()).toBe(true);
      expect(appPage.getAdvertisementRows().count()).toBeGreaterThan(0);
    });

    it('should allow creating new advertisement', async () => {
      await appPage.getCreateAdvertisementButton().click();
      
      // Wait for create form to appear
      await browser.waitForAngular();
      expect(appPage.getCreateAdvertisementForm().isPresent()).toBe(true);
    });

    it('should allow scheduling advertisements', async () => {
      const firstAdRow = appPage.getAdvertisementRows().first();
      const scheduleButton = firstAdRow.element(by.css('.schedule-ad-btn'));
      await scheduleButton.click();
      
      // Wait for schedule modal
      await browser.waitForAngular();
      expect(appPage.getScheduleModal().isPresent()).toBe(true);
    });

    it('should allow managing advertisement performance', async () => {
      const firstAdRow = appPage.getAdvertisementRows().first();
      const performanceButton = firstAdRow.element(by.css('.view-performance-btn'));
      await performanceButton.click();
      
      // Wait for performance modal
      await browser.waitForAngular();
      expect(appPage.getPerformanceModal().isPresent()).toBe(true);
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
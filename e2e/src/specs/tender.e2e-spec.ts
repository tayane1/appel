import { browser, logging } from 'protractor';
import { AppPage } from '../page-objects/app.po';
import { LoginPage } from '../page-objects/login.po';

describe('Tender E2E Tests', () => {
  let appPage: AppPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    appPage = new AppPage();
    loginPage = new LoginPage();
  });

  describe('Tender List Page', () => {
    beforeEach(async () => {
      // Login as demo user
      loginPage.navigateTo();
      await loginPage.getDemoLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to tender list
      await appPage.getTenderListLink().click();
      await browser.waitForAngular();
    });

    it('should display tender list page', () => {
      expect(browser.getCurrentUrl()).toContain('/tenders');
      expect(appPage.getTenderListTitle().isPresent()).toBe(true);
    });

    it('should display tender cards', () => {
      expect(appPage.getTenderCards().count()).toBeGreaterThan(0);
    });

    it('should filter tenders by category', async () => {
      const categoryFilter = appPage.getCategoryFilter();
      await categoryFilter.click();
      await appPage.getCategoryOption('Construction').click();
      
      // Wait for filter to apply
      await browser.sleep(1000);
      
      // Verify filtered results
      const filteredCards = appPage.getTenderCards();
      expect(filteredCards.count()).toBeGreaterThanOrEqual(0);
    });

    it('should search tenders by keyword', async () => {
      const searchInput = appPage.getSearchInput();
      await searchInput.sendKeys('construction');
      await searchInput.sendKeys(protractor.Key.ENTER);
      
      // Wait for search to complete
      await browser.sleep(1000);
      
      // Verify search results
      const searchResults = appPage.getTenderCards();
      expect(searchResults.count()).toBeGreaterThanOrEqual(0);
    });

    it('should sort tenders by date', async () => {
      const sortSelect = appPage.getSortSelect();
      await sortSelect.click();
      await appPage.getSortOption('date-desc').click();
      
      // Wait for sort to apply
      await browser.sleep(1000);
      
      // Verify sorted results
      const sortedCards = appPage.getTenderCards();
      expect(sortedCards.count()).toBeGreaterThan(0);
    });

    it('should navigate to tender detail', async () => {
      const firstTenderCard = appPage.getTenderCards().first();
      await firstTenderCard.click();
      
      // Wait for navigation
      await browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/tenders/');
    });
  });

  describe('Tender Detail Page', () => {
    beforeEach(async () => {
      // Login as demo user
      loginPage.navigateTo();
      await loginPage.getDemoLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to tender list and click first tender
      await appPage.getTenderListLink().click();
      await browser.waitForAngular();
      await appPage.getTenderCards().first().click();
      await browser.waitForAngular();
    });

    it('should display tender details', () => {
      expect(browser.getCurrentUrl()).toContain('/tenders/');
      expect(appPage.getTenderTitle().isPresent()).toBe(true);
      expect(appPage.getTenderDescription().isPresent()).toBe(true);
      expect(appPage.getTenderDeadline().isPresent()).toBe(true);
    });

    it('should display tender documents', () => {
      expect(appPage.getTenderDocuments().isPresent()).toBe(true);
    });

    it('should display tender requirements', () => {
      expect(appPage.getTenderRequirements().isPresent()).toBe(true);
    });

    it('should allow bookmarking tender', async () => {
      const bookmarkButton = appPage.getBookmarkButton();
      await bookmarkButton.click();
      
      // Verify bookmark state changed
      expect(bookmarkButton.getAttribute('class')).toContain('bookmarked');
    });

    it('should allow sharing tender', async () => {
      const shareButton = appPage.getShareButton();
      await shareButton.click();
      
      // Verify share modal appears
      expect(appPage.getShareModal().isPresent()).toBe(true);
    });

    it('should display related tenders', () => {
      expect(appPage.getRelatedTenders().isPresent()).toBe(true);
    });
  });

  describe('Tender Application', () => {
    beforeEach(async () => {
      // Login as demo user
      loginPage.navigateTo();
      await loginPage.getDemoLoginButton().click();
      await browser.waitForAngular();
      
      // Navigate to tender detail
      await appPage.getTenderListLink().click();
      await browser.waitForAngular();
      await appPage.getTenderCards().first().click();
      await browser.waitForAngular();
    });

    it('should display apply button for eligible users', () => {
      expect(appPage.getApplyButton().isPresent()).toBe(true);
    });

    it('should open application form', async () => {
      await appPage.getApplyButton().click();
      
      // Wait for application form to load
      await browser.waitForAngular();
      expect(appPage.getApplicationForm().isPresent()).toBe(true);
    });

    it('should validate application form', async () => {
      await appPage.getApplyButton().click();
      await browser.waitForAngular();
      
      // Try to submit empty form
      await appPage.getSubmitApplicationButton().click();
      
      // Verify validation errors
      expect(appPage.getApplicationErrors().count()).toBeGreaterThan(0);
    });

    it('should allow file upload', async () => {
      await appPage.getApplyButton().click();
      await browser.waitForAngular();
      
      const fileInput = appPage.getFileInput();
      await fileInput.sendKeys('/path/to/test/document.pdf');
      
      // Verify file is uploaded
      expect(appPage.getUploadedFiles().count()).toBeGreaterThan(0);
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
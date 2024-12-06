import {expect, test} from "@playwright/test";
import {
    username,
    password,
    defaultApplicationsPageSize,
    ApplicationTexts,
    applicationsSearchText,
    applicationsPageSize
} from '../fixtures/fixtures.js'
import {LoginPage} from "./pages/login.page";
import {ApplicationsPage} from "./pages/applications.page";
import {RegExp} from "../fixtures/regular-expressions";

test.describe('Applications Page', async () => {
    let applicationsPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        applicationsPage = new ApplicationsPage(page);

        await loginPage.open();
        await loginPage.login(username, password);
        await applicationsPage.goToApplicationsPage();
        await expect(page).toHaveTitle(ApplicationTexts.applicationsPage.title);
    });

    test('should list all applications', async () => {
        const allRows = await applicationsPage.getApplicationsTableRows();

        for (const row of allRows) {
            const values = await row.getValues();
            await expect(values.name).toMatch(RegExp.NAME);
            await expect(values.date).toMatch(RegExp.DATE);
            await expect(values.paymentType).toMatch(RegExp.PAYMENT_TYPE);
            await expect(values.toPay).toMatch(RegExp.TO_PAY);
        }
    });

    test('should filter in applications', async ({ page }) => {
        await applicationsPage.waitForTableToLoad();
    
        const allRows = await applicationsPage.getApplicationsTableRows();
        console.log('Number of rows before filtering:', allRows.length);
    
        await expect(allRows.length, 'table should have >= ' + applicationsPageSize + ' rows')
            .toBeGreaterThanOrEqual(applicationsPageSize); // Zde by měly být alespoň 10 řádků
    
        await applicationsPage.searchInApplicationsTable(applicationsSearchText);
        await applicationsPage.waitForTableToLoad();
    
        const filteredRows = await applicationsPage.getApplicationsTableRows();
        console.log('Number of rows after filtering:', filteredRows.length);
    
        await expect(filteredRows.length, 'table should have < ' + allRows.length + ' rows')
            .toBeLessThan(allRows.length);
    
        for (const row of filteredRows) {
            const values = await row.getValues();
            await expect(values.name).toContain(applicationsSearchText);
        }
    });
    
    });


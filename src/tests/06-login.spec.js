import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
} from "../fixtures/fixtures.js"



test.describe('Login Page', () => {
    

    test.beforeEach(async ({page}) => {
        await page.goto('/prihlaseni');
    });
    async function getEmailField(page) {
        return await page.getByLabel('Email');
     };
     
     async function getPasswordField(page) {
        return await page.getByLabel('Heslo');
     };

     async function getLoginButton(page) {
        return await page.getByRole('button', { name: 'Přihlásit'});
     }

    test('should show login form', async ({ page }) => {
        const emailField = await getEmailField(page);
        await expect(emailField, 'email field should be visible').toBeVisible();
       
        const passwordField = await getPasswordField(page);
        await expect(passwordField, 'password field should be visible').toBeVisible();

        const loginButton = await getLoginButton(page);
        await expect(loginButton, 'login button should be visible').toBeVisible();
        await expect(loginButton, 'login button text should have text').toHaveText('Přihlásit');
    });

    test('should login with valid credentials', async ({ page }) => {
        const emailField = await getEmailField(page);
        const passwordField = await getPasswordField(page);
        const loginButton = await getLoginButton(page);

        await emailField.fill(username);
        await passwordField.fill(password);
        await loginButton.click();

        const currentUser = page
            .locator('.navbar-right')
            .locator('strong');
        await expect(currentUser, 'current user should be displayed').toHaveText(userFullName);
    });

    test('should not login with invalid credentials', async ({ page }) => {
        const emailField = await getEmailField(page);
        const passwordField = await getPasswordField(page);
        const loginButton = await getLoginButton(page);

        await emailField.fill(username);
        await passwordField.fill('invalid');
        await loginButton.click();

        const toastMessage = page.locator('.toast-message');
        const fieldError = page.locator('.invalid-feedback');
        await expect(toastMessage).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        await expect(fieldError).toHaveText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.');
        await expect(emailField, 'email field should be visible').toBeVisible();
        await expect(passwordField, 'password field should be visible').toBeVisible();
        await expect(loginButton, 'login buton should be visible').toBeVisible();
    });

    test('should logout', async ({ page }) => {
        const emailField = await getEmailField(page);
        const passwordField = await getPasswordField(page);
        const loginButton = await getLoginButton(page);
        const navbarRight = page.locator('.navbar-right')
        const userNameDropdown = navbarRight.locator('[data-toggle="dropdown"]');
        const logoutLink = page.locator('#logout-link');

        await emailField.fill(username);
        await passwordField.fill(password);
        await loginButton.click();

        await expect(userNameDropdown).toHaveText(userFullName);

        await userNameDropdown.click();
        await logoutLink.click();

        await expect(userNameDropdown).toBeVisible({ visible: false });
        await expect(navbarRight).toHaveText('Přihlásit');
    });
});

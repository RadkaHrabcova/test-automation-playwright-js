import { expect, test } from "@playwright/test";
import { AppPage } from "./pages/app.page.js";
import { RegistrationPage } from "./pages/registration.page.js";

test.describe('Registration Page', () => {
    let registrationPage;
    let appPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        appPage = new AppPage(page);
        await registrationPage.open();
    });

    test('should show registration form', async () => {
        await expect(registrationPage.nameField).toBeVisible();
        await expect(registrationPage.nameField).toBeEnabled();

        await expect(registrationPage.emailField).toBeVisible();
        await expect(registrationPage.emailField).toBeEnabled();

        await expect(registrationPage.passwordField).toBeVisible();
        await expect(registrationPage.passwordField).toBeEnabled();

        await expect(registrationPage.passwordConfirm).toBeVisible();
        await expect(registrationPage.passwordConfirm).toBeEnabled();

        await expect(registrationPage.registerButton).toBeVisible();
        await expect(registrationPage.registerButton).toHaveText('Zaregistrovat');
    });

    test('should register with valid credentials', async () => {
        const uniqueEmail = `pavel${Date.now()}@gmail.com`;
        const userName = 'Pavel';
        await registrationPage.registerUser({ email: uniqueEmail, userName, password: '1PavelOtak' });

        await expect(appPage.usernameDropdown, 'current user should be displayed').toHaveText(userName);
    });

    test('should not register with existing email', async () => {
        // Register a new user
        const uniqueEmail = `pavel${Date.now()}@gmail.com`;
        const userName = 'Pavel';
        await registrationPage.registerUser({ email: uniqueEmail, userName, password: '1PavelOtak' });
        await expect(appPage.usernameDropdown, 'current user should be displayed').toHaveText(userName);

        // Log out and try to register again with the same email
        await appPage.usernameDropdown.click();
        await appPage.logoutLink.click();
        await registrationPage.open();

        await registrationPage.registerUser({ email: uniqueEmail, userName, password: '1PavelOtak' });

        await expect(registrationPage.fieldError).toHaveText('Účet s tímto emailem již existuje');
        await expect(registrationPage.nameField).toBeVisible();
        await expect(registrationPage.emailField).toBeVisible();
        await expect(registrationPage.passwordField).toBeVisible();
        await expect(registrationPage.passwordConfirm).toBeVisible();
        await expect(registrationPage.registerButton).toBeVisible();
    });

    test('should not register with invalid password', async () => {
        const uniqueEmail = `marek${Date.now()}@gmail.com`;
        await registrationPage.registerUser({ email: uniqueEmail, userName: 'Marek', password: '123456789' });

        await expect(registrationPage.fieldError).toHaveText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici');
        await expect(registrationPage.toast).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');

        await expect(registrationPage.nameField).toBeVisible();
        await expect(registrationPage.emailField).toBeVisible();
        await expect(registrationPage.passwordField).toBeVisible();
        await expect(registrationPage.passwordConfirm).toBeVisible();
        await expect(registrationPage.registerButton).toBeVisible();
    });
});

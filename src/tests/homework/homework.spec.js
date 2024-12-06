/*1. Test který přejde na formulář registrace
zkontroluje, že se formulář správně zobrazil 

2. Test který provede validní registraci uživatele
zkontroluj, že registrace proběhla úspěšně

3. Test, který provede registraci uživatele s již existujícím emailem
zkontroluj, že registrace neproběhla a ověř chyby
zkontroluj stav formuláře
tip: elementy s třídou invalid-feedback

4. Test, který provede registraci uživatele s nevalidním heslem (obsahující pouze čísla)
zkontroluj, že registrace neproběhla a ověř chyby
zkontroluj stav formuláře
*/

import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
} from "../../fixtures/fixtures.js"
import {LoginPage} from "./pages/login.page";
import {AppPage} from "./pages/app.page.js";
import {RegistrationPage} from "./pages/registration.page.js";



test.describe('Registration Page', () => {
    let registrationPage;
    let loginPage;
    let appPage;

    test.beforeEach(async ({page}) => {
        registrationPage = new RegistrationPage(page);
        loginPage = new LoginPage(page);
        appPage = new AppPage(page);
        await registrationPage.open();
    });

    test('should show registration form', async ({ page }) => {
        await expect(registrationPage.nameField, 'name field should be visible').toBeVisible();
        await expect(registrationPage.nameField, 'name field should be enabled').toBeEnabled();

        await expect(registrationPage.emailField, 'email field should be visible').toBeVisible();
        await expect(registrationPage.emailField, 'email field should be enabled').toBeEnabled();

        await expect(registrationPage.passwordField, 'password field should be visible').toBeVisible();
        await expect(registrationPage.passwordField, 'password field should be enabled').toBeEnabled();

        await expect(registrationPage.passwordConfirm, 'password confirm field should be visible').toBeVisible();
        await expect(registrationPage.passwordConfirm, 'password confirm field should be enabled').toBeEnabled();

        await expect(registrationPage.registerButton, 'login button should be visible').toBeVisible();
        await expect(registrationPage.registerButton, 'login button text should have text').toHaveText('Zaregistrovat')


    });

    test('should register with valid credentials', async ({ page }) => {
        const userName = await registrationPage.register();
        await expect(appPage.usernameDropdown, 'current user should be displayed').toHaveText(userName);
    });

  test('should not register with existing email', async ({ page }) => {
       

        await expect(loginPage.toast).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        await expect(loginPage.fieldError).toHaveText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.');
        await expect(loginPage.emailField, 'email field should be visible').toBeVisible();
        await expect(loginPage.passwordField, 'password field should be visible').toBeVisible();
        await expect(loginPage.loginButton, 'login buton should be visible').toBeVisible();
    });

    test('should not login with invalid password', async ({ page }) => {
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

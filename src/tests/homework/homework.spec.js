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
import {AppPage} from "./pages/app.page.js";
import {RegistrationPage} from "./pages/registration.page.js";



test.describe('Registration Page', () => {
    let registrationPage;
    let appPage;

    test.beforeEach(async ({page}) => {
        registrationPage = new RegistrationPage(page);
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

        await expect(registrationPage.registerButton, 'register button should be visible').toBeVisible();
        await expect(registrationPage.registerButton, 'register button text should have text').toHaveText('Zaregistrovat')


    });

    test('should register with valid credentials', async ({ page }) => {
        const {userName} = await registrationPage.registerWithUniqueEmail();
        await expect(appPage.usernameDropdown, 'current user should be displayed').toHaveText(userName);
    });

  test('should not register with existing email', async ({ page }) => {
        //creating new registration
        const {userName, uniqueEmail} = await registrationPage.registerWithUniqueEmail();
        await expect(appPage.usernameDropdown, 'current user should be displayed').toHaveText(userName);

        await appPage.usernameDropdown.click();
        await appPage.logoutLink.click();
        await registrationPage.open()

        //register with existing email
        await registrationPage.nameField.fill(userName);
        await registrationPage.emailField.fill(uniqueEmail);
        await registrationPage.passwordField.fill('1PavelOtak');
        await registrationPage.passwordConfirm.fill('1PavelOtak');
        await registrationPage.registerButton.click();

        await expect(registrationPage.fieldError).toHaveText('Účet s tímto emailem již existuje');
        await expect(registrationPage.nameField, 'name field should be visible').toBeVisible();
        await expect(registrationPage.emailField, 'email field should be visible').toBeVisible();
        await expect(registrationPage.passwordField, 'password field should be visible').toBeVisible();
        await expect(registrationPage.passwordConfirm, 'password confirm field should be visible').toBeVisible();
        await expect(registrationPage.registerButton, 'register button should be visible').toBeVisible();
        
    });

    test('should not register with invalid password', async ({ page }) => {
       await registrationPage.registerWithInvalidPassword();

       await expect(registrationPage.fieldError).toHaveText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici');
       await expect(registrationPage.toast).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
       
       await expect(registrationPage.nameField, 'name field should be visible').toBeVisible();
       await expect(registrationPage.emailField, 'email field should be visible').toBeVisible();
       await expect(registrationPage.passwordField, 'password field should be visible').toBeVisible();
       await expect(registrationPage.passwordConfirm, 'password confirm field should be visible').toBeVisible();
       await expect(registrationPage.registerButton, 'register button should be visible').toBeVisible();
      
    });
});

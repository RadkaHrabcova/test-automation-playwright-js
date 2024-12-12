//Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové Objednávky pro MŠ/ZŠ
//Po kliknutí na Pro učitele > Objednávka pro MŠ/ZŠ se otevře formulář, kde může uživatel vyplnit detail objednávky
//Po vyplnění IČO do formuláře objednávky se automaticky načte jméno odběratele a adresa odběratele z ARESu
//Uživatel může odeslat vyplněnou objednávku na příměstský tábor
//Objednávku nelze odeslat pokud není řádně vyplněna*/

import { expect, test } from "@playwright/test";
import { AppPage } from "./pages/app.page.js";
import { OrderPage } from "./pages/order.page.js";

test.describe('Order Page', () => {
    let orderPage;
    let appPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        orderPage = new OrderPage(page);
        appPage = new AppPage(page);
    });

    test('Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové Objednávky pro MŠ/ZŠ', async () => {
        await expect(appPage.forTeacherMenuItemLocator).toBeVisible(); 
        await appPage.forTeacherMenuItemLocator.click();
        await expect(appPage.newOrderLocator).toBeVisible();
    });

    test.describe('Vytvoření objednávky', () => {
        test.beforeEach(async () => {
            await appPage.createNewOrder();
        });

        async function checkOrderForm() {
            await expect(orderPage.pageHeader).toBeVisible();
            await expect(orderPage.icoField).toBeVisible();
            await expect(orderPage.clientField).toBeVisible();
            await expect(orderPage.addressField).toBeVisible();
            await expect(orderPage.substituteField).toBeVisible();
            await expect(orderPage.contactNameField).toBeVisible();
            await expect(orderPage.contactPhoneField).toBeVisible();
            await expect(orderPage.contactEmailField).toBeVisible();
            await expect(orderPage.startDateField).toBeVisible();
            await expect(orderPage.endDateField).toBeVisible();
            await expect(orderPage.suburbanCampTab).toBeVisible();
        }

        test('Po kliknutí na Pro učitele > Objednávka pro MŠ/ZŠ se otevře formulář, kde může uživatel vyplnit detail objednávky', async () => {
            await checkOrderForm();
            await orderPage.suburbanCampTab.click();
            await expect(orderPage.numberOfStudentsField).toBeVisible();
            await expect(orderPage.studentAgeField).toBeVisible();
            await expect(orderPage.numberOfTeachersField).toBeVisible();
            await expect(orderPage.submitButton).toBeVisible();
        });

        test('Po vyplnění IČO do formuláře objednávky se automaticky načte jméno odběratele a adresa odběratele z ARESu', async () => {
            await checkOrderForm();
            await orderPage.icoField.fill('29240026');
            await orderPage.icoField.press('Enter');
            await expect(orderPage.clientField).not.toHaveValue('');
            await expect(orderPage.addressField).not.toHaveValue('');
        });

        test('Uživatel může odeslat vyplněnou objednávku na příměstský tábor', async () => {
            await checkOrderForm();
            await orderPage.icoField.fill('29240026');
            await orderPage.icoField.press('Enter');
            await expect(orderPage.clientField).toBeEnabled({ timeout: 10000 });

            await orderPage.clientField.fill('Testovací klient');
            await expect(orderPage.clientField).toHaveValue('Testovací klient');
            await orderPage.addressField.fill('Testovací adresa 123');
        await expect(orderPage.addressField).toHaveValue('Testovací adresa 123');
        await orderPage.substituteField.fill('Testovací substitut');
            await orderPage.contactNameField.fill('Jan Novák');
             await orderPage.contactPhoneField.fill('725698456');
         await orderPage.contactEmailField.fill('test@gmail.com');
         await orderPage.startDateField.fill('20.02.2025');
         await orderPage.endDateField.fill('27.02.2025');
         

    // Sekce pro příměstský tábor
            await orderPage.suburbanCampTab.click();
            await orderPage.numberOfStudentsField.fill('10');
            await orderPage.studentAgeField.fill('10');
            await orderPage.numberOfTeachersField.fill('2');

   // Odeslání objednávky
           await orderPage.submitButton.click();

    //Validace, že objednávka byla odeslána
    await expect(orderPage.thankYouForOrderMessage).toBeVisible();
        });

        test('Objednávku nelze odeslat pokud není řádně vyplněna', async () => {
            await checkOrderForm();
            await orderPage.submitButton.click();
            await expect(orderPage.errorMessages).toBeVisible();
        });

    });
});


     


 

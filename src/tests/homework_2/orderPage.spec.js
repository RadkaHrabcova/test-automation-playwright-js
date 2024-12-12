//Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové Objednávky pro MŠ/ZŠ
//Po kliknutí na Pro učitele > Objednávka pro MŠ/ZŠ se otevře formulář, kde může uživatel vyplnit detail objednávky
//Po vyplnění IČO do formuláře objednávky se automaticky načte jméno odběratele a adresa odběratele z ARESu
//Uživatel může odeslat vyplněnou objednávku na příměstský tábor
//Objednávku nelze odeslat pokud není řádně vyplněna*/

import { expect, test } from "@playwright/test";
import { AppPage } from "./pages/app.page.js";
import { OrderPage } from "./pages/order.page.js";

test.describe("Order Page", () => {
  let orderPage;
  let appPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    orderPage = new OrderPage(page);
    appPage = new AppPage(page);
  });

  test("The application allows the user to create a new Order for Kindergarten/ZŠ in the For teachers menu", async () => {
    await expect(appPage.forTeacherMenuItemLocator).toBeVisible();
    await appPage.forTeacherMenuItemLocator.click();
    await expect(appPage.newOrderLocator).toBeVisible();
  });

  test.describe("Creating new order", () => {
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

    async function fillBasicSectionOfTheOrderForm() {
      await orderPage.icoField.fill("29240026");
      await orderPage.icoField.press("Enter");
      await expect(orderPage.clientField).toBeEnabled({ timeout: 10000 });
      await orderPage.clientField.fill("Testovací klient");
      await expect(orderPage.clientField).toHaveValue("Testovací klient");
      await orderPage.addressField.fill("Testovací adresa 123");
      await expect(orderPage.addressField).toHaveValue("Testovací adresa 123");
      await orderPage.substituteField.fill("Testovací substitut");
      await orderPage.contactNameField.fill("Jan Novák");
      await orderPage.contactPhoneField.fill("725698456");
      await orderPage.contactEmailField.fill("test@gmail.com");
      await orderPage.startDateField.fill("20.02.2025");
      await orderPage.endDateField.fill("27.02.2025");
    }

    test("After clicking on For teachers > Order for kindergarten/primary school, a form opens where the user can fill in the details of the order", async () => {
      await checkOrderForm();
      await orderPage.suburbanCampTab.click();
      await expect(orderPage.numberOfStudentsField).toBeVisible();
      await expect(orderPage.studentAgeField).toBeVisible();
      await expect(orderPage.numberOfTeachersField).toBeVisible();
      await expect(orderPage.submitButton).toBeVisible();
    });

    test("After filling in the IČO, ARES does not find the data and throws an error message", async () => {
      await checkOrderForm();
      await orderPage.icoField.fill("29240026");
      await orderPage.icoField.press("Enter");
      await expect(orderPage.clientField).toHaveValue("");
      await expect(orderPage.addressField).toHaveValue("");
      await expect(orderPage.toast).toBeVisible({ timeout: 10000 });
      await expect(orderPage.toast).toHaveText(
        "Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně"
      );
    });

    test("The user can send the completed order to the suburban camp", async () => {
      await checkOrderForm();
      await fillBasicSectionOfTheOrderForm();
      // Suburban Camp Section
      await orderPage.suburbanCampTab.click();
      await orderPage.numberOfStudentsField.fill("10");
      await orderPage.studentAgeField.fill("10");
      await orderPage.numberOfTeachersField.fill("2");
      // Sending the order
      await orderPage.submitButton.click();
      await expect(orderPage.thankYouForOrderMessage).toBeVisible();
    });

    test("The order cannot be sent if it is not filled out properly", async () => {
      await checkOrderForm();
      await fillBasicSectionOfTheOrderForm();
      // Suburban Camp Section
      await orderPage.suburbanCampTab.click();
      await orderPage.numberOfStudentsField.fill("10");
      await orderPage.studentAgeField.fill("10");
      // Sending the order
      await orderPage.submitButton.click();
      await expect(orderPage.fieldError).toBeVisible({ timeout: 10000 });
    });
  });
});

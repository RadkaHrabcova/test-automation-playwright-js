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

  test("The application allows to create a new Order for Kindergarten/ZŠ in the For teachers menu", async () => {
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

    test("After clicking on For teachers > Order for kindergarten/primary school, the order form is displayed correctly", async () => {
      await checkOrderForm();
      await orderPage.suburbanCampTab.click();
      await expect(orderPage.numberOfStudentsField).toBeVisible();
      await expect(orderPage.studentAgeField).toBeVisible();
      await expect(orderPage.numberOfTeachersField).toBeVisible();
      await expect(orderPage.submitButton).toBeVisible();
    });

    test("ARES data not found displays error message", async () => {
      await checkOrderForm();
      await orderPage.icoField.fill("29240026");
      await orderPage.icoField.press("Enter");
      await expect(orderPage.clientField).toHaveValue("");
      await expect(orderPage.addressField).toHaveValue("");
      await expect(orderPage.toast).toBeVisible({ timeout: 10000 });
      await expect(orderPage.toast).toHaveText("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně");
    });

    async function fillSuburbanCampSectionOfTheOrderForm(students, age, teachers) {
      await orderPage.suburbanCampTab.click();
      await orderPage.numberOfStudentsField.fill(students);
      await orderPage.studentAgeField.fill(age);
      await orderPage.numberOfTeachersField.fill(teachers);
    }

    test("The user can send the completed order to the suburban camp", async () => {
      await checkOrderForm();
      await fillBasicSectionOfTheOrderForm();
      // Suburban Camp Section
      await fillSuburbanCampSectionOfTheOrderForm("10", "10", "2");
      // Sending the order
      await orderPage.submitButton.click();
      await expect(orderPage.thankYouForOrderMessage).toBeVisible();
    });

    test("The order cannot be sent if it is not filled out properly", async () => {
      await checkOrderForm();
      await fillBasicSectionOfTheOrderForm();
      // Suburban Camp Section, but Number of teachers is not filled
      await fillSuburbanCampSectionOfTheOrderForm("10", "10", "");
      // Sending the order
      await orderPage.submitButton.click();
      await expect(orderPage.thankYouForOrderMessage).not.toBeVisible();
      await checkOrderForm();
    });
  });
});

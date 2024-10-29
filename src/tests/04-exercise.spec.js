import { expect,test } from "@playwright/test";
import { username, password, userFullName, applicationsSearchText,
    applicationsPageSize, } from "../fixtures/fixtures";
import { RegExp } from "../fixtures/regular-expressions";

test("should should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log(await page.title());


const emailFieldLocator = page.getByLabel('Email');
const passwordFieldLocator = page.getByLabel('Heslo');
const loginButtonLocator = page.getByRole('button', { name: 'Přihlásit'});

await expect(emailFieldLocator, 'email field should be visible').toBeVisible();
await expect(passwordFieldLocator, 'password field should be visible').toBeVisible();
await expect(loginButtonLocator, 'login button should be visible').toHaveText('Přihlásit');

await emailFieldLocator.fill(username);
await passwordFieldLocator.fill(password);
await loginButtonLocator.click();

await expect(emailFieldLocator).not.toBeAttached();
await expect(passwordFieldLocator).not.toBeAttached();
await expect(loginButtonLocator).not.toBeAttached();

const currentUser = page
.locator(".navbar-right")
.locator("strong");
await expect(currentUser, "current user should be displayed").toHaveText(userFullName);

await page.getByRole("link", {name: "Přihlášky"}).click();
await page.waitForLoadState();

const pageSizeTextLocator = page.locator("#DataTables_Table_0_info");
await expect(pageSizeTextLocator, "page size text should be visible").toHaveText("Zobrazeno 1 až 10 záznamů z 10");


  // Print all applications
  const rows = await page
  .locator("#DataTables_Table_0")
  .locator("tbody")
  .locator("tr")
  .all();

  
//await expect.soft(rows.length, "table should have >= " + applicationsPageSize + " rows")
  //.toBeGreaterThanOrEqual(applicationsPageSize);

for (const row of rows) {
  const cells = row.locator("td");
  await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
  await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
  await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
  await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
}
});
import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log("This is my first test!");
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "login_page_1920_1080.png" });
});

test("should screenshot element by tags", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator("form").screenshot({ path: "css_form.png" });
    await page.locator("input").nth(1).screenshot({ path: "css_input2.png" });
});

test("should screenshot element by ID", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator("#email").screenshot({ path: "id_email.png" });
    await page.locator("#password").screenshot({ path: "id_password.png" });
});

test("should screenshot element by class", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator("button.btn-primary").screenshot({ path: "class_btn_primary.png" }); 
});

test("should screenshot element by attribute", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator("[type=password]").screenshot({ path: "attribute_type_password.png" });
    await page.locator('[type*="ass"]').screenshot({ path: "css_type_ass.png" });
    await page.locator('[type$="word"]').screenshot({ path: "css_type_word.png" });
    await page.locator('[type^="pass"]').screenshot({ path: "css_type_pass.png" });
 });

test("should screenshot element by combination", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator('input#email').screenshot({ path: "css_input_id_email.png" });
    await page.locator('input[name="email"]').screenshot({ path: "css_input_name_email.png" });
    await page.locator('button.btn-primary').screenshot({ path: "css_button_class_btn_primary.png" });
  });

test("should screenshot element by chain", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page
    .locator("div")
    .locator("form")
    .locator('input[type$="word"]')
    .screenshot({ path: "chain.png" });
    });

test("should screenshot get by Playwright locators", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByRole("heading",{level:1}).screenshot({ path: "heading.png" });
    await page.getByLabel("Email").screenshot({ path: "label_email.png" });
    await page.getByText("Zapomněli jste své heslo?").screenshot
});

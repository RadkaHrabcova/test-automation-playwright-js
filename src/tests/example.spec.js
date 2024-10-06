import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log("This is my first test!");
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "login_page_1920_1080.png" });
});

import { test } from "@playwright/test";

test("should make registration page screenshot", async ({ page }) => {
    await page.goto("/registrace");
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "registration_page_1920_1080.png" });

});
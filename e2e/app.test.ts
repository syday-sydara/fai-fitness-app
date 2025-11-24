import { test, expect } from "@playwright/test";

test("WeightTracker logs weight", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Enter weight"]', "75");
  await page.click("text=Log Weight");
  await expect(page.locator("text=75")).toBeVisible();
});

test("LogWorkout logs workout", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Exercise"]', "Pushups");
  await page.fill('input[placeholder="Duration"]', "20");
  await page.click("text=Log Workout");
  await expect(page.locator("text=Pushups")).toBeVisible();
});

test("ProgressCharts renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Progress Charts")).toBeVisible();
});
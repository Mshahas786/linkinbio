import { test, expect } from "@playwright/test"

test.describe("Public profile page", () => {
  test("returns 404 for unknown username", async ({ page }) => {
    const response = await page.goto("/nonexistent-user-12345")
    expect(response?.status()).toBe(404)
  })
})

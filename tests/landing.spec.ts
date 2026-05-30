import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test("renders the main heading", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("All your links")
  })

  test("has working navigation links", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('a[href="/login"]')).toBeVisible()
    await expect(page.locator('a[href="/register"]')).toBeVisible()
  })

  test("has pricing section", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("#pricing")).toBeVisible()
  })

  test("has FAQ section with expandable items", async ({ page }) => {
    await page.goto("/")
    const faq = page.locator("#faq details").first()
    await expect(faq).toBeVisible()
    await faq.click()
    await expect(faq).toHaveAttribute("open")
  })

  test("displays stats counter section", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("text=Creators on Flolio")).toBeVisible()
    await expect(page.locator("text=Links managed")).toBeVisible()
  })
})

test.describe("Auth pages", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test("register page renders form", async ({ page }) => {
    await page.goto("/register")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})

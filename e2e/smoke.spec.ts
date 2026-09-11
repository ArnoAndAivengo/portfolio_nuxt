import { expect, test } from '@playwright/test'

const pages = ['/', '/resume', '/projects', '/trainers'] as const

for (const path of pages) {
  test(`${path} отдаёт 200 и заголовок`, async ({ page }) => {
    const response = await page.goto(path)

    expect(response?.ok()).toBeTruthy()
    await expect(page.locator('h1, h2').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toHaveCount(0)
  })
}

import asyncio
from playwright.async_api import async_playwright, Page, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        html_file_path = os.path.abspath('index.html')

        # --- Desktop Verification ---
        await page.set_viewport_size({"width": 1280, "height": 720})
        await page.goto(f'file://{html_file_path}')
        await expect(page.locator("#login-screen")).to_be_visible(timeout=10000)
        await page.screenshot(path="jules-scratch/verification/desktop_login.png")

        # Switch to an authenticated view
        await page.evaluate("showScreen('farmList')")
        await expect(page.locator("#farm-list-screen")).to_be_visible(timeout=5000)
        await page.screenshot(path="jules-scratch/verification/desktop_app.png")


        # --- Mobile/Tablet Verification ---
        await page.set_viewport_size({"width": 768, "height": 1024})
        await page.goto(f'file://{html_file_path}') # Reload to reset state
        await expect(page.locator("#login-screen")).to_be_visible(timeout=10000)
        await page.screenshot(path="jules-scratch/verification/tablet_login.png")

        # Switch to an authenticated view
        await page.evaluate("showScreen('farmList')")
        await expect(page.locator("#farm-list-screen")).to_be_visible(timeout=5000)
        await page.screenshot(path="jules-scratch/verification/tablet_app.png")

        await browser.close()
        print("Verification screenshots updated: desktop_login.png, desktop_app.png, tablet_login.png, tablet_app.png")

if __name__ == "__main__":
    asyncio.run(main())

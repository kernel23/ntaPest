import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # The file path needs to be absolute.
        # I'll construct the absolute path.
        import os
        path = os.path.abspath('index.html')
        await page.goto(f'file://{path}')

        # Wait for the login screen to be visible
        await page.wait_for_selector('#login-screen', state='visible')

        # Wait for the pest cards to be loaded
        await page.wait_for_selector('.pest-card', state='visible')

        # Hover over the first card
        await page.hover('.pest-card')

        # Click on the first card
        await page.click('.pest-card')

        # Wait for the modal to be visible
        await page.wait_for_selector('#pest-details-modal', state='visible')

        # Take a screenshot
        await page.screenshot(path='jules-scratch/verification/verification.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

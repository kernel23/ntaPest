import asyncio
from playwright.async_api import async_playwright, Page, expect
import os
import json

ROLES = ["Farmer", "Extension Worker", "Branch Coordinator", "Expert", "Administrator"]

async def test_role(page: Page, role: str):
    """Sets a user role, updates the UI, and takes a screenshot."""

    print(f"Testing role: {role}...")

    # Ensure we are on a screen where nav should be visible
    await page.evaluate("showScreen('farmList')")
    await expect(page.locator("#farm-list-screen")).to_be_visible(timeout=5000)

    # Create a fake profile object and pass it to the UI update function
    fake_profile = {"fullName": "Test User", "role": role}

    # Use page.evaluate to call the function with the profile as an argument
    await page.evaluate("profile => updateUIVisibilityBasedOnRole(profile)", fake_profile)

    await page.wait_for_timeout(500) # Allow time for rendering

    # Take a screenshot of just the bottom navigation bar for easy comparison
    filename = role.lower().replace(" ", "_")
    nav_element = page.locator("#bottom-nav")
    await nav_element.screenshot(path=f"jules-scratch/verification/mobile_nav_{filename}.png")
    print(f"  - Created screenshot: mobile_nav_{filename}.png")


async def main():
    """Main function to run the verification tests."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for console events and print them
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        # Set a consistent mobile viewport
        await page.set_viewport_size({"width": 375, "height": 812})

        html_file_path = os.path.abspath('index.html')

        for role in ROLES:
            # Reload the page for each role to ensure a clean state
            await page.goto(f'file://{html_file_path}')
            await expect(page.locator("#login-screen")).to_be_visible(timeout=10000)
            await test_role(page, role)

        await browser.close()
        print("\nVerification complete.")

if __name__ == "__main__":
    # Clean up old screenshots before running
    verification_dir = "jules-scratch/verification/"
    for item in os.listdir(verification_dir):
        if item.startswith("mobile_nav_") and item.endswith(".png"):
            os.remove(os.path.join(verification_dir, item))

    asyncio.run(main())

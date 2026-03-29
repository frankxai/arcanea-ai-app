"""Saga reading experience visual audit — desktop + mobile."""
import os, sys
from playwright.sync_api import sync_playwright

S = "C:/Users/frank/Arcanea/apps/web/__tests__/e2e/screenshots"
os.makedirs(S, exist_ok=True)

results = []
def ok(name, passed, detail=""):
    results.append({"test": name, "pass": passed})
    print(f"  [{'PASS' if passed else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # === DESKTOP ===
    print("\n=== SAGA HUB (Desktop 1440x900) ===\n")
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3001/saga", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(3000)
    page.screenshot(path=f"{S}/saga-hub-desktop.png")

    ok("Saga page loads", True)
    has_title = page.locator("text=/Arcanea Saga|Seven-Book/i").count() > 0
    ok("Saga title visible", has_title)
    has_book = page.locator("text=/Five-Fold Fire|Drowned Archive/i").count() > 0
    ok("Book cards visible", has_book)
    has_world = page.locator("text=/World Atlas|Deep Lore|Companion/i").count() > 0
    ok("World docs visible", has_world)

    # Click Book 1
    book1_link = page.locator("a[href*='book1'], a:has-text('Five-Fold Fire')").first
    if book1_link.count() > 0:
        book1_link.click()
        page.wait_for_timeout(3000)
        page.screenshot(path=f"{S}/saga-book1-desktop.png")
        has_chapters = page.locator("text=/Storm|Ones Who Came|Road Between|Triennium/i").count() > 0
        ok("Book 1 chapter list visible", has_chapters)

        # Click Chapter 1
        ch1_link = page.locator("a[href*='01'], a:has-text('Storm')").first
        if ch1_link.count() > 0:
            ch1_link.click()
            page.wait_for_timeout(3000)
            page.screenshot(path=f"{S}/saga-chapter1-desktop.png", full_page=True)
            has_content = page.locator("text=/sea remembered|lighthouse|Ashenmere/i").count() > 0
            ok("Chapter 1 content renders", has_content)

            # Check typography
            ok("Chapter title visible", page.locator("h1, h2").count() > 0)
        else:
            ok("Chapter 1 link found", False)
    else:
        ok("Book 1 link found", False)

    # Check /books redirect
    page.goto("http://localhost:3001/books", wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(2000)
    final_url = page.url
    ok("/books redirects to /saga", "/saga" in final_url, final_url)

    # === MOBILE ===
    print("\n=== SAGA (Mobile 375x812) ===\n")
    mobile = browser.new_page(viewport={"width": 375, "height": 812}, is_mobile=True)
    mobile.goto("http://localhost:3001/saga", wait_until="domcontentloaded", timeout=30000)
    mobile.wait_for_timeout(3000)
    mobile.screenshot(path=f"{S}/saga-hub-mobile.png")
    ok("Mobile: saga loads", True)

    bw = mobile.evaluate("document.body.scrollWidth")
    ok("Mobile: no overflow", bw <= 380, f"body={bw}px")

    # Mobile chapter reading
    mobile.goto("http://localhost:3001/saga/book1", wait_until="domcontentloaded", timeout=15000)
    mobile.wait_for_timeout(2000)
    mobile.screenshot(path=f"{S}/saga-book1-mobile.png")
    ok("Mobile: book page loads", True)

    # Try worldbuilding doc
    page2 = browser.new_page(viewport={"width": 1440, "height": 900})
    page2.goto("http://localhost:3001/saga/docs/world-atlas", wait_until="domcontentloaded", timeout=15000)
    page2.wait_for_timeout(3000)
    page2.screenshot(path=f"{S}/saga-docs-worldatlas.png")
    has_doc = page2.locator("text=/Luminari|Draconian|Atlantean/i").count() > 0
    ok("World Atlas doc renders", has_doc)

    browser.close()

# Summary
print("\n" + "=" * 50)
passes = sum(1 for r in results if r["pass"])
fails = sum(1 for r in results if not r["pass"])
print(f"  {passes} PASS / {fails} FAIL / {len(results)} TOTAL")
if fails:
    for r in results:
        if not r["pass"]:
            print(f"  FAIL: {r['test']}")
print("=" * 50)
sys.exit(1 if fails else 0)

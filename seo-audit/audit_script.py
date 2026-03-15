#!/usr/bin/env python3
"""Comprehensive Visual SEO Audit Script for lemnArt Store"""

import json
import os
from playwright.sync_api import sync_playwright

SCREENSHOTS_DIR = "/Users/cristian/Development/lemnArt/seo-audit/screenshots"
BASE_URL = "http://localhost:3002"

PAGES = [
    {"name": "homepage", "path": "/"},
    {"name": "contact", "path": "/contact"},
    {"name": "blog", "path": "/blog"},
    {"name": "cart", "path": "/cart"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1920, "height": 1080},
    {"name": "laptop", "width": 1366, "height": 768},
    {"name": "tablet", "width": 768, "height": 1024},
    {"name": "mobile", "width": 375, "height": 812},
]

def extract_seo_data(page):
    """Extract SEO-relevant data from the current page."""
    return page.evaluate("""() => {
        const result = {};

        // Title
        result.title = document.title || '';

        // Meta tags
        result.metaDescription = document.querySelector('meta[name="description"]')?.content || '';
        result.metaViewport = document.querySelector('meta[name="viewport"]')?.content || '';
        result.metaRobots = document.querySelector('meta[name="robots"]')?.content || '';
        result.canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || '';

        // Open Graph
        result.ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
        result.ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
        result.ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
        result.ogType = document.querySelector('meta[property="og:type"]')?.content || '';

        // Twitter Card
        result.twitterCard = document.querySelector('meta[name="twitter:card"]')?.content || '';
        result.twitterTitle = document.querySelector('meta[name="twitter:title"]')?.content || '';

        // Headings
        result.headings = {};
        for (let i = 1; i <= 6; i++) {
            const elems = document.querySelectorAll('h' + i);
            result.headings['h' + i] = Array.from(elems).map(el => ({
                text: el.innerText.trim().substring(0, 200),
                visible: el.offsetParent !== null,
                fontSize: window.getComputedStyle(el).fontSize,
                rect: el.getBoundingClientRect().toJSON()
            }));
        }

        // Images
        result.images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src?.substring(0, 200),
            alt: img.alt || '',
            hasAlt: img.hasAttribute('alt'),
            width: img.naturalWidth,
            height: img.naturalHeight,
            loading: img.loading || 'eager',
            isVisible: img.offsetParent !== null,
            rect: img.getBoundingClientRect().toJSON()
        }));

        // Videos
        result.videos = Array.from(document.querySelectorAll('video')).map(vid => ({
            src: vid.src || vid.querySelector('source')?.src || '',
            autoplay: vid.autoplay,
            muted: vid.muted,
            loop: vid.loop,
            preload: vid.preload,
            rect: vid.getBoundingClientRect().toJSON()
        }));

        // Links
        result.links = Array.from(document.querySelectorAll('a')).map(a => ({
            href: a.href || '',
            text: a.innerText?.trim().substring(0, 100),
            hasAriaLabel: a.hasAttribute('aria-label'),
            ariaLabel: a.getAttribute('aria-label') || '',
            target: a.target || '',
            rect: a.getBoundingClientRect().toJSON()
        }));

        // Buttons / CTAs
        result.buttons = Array.from(document.querySelectorAll('button, [role="button"], a.btn, a[class*="button"], a[class*="cta"]')).map(btn => ({
            text: btn.innerText?.trim().substring(0, 100),
            tag: btn.tagName,
            type: btn.type || '',
            hasAriaLabel: btn.hasAttribute('aria-label'),
            rect: btn.getBoundingClientRect().toJSON()
        }));

        // Font loading
        result.fontFaces = Array.from(document.fonts).map(f => ({
            family: f.family,
            status: f.status,
            weight: f.weight,
            style: f.style
        }));

        // Check for horizontal overflow (CLS risk)
        result.bodyWidth = document.body.scrollWidth;
        result.viewportWidth = window.innerWidth;
        result.hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;

        // Structured data
        result.structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
            try { return JSON.parse(s.textContent); } catch(e) { return null; }
        }).filter(Boolean);

        // Accessibility basics
        result.lang = document.documentElement.lang || '';
        result.hasSkipLink = !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link');

        // Body font size
        result.bodyFontSize = window.getComputedStyle(document.body).fontSize;

        // Background videos/iframes
        result.iframes = Array.from(document.querySelectorAll('iframe')).map(f => ({
            src: f.src || '',
            title: f.title || '',
            rect: f.getBoundingClientRect().toJSON()
        }));

        // Largest element above the fold (LCP candidate)
        const aboveFold = [];
        document.querySelectorAll('img, video, h1, h2, [class*="hero"], [class*="banner"]').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                aboveFold.push({
                    tag: el.tagName,
                    class: el.className?.toString().substring(0, 100),
                    area: r.width * r.height,
                    rect: r.toJSON()
                });
            }
        });
        result.aboveFoldElements = aboveFold.sort((a, b) => b.area - a.area).slice(0, 5);

        return result;
    }""")


def run_audit():
    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for page_info in PAGES:
            page_name = page_info["name"]
            url = BASE_URL + page_info["path"]
            results[page_name] = {"url": url, "viewports": {}}

            for vp in VIEWPORTS:
                vp_name = vp["name"]
                print(f"Auditing {page_name} at {vp_name} ({vp['width']}x{vp['height']})...")

                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=2 if vp_name == "mobile" else 1
                )
                page = context.new_page()

                try:
                    response = page.goto(url, wait_until="networkidle", timeout=30000)
                    status = response.status if response else "no response"

                    # Wait a moment for any animations/lazy loading
                    page.wait_for_timeout(2000)

                    # Above-the-fold screenshot
                    screenshot_path = os.path.join(SCREENSHOTS_DIR, f"{page_name}_{vp_name}.png")
                    page.screenshot(path=screenshot_path, full_page=False)

                    # Full-page screenshot
                    full_screenshot_path = os.path.join(SCREENSHOTS_DIR, f"{page_name}_{vp_name}_full.png")
                    page.screenshot(path=full_screenshot_path, full_page=True)

                    # Extract SEO data
                    seo_data = extract_seo_data(page)
                    seo_data["httpStatus"] = status

                    results[page_name]["viewports"][vp_name] = seo_data

                except Exception as e:
                    print(f"  Error: {e}")
                    results[page_name]["viewports"][vp_name] = {"error": str(e)}

                finally:
                    context.close()

        browser.close()

    # Save raw data
    output_path = os.path.join(SCREENSHOTS_DIR, "..", "audit_data.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2, default=str)

    print(f"\nAudit data saved to {output_path}")
    print(f"Screenshots saved to {SCREENSHOTS_DIR}/")
    return results


if __name__ == "__main__":
    run_audit()

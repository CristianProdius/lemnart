#!/usr/bin/env python3
"""Extract a condensed summary from the audit data for each page."""
import json

with open("/Users/cristian/Development/lemnArt/seo-audit/audit_data.json") as f:
    data = json.load(f)

for page_name, page_data in data.items():
    print(f"\n{'='*80}")
    print(f"PAGE: {page_name.upper()} ({page_data['url']})")
    print(f"{'='*80}")

    # Use desktop viewport as primary
    for vp_name in ["desktop", "mobile"]:
        vp = page_data["viewports"].get(vp_name, {})
        if "error" in vp:
            print(f"\n  [{vp_name}] ERROR: {vp['error']}")
            continue

        print(f"\n  --- {vp_name.upper()} VIEWPORT ---")
        print(f"  HTTP Status: {vp.get('httpStatus', 'N/A')}")
        print(f"  Title: {vp.get('title', 'MISSING')}")
        print(f"  Meta Description: {vp.get('metaDescription', 'MISSING')[:100]}")
        print(f"  Meta Viewport: {vp.get('metaViewport', 'MISSING')}")
        print(f"  Canonical URL: {vp.get('canonicalUrl', 'MISSING') or 'NOT SET'}")
        print(f"  OG Title: {vp.get('ogTitle', '') or 'NOT SET'}")
        print(f"  OG Description: {vp.get('ogDescription', '') or 'NOT SET'}")
        print(f"  OG Image: {vp.get('ogImage', '') or 'NOT SET'}")
        print(f"  Twitter Card: {vp.get('twitterCard', '') or 'NOT SET'}")
        print(f"  Lang attribute: {vp.get('lang', '') or 'NOT SET'}")
        print(f"  Body font size: {vp.get('bodyFontSize', 'N/A')}")
        print(f"  Has horizontal scroll: {vp.get('hasHorizontalScroll', 'N/A')}")
        print(f"  Body width vs viewport: {vp.get('bodyWidth', '?')} vs {vp.get('viewportWidth', '?')}")
        print(f"  Structured data: {len(vp.get('structuredData', []))} items")
        print(f"  Has skip link: {vp.get('hasSkipLink', False)}")

        # Headings
        headings = vp.get("headings", {})
        print(f"\n  HEADINGS:")
        for level in ["h1", "h2", "h3"]:
            items = headings.get(level, [])
            print(f"    {level}: {len(items)} found")
            for h in items[:5]:
                above_fold = h.get("rect", {}).get("top", 9999) < (812 if vp_name == "mobile" else 1080)
                print(f"      - \"{h['text'][:60]}\" (size: {h['fontSize']}, above fold: {above_fold})")

        # Images
        images = vp.get("images", [])
        imgs_no_alt = [i for i in images if not i.get("alt")]
        imgs_no_attr = [i for i in images if not i.get("hasAlt")]
        print(f"\n  IMAGES: {len(images)} total, {len(imgs_no_alt)} missing alt text, {len(imgs_no_attr)} missing alt attribute")
        for img in images[:5]:
            print(f"    - alt=\"{img.get('alt', '')[:40]}\" loading={img.get('loading')} visible={img.get('isVisible')}")

        # Videos
        videos = vp.get("videos", [])
        print(f"\n  VIDEOS: {len(videos)} total")
        for vid in videos:
            print(f"    - autoplay={vid.get('autoplay')} muted={vid.get('muted')} preload={vid.get('preload')}")

        # Buttons/CTAs
        buttons = vp.get("buttons", [])
        print(f"\n  BUTTONS/CTAs: {len(buttons)} total")
        for btn in buttons[:8]:
            r = btn.get("rect", {})
            above = r.get("top", 9999) < (812 if vp_name == "mobile" else 1080)
            w = r.get("width", 0)
            h = r.get("height", 0)
            print(f"    - \"{btn.get('text', '')[:40]}\" ({w:.0f}x{h:.0f}px, above fold: {above})")

        # Fonts
        fonts = vp.get("fontFaces", [])
        loaded = [f for f in fonts if f.get("status") == "loaded"]
        print(f"\n  FONTS: {len(fonts)} total, {len(loaded)} loaded")
        families = set(f.get("family", "") for f in fonts)
        for fam in families:
            statuses = [f.get("status") for f in fonts if f.get("family") == fam]
            print(f"    - {fam}: {', '.join(set(statuses))}")

        # Above fold elements (LCP candidates)
        atf = vp.get("aboveFoldElements", [])
        print(f"\n  LCP CANDIDATES (above fold):")
        for el in atf[:3]:
            print(f"    - {el.get('tag')} class=\"{el.get('class', '')[:60]}\" area={el.get('area', 0):.0f}px2")

        # Links
        links = vp.get("links", [])
        links_no_text = [l for l in links if not l.get("text") and not l.get("hasAriaLabel")]
        print(f"\n  LINKS: {len(links)} total, {len(links_no_text)} without text or aria-label")

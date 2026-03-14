# AI Video Generation Prompts — Hero Background for LemnArt

## Context
Need an ambient, atmospheric looping background video for the LemnArt hero section. The video must work as a **background** — dark, slow, textural — not a product showcase. White text and CTAs will be layered on top, so the video must stay subtle and non-distracting.

## Research Summary
Based on Runway Gen-4 official docs, Kling 3.0 guides, Sora 2 cookbook, and professional AI filmmakers:
- **Under 120 words** performs best across all platforms
- **Describe motion, not just visuals** — the image input handles composition
- **Use cinematography language** — camera type, lens, movement
- **One focal point** — don't overcrowd the scene
- **Continuous motion** (light, particles, shadows) loops better than discrete events
- **Negative prompts** are critical for quality control

---

## Prompt Option 1 — Macro Texture with Light Play
**Best for: Runway Gen-4 with your radiator cover photo as input image**

> Extreme close-up macro shot. Camera holds nearly still with an imperceptible slow drift to the right. Warm golden light gradually sweeps across the carved wooden lattice surface, revealing deep grain texture and casting long geometric shadows that slowly stretch and rotate. Fine dust particles float through a single shaft of light. Shallow depth of field — only the nearest carved edge is sharp, everything behind dissolves into a rich dark amber bokeh. Shot on 100mm macro lens, f/1.4, 24fps. Dark cinematic grade, shadows crush to near-black. Continuous seamless loop.

**Negative prompt:** bright, overexposed, flat lighting, fast movement, camera shake, text, watermark, people, hands, blurry, low quality, compression artifacts, cluttered composition

---

## Prompt Option 2 — Atmospheric Workshop
**Best for: Kling 3.0 or Minimax (text-to-video, no image input needed)**

> Interior of a dim artisan woodworking workshop at golden hour. A single beam of warm amber sunlight cuts diagonally through dusty air, illuminating floating sawdust particles that drift in slow motion. In the background, blurred wooden radiator covers lean against a dark stone wall, their lattice patterns catching fragments of light. Camera holds completely static on a tripod. Shallow depth of field, anamorphic lens flare, everything beyond 2 meters is soft bokeh. Muted earth tones — deep walnut, charcoal, aged brass. The only motion is the drifting particles and the subtle shift of natural light. Moody, contemplative, editorial feel.

**Negative prompt:** bright colors, fast motion, camera movement, people, hands, text overlay, watermark, shaky footage, harsh shadows, overly vibrant colors, artificial lighting, motion blur, low resolution

---

## Prompt Option 3 — Abstract Light Through Lattice
**Best for: Runway Gen-4 / Sora 2 with radiator cover photo as input**

> Tight shot of warm light slowly filtering through geometric wooden lattice patterns. The light source moves almost imperceptibly from left to right, creating evolving shadow patterns on a smooth dark surface below. Each carved opening projects a sharp geometric light shape that gradually transforms as the light angle shifts. Rich wood texture in deep walnut tones, visible grain under soft directional lighting. No recognizable objects — pure interplay of light, shadow, and carved wood geometry. Shot on Arri Alexa, 50mm prime, f/2.0, muted color science. Near-still camera, breathing atmosphere. Seamless 4-second loop.

**Negative prompt:** overexposed, flat, fast movement, camera shake, people, text, watermark, blurry, pixelated, bright colors, cluttered, multiple subjects, artificial look

---

## Prompt Option 4 — Elegant Interior Vignette (Wider Shot)
**Best for: Kling 3.0 / Sora 2 (text-to-video)**

> Slow cinematic push-in, barely perceptible, toward a handcrafted wooden radiator cover mounted flush against a dark wall in a minimalist interior. The cover is a wide horizontal panel fixed to the wall at knee height, enclosing the radiator beneath it, with intricate geometric lattice openings in rich walnut wood that allow warm air to pass through. Soft warm light from an unseen window to the left creates a single long diagonal highlight across the carved surface. The rest of the room falls into deep shadow. A wisp of warm air distortion rises subtly from behind the lattice. Dust motes drift through the light beam in extreme slow motion. Anamorphic bokeh, film grain, muted palette of deep browns, charcoal, and warm cream. Editorial interior design mood, Architectural Digest aesthetic. 4-second seamless loop.

**Negative prompt:** bright room, overlit, multiple light sources, fast camera, shaky, people, text, watermark, vibrant colors, cartoon, artificial, low quality, motion blur, compression artifacts

---

## Tips for Best Results

1. **Always attach your radiator cover photo** as the reference/input image (Runway, Kling image-to-video)
2. **Generate 4-second clips** — they loop more seamlessly than longer ones
3. **Set motion/movement slider to 2-3 out of 10** — you want barely-there movement
4. **Generate 3-4 variations** and pick the moodiest/darkest one
5. **Post-process**: slightly darken the final video in any editor (bring down highlights 10-15%) to ensure text readability
6. **Compress to MP4** at 1080p for web — 4K is unnecessary for a background video
7. If the first result is too bright, add "dark, underexposed, low-key lighting" to the prompt
8. If using **Runway Gen-4 with image input**: your prompt should focus on **motion only** — the image already defines the look
   - Simplified motion-only prompt: *"Near-still camera. Warm light slowly sweeps left to right across the surface. Fine dust particles drift through a single light beam. Shallow depth of field. Seamless loop."*

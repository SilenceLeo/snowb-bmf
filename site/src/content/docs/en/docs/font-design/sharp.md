---
title: Controlling Font Sharpness and Anti-Aliasing
description: Master the edge rendering of your bitmap fonts. Adjust sharpness to control anti-aliasing, from perfectly smooth (0%) to crisp and pixel-perfect (100%).
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Controlling Font Sharpness and Anti-Aliasing"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Master the edge rendering of your bitmap fonts. Adjust sharpness to control anti-aliasing, from perfectly smooth (0%) to crisp and pixel-perfect (100%)."
  "about":
    "@type": "Thing"
    "name": "Sharp Feature"
    "description": "Anti-aliasing and edge rendering control for bitmap font generation"
    "featureList":
      - "0-100% sharpness control"
      - "Full anti-aliasing at 0% sharpness"
      - "Pixel-perfect rendering at 100% sharpness"
      - "Real-time visual feedback"
      - "Optimized for retro and modern font styles"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "keywords": ["bitmap font", "anti-aliasing", "font sharpness", "pixel art", "vector rendering", "font design", "game development"]
  "articleSection": "Font Design"
  "audience":
    "@type": "Audience"
    "audienceType": ["Game Developers", "Font Designers", "UI/UX Designers"]
  "teaches": ["Font anti-aliasing control", "Bitmap font edge rendering", "Sharp feature usage"]
  "inLanguage": "en"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Control Font Sharpness in SnowB BMF"
    "description": "Step-by-step guide to adjusting font sharpness for optimal bitmap font rendering"
    "step":
      - "@type": "HowToStep"
        "name": "Select sharpening percentage"
        "text": "Open the Font Config panel and adjust the Sharp slider to set the desired sharpening percentage (0-100%)"
      - "@type": "HowToStep"
        "name": "Preview in real-time"
        "text": "Observe the real-time preview in the workspace to see how the sharpness setting affects your font glyphs"
      - "@type": "HowToStep"
        "name": "Fine-tune based on target size"
        "text": "Adjust the sharpness value based on your target display size — higher values for small pixel-art fonts, lower values for large smooth fonts"
---

The **Sharpness** setting controls anti-aliasing and edge rendering of your font glyphs, on a scale from 0% to 100%:

-   **0% Sharpness** means full anti-aliasing, giving you the smoothest possible edges. Best for clean, modern text at larger sizes.
-   **100% Sharpness** means no anti-aliasing, producing crisp, pixelated edges. Good for retro games, pixel art, or small text that needs to be readable.

## Visual Comparison

The difference is visible up close: 0% creates a gradient of pixels to smooth edges, while 100% uses a hard on/off transition.

| 0% Sharpness (Smooth)                                  | 100% Sharpness (Crisp)                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| ![Example of a font with 0% sharpness](~/assets/sharp-0.png) | ![Example of a font with 100% sharpness](~/assets/sharp-100.png) |

## Choosing the Right Sharpness

-   **Smooth, professional look:** Low values (0-25%) work best for larger text where smooth curves matter.
-   **Pixel-art or retro style:** High values (75-100%) produce crisp, blocky edges aligned to the pixel grid.
-   **Balanced approach:** Mid-range values retain edge definition without heavy pixelation.

## Important Notes

-   Only available when a font file is loaded.
-   Higher sharpness produces smaller texture files (fewer semi-transparent pixels to store).
-   Lower sharpness improves readability for complex characters at large scales.

## Related Topics

- [Font Import](/en/docs/font-design/font-import/)
- [Font Size](/en/docs/font-design/font-size/)
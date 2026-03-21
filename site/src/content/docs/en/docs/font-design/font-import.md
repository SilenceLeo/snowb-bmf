---
title: "Font Import: Load TTF, OTF, WOFF, and TTC Files"
description: "Import TTF, OTF, WOFF, and TTC fonts into SnowB BMF. Learn the font fallback system, fontkit vector rendering, and Sharp feature for pixel-perfect bitmap fonts."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Font Import Guide for SnowB BMF - Complete Documentation"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "A comprehensive guide to importing fonts in SnowB BMF. Learn about supported formats (TTF, OTF, WOFF, TTC), the font fallback system, vector rendering with fontkit, and the Sharp feature for pixel-perfect results."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "Browser-based bitmap font generator"
    "url": "https://snowb.org"
  "keywords": ["font import", "TTF", "OTF", "WOFF", "TTC", "TrueType Collection", "fontkit", "vector rendering", "font fallback", "Sharp feature", "bitmap font", "SnowB BMF", "font design"]
  "articleSection": "Font Design"
  "audience":
    "@type": "Audience"
    "audienceType": "Developers and Font Designers"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Import Fonts in SnowB BMF"
    "description": "Step-by-step guide for importing fonts into SnowB BMF bitmap font generator"
    "supply":
      - "@type": "HowToSupply"
        "name": "Font files (TTF, OTF, WOFF, or TTC format)"
    "tool":
      - "@type": "HowToTool"
        "name": "SnowB BMF Font Generator"
        "url": "https://snowb.org"
    "step":
      - "@type": "HowToStep"
        "name": "Choose font format"
        "text": "Select from supported formats: TTF (recommended), OTF, WOFF, or TTC"
      - "@type": "HowToStep"
        "name": "Import primary font"
        "text": "Use the 'Add Font File' button to import your primary font for vector rendering"
      - "@type": "HowToStep"
        "name": "Select fonts from TTC (if applicable)"
        "text": "When importing a TTC file, a dialog appears listing all fonts in the collection. Check the fonts you need and click Load to import them."
      - "@type": "HowToStep"
        "name": "Set up font fallback"
        "text": "Import additional fonts to create a fallback chain for complete character coverage"
      - "@type": "HowToStep"
        "name": "Configure Sharp feature"
        "text": "Adjust the Sharp setting (recommended 80%) for pixel-perfect clarity"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/font-import/"
  "inLanguage": "en"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
---

Import custom font files to control exactly how your bitmap glyphs render. SnowB BMF supports two rendering modes: vector and canvas, each with different trade-offs.

## Supported Font Formats

SnowB BMF accepts the following standard font formats:

- **TTF** (TrueType Font) - Recommended for broad compatibility.
- **OTF** (OpenType Font) - Fully supported.
- **WOFF** (Web Open Font Format) - Good for compressed web fonts.
- **TTC** (TrueType Collection) - Contains multiple fonts in one file. When you import a TTC, SnowB BMF detects it and opens a selection dialog where you choose which fonts to load.

### Importing TTC Files

TTC (TrueType Collection) files bundle multiple related fonts (different weights or styles of a typeface) into a single file. SnowB BMF supports TTC files with a selection workflow:

1. When you import a `.ttc` file, the application recognizes the collection format automatically.
2. A dialog appears listing every font in the collection. Each entry shows the full name (e.g., "Arial Bold"), font family (e.g., "Arial"), and subfamily/weight (e.g., "Bold").
3. Use checkboxes to select one or more fonts from the collection.
4. Each selected font is added to the font list independently, so you can use them separately or combine them in a fallback chain.

## How the Font Fallback System Works

SnowB BMF uses a multi-font fallback chain to ensure complete character coverage. When generating glyphs, the application searches for each character in import order:

1.  **Primary Font** (the first font you import) - Used for the majority of characters.
2.  **Secondary & Additional Fonts** - If a character isn't found in the primary font, the application searches the next font in the list, and so on.
3.  **System Font** (final fallback) - If a character is not found in any imported fonts, the browser's default system font is used as a last resort.

For example, combine a primary Latin font with a secondary CJK font to cover both character sets in a single bitmap font.

## Font Rendering Modes

### Vector Rendering (Recommended)

When you import a font using the **"Add Font File"** button, the application parses the font's outline data directly using the [fontkit](https://github.com/foliojs/fontkit) library.

Fontkit provides broad format compatibility, built-in TTC support, and solid variable font handling.

Vector rendering gives you:
- High-precision glyphs rendered directly from the font's outline data.
- The "Sharp" snap-to-grid feature for improved glyph clarity.
- Accurate baselines and measurements extracted from font metadata.
- Automatic font fallback when characters are missing.
- Kerning pair support for proper text spacing.

### Canvas Rendering (Basic Fallback)

If a font cannot be parsed as a vector file, the application defaults to the browser's standard canvas text rendering (`measureText()` and `fillText()`).

Canvas rendering has some limitations:
- The Sharp slider is disabled because there is no vector data to manipulate.
- Rendering results vary between browsers.
- Text measurement relies on less-accurate browser APIs.

## The "Sharp" Feature: Achieving Pixel-Perfect Clarity

The **Sharp** feature uses a snap-to-grid algorithm to improve glyph clarity, especially at small sizes.

### How It Works

The Sharp feature adjusts the vector paths of each glyph to align them with the pixel grid.

- Snap strength is controlled by a percentage (0-100%).
- Vector coordinates are rounded to the nearest pixel boundary.
- Control points are adjusted to produce cleaner curves and lines.
- Anti-aliasing artifacts are reduced, producing crisper text at small font sizes.

### Recommended Settings

- **0%**: No snapping. The original, unaltered glyph shape.
- **50%**: Moderate snapping, offering a good balance between smoothness and clarity.
- **80%**: The default setting, ideal for most use cases.
- **100%**: Maximum snapping for a perfectly aligned, pixel-art aesthetic.

**Note**: The Sharp feature is exclusively available for imported vector fonts.

## Best Practices

1.  **Always Import Fonts**: Use the "Add Font File" feature for maximum quality and control.
2.  **Plan Your Fallback Chain**: Import your primary font first, then supplementary fonts for additional character sets.
3.  **Use TTC Files for Font Families**: Import once and select only the weights/styles you need.
4.  **Start with 80% Sharp**: Adjust based on your target font size and display resolution.
5.  **Test Character Coverage**: Verify your font combination covers all required characters (Latin, CJK, symbols, etc.).
6.  **Preview at Target Size**: Sharp effects are most visible at the intended final resolution.

## Troubleshooting

**Why is the "Sharp" slider disabled?**
- This happens when you are not using an imported vector font. Make sure you have added a font via the "Add Font File" button.

**Why does my font appear blurry?**
- Try increasing the "Sharp" percentage for crisper edges. Also, ensure your preview size matches the final display resolution.

**Why are some characters missing?**
- The imported font may not include those specific Unicode characters. Add another font with the missing characters to the fallback chain.

**Why did my font import fail?**
- Double-check that the file is a supported format (TTF, OTF, WOFF, or TTC) and that the file is not corrupted.

**I imported a TTC file but nothing happened?**
- Ensure you selected at least one font in the selection dialog before clicking "Load". If the dialog did not appear, the file may not be a valid TTC collection.

## Related Topics

- [Sharp Rendering](/en/docs/font-design/sharp/)
- [Character Sets](/en/docs/font-design/character-sets/)
- [SDF Rendering](/en/docs/font-design/sdf-rendering/)

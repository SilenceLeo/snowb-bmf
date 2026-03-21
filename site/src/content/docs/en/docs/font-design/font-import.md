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

Importing custom fonts is a core feature for creating high-quality bitmap fonts. SnowB BMF provides powerful options for loading external font files, giving you precise control over glyph rendering. The application offers two rendering modes, with distinct advantages depending on how you load your fonts.

## Supported Font Formats

You can import a wide range of standard font formats, ensuring you can work with almost any font file you have.

- **TTF** (TrueType Font) - Recommended for its excellent compatibility.
- **OTF** (OpenType Font) - Fully supported with all features.
- **WOFF** (Web Open Font Format) - Ideal for compressed web fonts.
- **TTC** (TrueType Collection) - A collection file containing multiple fonts bundled together. When you import a TTC file, SnowB BMF automatically detects it and opens a selection dialog where you can choose which fonts to load.

### Importing TTC Files

TTC (TrueType Collection) files bundle multiple related fonts — such as different weights or styles of a typeface — into a single file. SnowB BMF provides built-in support for TTC files with an intuitive selection workflow:

1. **Automatic Detection**: When you import a `.ttc` file, the application automatically recognizes the collection format.
2. **Font Selection Dialog**: A dialog appears listing every font in the collection. Each entry displays:
   - **Full Name** — the complete font name (e.g., "Arial Bold").
   - **Font Family** — the typeface family (e.g., "Arial").
   - **Font Subfamily** — the specific style or weight (e.g., "Bold").
3. **Multi-Select Support**: Use checkboxes to select one or more fonts from the collection.
4. **Independent Loading**: Each selected font is added to the font list independently, allowing you to use them separately or combine them in a fallback chain.

## How the Font Fallback System Works

SnowB BMF features a robust multi-font fallback chain. This allows you to combine several fonts to ensure complete character coverage. When generating glyphs, the application searches for each character in the order the fonts were imported:

1.  **Primary Font** (the first font you import) - Used for the majority of characters.
2.  **Secondary & Additional Fonts** - If a character isn't found in the primary font, the application searches the next font in the list, and so on.
3.  **System Font** (final fallback) - If a character is not found in any imported fonts, the browser's default system font is used as a last resort.

This system is perfect for projects requiring broad language support. For example, you can combine a primary English (Latin) font with a secondary Chinese (CJK) font to cover both character sets in a single bitmap font.

## Font Rendering Modes

### Vector Rendering (Recommended)

When you import a font using the **"Add Font File"** button, the application uses vector rendering. This advanced method parses the font's outline data directly using the powerful [fontkit](https://github.com/foliojs/fontkit) library.

**Why fontkit?** Compared to previous font parsing solutions, fontkit offers broader format compatibility, built-in TTC/TrueType Collection support, and better handling of variable fonts — making it the ideal choice for a bitmap font generator that needs to work with a wide variety of font files.

**Key Advantages of Vector Rendering:**
- **High-Precision Glyphs**: Renders directly from the font's vector data for maximum accuracy.
- **"Sharp" Feature**: Enables the unique snap-to-grid feature to enhance glyph clarity.
- **Accurate Metrics**: Extracts precise font baselines and measurements directly from the font's metadata.
- **Seamless Font Fallback**: Automatically switches between fonts when characters are missing.
- **Advanced Typography**: Preserves and utilizes kerning pairs for professional-grade text spacing.

### Canvas Rendering (Basic Fallback)

If a font cannot be parsed as a vector file, the application defaults to the browser's standard canvas text rendering (`measureText()` and `fillText()`).

**Limitations of Canvas Rendering:**
- **No "Sharp" Feature**: The Sharp slider is disabled as there is no vector data to manipulate.
- **Browser-Dependent**: Rendering results can vary between different web browsers.
- **Limited Precision**: Relies on the browser's less-accurate text measurement APIs.

## The "Sharp" Feature: Achieving Pixel-Perfect Clarity

The **Sharp** feature is a key advantage of vector rendering, implementing a snap-to-grid algorithm that significantly enhances glyph clarity, especially at small sizes.

### How It Works

The Sharp feature intelligently adjusts the vector paths of each glyph to align them with the pixel grid.

- **Snap Strength**: Controlled by a percentage (0-100%).
- **Grid Alignment**: Rounds vector coordinates to the nearest pixel boundary.
- **Path Optimization**: Adjusts control points to create cleaner curves and lines.
- **Clarity Enhancement**: Reduces anti-aliasing artifacts, resulting in crisper text at small font sizes.

### Recommended Settings

- **0%**: No snapping. The original, unaltered glyph shape.
- **50%**: Moderate snapping, offering a good balance between smoothness and clarity.
- **80%**: The default setting, ideal for most use cases.
- **100%**: Maximum snapping for a perfectly aligned, pixel-art aesthetic.

**Note**: The Sharp feature is exclusively available for imported vector fonts.

## Best Practices

1.  **Always Import Fonts**: For maximum quality and control, always use the "Add Font File" feature.
2.  **Plan Your Fallback Chain**: Import your primary font first, followed by supplementary fonts for additional character sets.
3.  **Use TTC Files for Font Families**: If you have a TTC file containing an entire typeface family, import it once and select only the weights/styles you need.
4.  **Start with 80% Sharp**: This is a great starting point. Adjust as needed based on your target font size and display resolution.
5.  **Test Character Coverage**: Ensure your font combination covers all required characters (e.g., Latin, CJK, symbols).
6.  **Preview at Target Size**: The effect of the Sharp setting is most apparent at the intended final resolution.

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

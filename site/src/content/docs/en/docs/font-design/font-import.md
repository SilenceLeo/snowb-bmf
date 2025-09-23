---
title: Font Import
description: A comprehensive guide to importing fonts in SnowB BMF. Learn about supported formats (TTF, OTF, WOFF), the font fallback system, vector rendering, and the Sharp feature for pixel-perfect results.
---

Importing custom fonts is a core feature for creating high-quality bitmap fonts. SnowB BMF provides powerful options for loading external font files, giving you precise control over glyph rendering. The application offers two rendering modes, with distinct advantages depending on how you load your fonts.

## Supported Font Formats

You can import a wide range of standard font formats, ensuring you can work with almost any font file you have.

- **TTF** (TrueType Font) - Recommended for its excellent compatibility.
- **OTF** (OpenType Font) - Fully supported with all features.
- **WOFF** (Web Open Font Format) - Ideal for compressed web fonts.

## How the Font Fallback System Works

SnowB BMF features a robust multi-font fallback chain. This allows you to combine several fonts to ensure complete character coverage. When generating glyphs, the application searches for each character in the order the fonts were imported:

1.  **Primary Font** (the first font you import) - Used for the majority of characters.
2.  **Secondary & Additional Fonts** - If a character isn't found in the primary font, the application searches the next font in the list, and so on.
3.  **System Font** (final fallback) - If a character is not found in any imported fonts, the browser's default system font is used as a last resort.

This system is perfect for projects requiring broad language support. For example, you can combine a primary English (Latin) font with a secondary Chinese (CJK) font to cover both character sets in a single bitmap font.

## Font Rendering Modes

### Vector Rendering (Recommended)

When you import a font using the **"Add Font File"** button, the application uses vector rendering. This advanced method parses the font's outline data directly using the powerful [opentype.js](https://github.com/opentypejs/opentype.js) library.

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
3.  **Start with 80% Sharp**: This is a great starting point. Adjust as needed based on your target font size and display resolution.
4.  **Test Character Coverage**: Ensure your font combination covers all required characters (e.g., Latin, CJK, symbols).
5.  **Preview at Target Size**: The effect of the Sharp setting is most apparent at the intended final resolution.

## Troubleshooting

**Why is the "Sharp" slider disabled?**
- This happens when you are not using an imported vector font. Make sure you have added a font via the "Add Font File" button.

**Why does my font appear blurry?**
- Try increasing the "Sharp" percentage for crisper edges. Also, ensure your preview size matches the final display resolution.

**Why are some characters missing?**
- The imported font may not include those specific Unicode characters. Add another font with the missing characters to the fallback chain.

**Why did my font import fail?**
- Double-check that the file is a supported format (TTF, OTF, or WOFF) and that the file is not corrupted.

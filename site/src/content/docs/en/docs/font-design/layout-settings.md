---
title: "Layout Settings: Padding, Spacing, and Page Configuration"
description: Configure bitmap font layout with spacing, padding, and alignment options for optimal texture atlas generation.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Layout Settings for Bitmap Font Design"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Configure bitmap font layout with spacing, padding, and alignment options for optimal texture atlas generation in SnowB BMF."
  "keywords": ["bitmap font layout", "texture atlas", "font padding", "glyph spacing", "font design", "texture packing", "game development", "font configuration"]
  "about":
    "@type": "Thing"
    "name": "Layout Settings"
    "description": "Configuration options for arranging glyphs in bitmap font texture atlases"
  "mainEntity":
    "@type": "HowTo"
    "name": "Configure Bitmap Font Layout Settings"
    "description": "Step-by-step guide to configuring padding, spacing, and page settings for optimal bitmap font generation"
    "step":
      - "@type": "HowToStep"
        "name": "Configure Padding"
        "text": "Set appropriate padding values (1-4 pixels) to prevent glyph bleeding and improve scaling quality"
      - "@type": "HowToStep"
        "name": "Adjust Spacing"
        "text": "Define spacing between glyphs (1-2 pixels) for efficient texture atlas packing"
      - "@type": "HowToStep"
        "name": "Manage Pages"
        "text": "Allow automatic page distribution for large character sets or texture size constraints"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "inLanguage": "en"
  "audience":
    "@type": "Audience"
    "audienceType": "Game Developers, Font Designers, Technical Artists"
---

Layout settings control how glyphs are arranged in the texture atlas. These parameters affect output quality, file size, and runtime performance.

## Overview

Three settings govern glyph arrangement:

- **Padding**: Extra space around each glyph to prevent rendering artifacts like color bleeding.
- **Spacing**: Gap between adjacent glyphs in the atlas for efficient packing.
- **Pages**: Number of texture atlas images generated (managed automatically).

## Padding

**Default**: 1 pixel

Padding adds a transparent border around each glyph in the texture atlas, preventing visual artifacts when fonts are scaled or filtered.

### Key Benefits
- **Prevents Bleeding**: Stops adjacent glyph colors from mixing during texture sampling.
- **Improves Scaling**: Ensures clean rendering when fonts are scaled up or down.
- **Supports Filtering**: Provides buffer space for bilinear or trilinear texture filtering.

### Recommendations
- **Standard**: 1-2 pixels suffices for most cases.
- **High-DPI/Retina**: 2-4 pixels for crisp rendering.
- **Heavy Scaling**: Increase padding if the font will be scaled significantly.
- **Memory**: Higher padding increases texture size.

### Example
```
Padding = 0: Glyphs may bleed into each other.
Padding = 1: Standard safety margin for most projects.
Padding = 2: Extra buffer for high-quality rendering.
```

## Spacing

**Default**: 1 pixel

Spacing defines the gap between bounding boxes of adjacent glyphs in the texture atlas.

### Purpose
- **Packing Efficiency**: Consistent gaps help the packing algorithm place glyphs more effectively.
- **Debugging**: Makes individual glyphs easier to identify visually in the atlas.

### Spacing vs. Padding

Padding and Spacing work together to separate glyphs:
- **Padding** is part of the glyph's own allocated space.
- **Spacing** is the gap *between* the allocated spaces of two glyphs.
- **Total Separation** = (Glyph 1 Padding) + Spacing + (Glyph 2 Padding)

### Recommendations
- **Standard**: 1-2 pixels works well for most fonts.
- **Dense Packing**: Use 0-1 pixels to minimize texture atlas size, but watch for artifacts.
- **Debugging**: Use larger values (e.g., 4-8 pixels) to clearly see glyph boundaries.

## Pages

**Default**: 1 page

Determines the number of texture atlas images generated. Glyphs that don't fit on a single texture are automatically distributed across multiple pages.

### When are multiple pages used?
- **Large Character Sets**: Fonts with thousands of glyphs (e.g., full CJK support).
- **Texture Size Limits**: Staying within hardware limits (e.g., 4096x4096 pixels).

The system manages page creation automatically to maximize texture space usage.

### Considerations
- **Performance**: Each additional page adds a texture-switching cost during rendering.
- **Single Page**: Most Latin-based fonts fit on a single 512x512 or 1024x1024 texture.

## Impact on Exported Files

Layout settings affect the exported font file (e.g., `.fnt`) directly:

- **Padding**: Written into the font descriptor (e.g., the `padding` attribute in BMFont's `info` block).
- **Spacing**: Affects x/y position and offset of each character in the atlas.
- **Pages**: Determines how many texture files the descriptor references.

## Best Practices

### General
1.  **Start with Defaults**: 1px padding and 1px spacing, then adjust as needed.
2.  **Test at Target Size**: Check how the font looks at its intended rendering size.
3.  **Plan for Scaling**: If the font will be scaled at runtime, add more padding.
4.  **Monitor Texture Size**: Balance visual quality with memory constraints.

### Platform-Specific
- **Desktop**: 2px padding, 1px spacing is a good starting point.
- **Mobile**: 1px padding, 1px spacing to conserve memory.
- **High-DPI**: Consider increasing padding to 2px or more for sharper results.

## Troubleshooting

- **Glyph Bleeding/Artifacts**: Increase **Padding**.
- **Texture Atlas Too Large**: Reduce font size, reduce character set, or allow more **Pages**.
- **Inefficient Glyph Packing**: Adjust **Spacing**.
- **Slow Rendering with Many Glyphs**: This might be due to too many **Pages**. Try to fit glyphs into fewer textures if possible.

## Related Topics

- [Texture Packing](/en/docs/font-design/texture-packing/)
- [Font Size](/en/docs/font-design/font-size/)

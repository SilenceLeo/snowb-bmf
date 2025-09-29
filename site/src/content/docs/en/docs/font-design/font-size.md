---
title: Configuring Font Size
description: Learn how to set the font size for your bitmap font and understand its impact on glyph quality, texture size, and performance.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Configuring Font Size in SnowB BMF - Bitmap Font Generator"
  "description": "Learn how to set the font size for your bitmap font and understand its impact on glyph quality, texture size, and performance in SnowB BMF."
  "about":
    "@type": "SoftwareFeature"
    "name": "Font Size Configuration"
    "description": "Font size setting that defines the rendering resolution of glyphs in pixels for bitmap font generation"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Configure Font Size in SnowB BMF"
    "description": "Step-by-step guide to setting font size for optimal bitmap font quality and performance"
    "step":
      - "@type": "HowToStep"
        "name": "Access Font Configuration"
        "text": "Open the Font Configuration panel in SnowB BMF"
      - "@type": "HowToStep"
        "name": "Set Font Size"
        "text": "Configure font size in pixels (default: 72px, range: 1px and up)"
      - "@type": "HowToStep"
        "name": "Consider Quality vs Performance"
        "text": "Balance glyph quality with texture atlas size and memory usage"
  "keywords": ["bitmap font", "font size", "font configuration", "glyph quality", "texture atlas", "font design", "SnowB BMF", "game development"]
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "inLanguage": "en"
  "audience":
    "@type": "Audience"
    "audienceType": ["game developers", "font designers", "UI developers"]
---

Font size is a critical setting in your bitmap font project. It defines the rendering resolution of your glyphs in pixels and directly influences visual quality, texture atlas dimensions, and memory usage.

## How to Set Font Size

You can configure the font size in the Font Configuration panel.

- **Unit**: Pixels (px)
- **Default Value**: 72px
- **Range**: 1px and up

## The Impact of Font Size

Choosing the right font size is a balance between quality and performance.

### Glyph Quality

- **Larger Size**: Renders high-resolution glyphs with crisp details and smooth edges.
- **Smaller Size**: Produces more compact glyphs, but may result in pixelation or loss of detail.

### Texture Atlas Size

Font size is directly proportional to the final texture atlas size.

- **Larger Fonts**: Generate bigger textures, leading to increased memory consumption.
- **Smaller Fonts**: Create smaller, more memory-efficient textures.

Always be mindful of the texture size limitations of your target game engine or device.

### Automatic Baseline Recalculation

Changing the font size automatically triggers a recalculation of the font's baselines (e.g., Alphabetic, Hanging), ensuring text remains correctly aligned.

## Choosing the Right Font Size

### Sizing Recommendations

- **Mobile UI**: 24-48px for buttons and interactive elements; 16-32px for body text.
- **Desktop UI**: 32-64px for titles and headings; 24-32px for body text.
- **High-DPI (Retina) Displays**: Use a 1.5x to 2x larger font size to ensure sharpness.

### Performance & Memory

A larger font size means a larger texture atlas, which increases both memory usage and load times. Profile your application on a target device to find the optimal balance between visual quality and performance.

## Common Problems & Solutions

### Problem: Glyphs Appear Blurry or Pixelated

This usually means the font size is too low for the resolution at which it's being displayed.
- **Solution**: Increase the font size to provide more pixel detail.

### Problem: Texture Atlas Exceeds Memory Limits

This occurs when the generated texture is too large for the target platform.
- **Solution**: Decrease the font size. You can also optimize the texture size by removing any unused glyphs from your character set.
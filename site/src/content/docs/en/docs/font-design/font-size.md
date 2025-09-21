---
title: Configuring Font Size
description: Learn how to set the font size for your bitmap font and understand its impact on glyph quality, texture size, and performance.
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
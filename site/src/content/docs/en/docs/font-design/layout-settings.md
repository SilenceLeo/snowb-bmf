---
title: Layout Settings
description: Configure bitmap font layout with spacing, padding, and alignment options for optimal texture atlas generation.
---

Layout Settings control how individual glyphs are arranged within the texture atlas when generating bitmap fonts. These parameters directly affect the final output quality, file size, and runtime performance of your bitmap font.

## Overview

The layout configuration determines the spatial organization of glyphs within the texture atlas. Key settings include:

- **Padding**: Adds extra space around each glyph to prevent rendering artifacts like color bleeding.
- **Spacing**: Defines the gap between adjacent glyphs in the texture atlas for efficient packing.
- **Pages**: The number of texture atlas images generated, which is managed automatically.

## Padding

**Default**: 1 pixel

Padding adds a transparent border around each glyph in the texture atlas. This is crucial for preventing visual artifacts, especially when fonts are scaled or filtered.

### Key Benefits
- **Prevents Bleeding**: Stops colors from adjacent glyphs from mixing during texture sampling.
- **Improves Scaling**: Ensures clean rendering when fonts are scaled up or down.
- **Supports Filtering**: Provides a necessary buffer for bilinear or trilinear texture filtering.

### Recommendations
- **Standard**: 1-2 pixels is sufficient for most cases.
- **High-DPI/Retina**: Use 2-4 pixels for crisp rendering.
- **Heavy Scaling**: Increase padding if you plan to scale the font significantly.
- **Memory**: Be aware that higher padding values increase the final texture size.

### Example
```
Padding = 0: Glyphs may bleed into each other.
Padding = 1: Standard safety margin for most projects.
Padding = 2: Extra buffer for high-quality rendering.
```

## Spacing

**Default**: 1 pixel

Spacing defines the gap between the bounding boxes of adjacent glyphs in the texture atlas. It helps optimize the packing algorithm.

### Purpose
- **Packing Efficiency**: Consistent gaps help the packing algorithm arrange glyphs more effectively.
- **Debugging**: Makes it easier to visually identify individual glyphs in the atlas.

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

Determines the number of texture atlas images generated. If all glyphs don't fit on a single texture, they are automatically distributed across multiple pages.

### When are multiple pages used?
- **Large Character Sets**: For fonts with thousands of glyphs (e.g., full CJK support).
- **Texture Size Limits**: To stay within hardware limits (e.g., 4096x4096 pixels).

The system automatically manages page creation to maximize texture space usage while trying to keep related glyphs together.

### Considerations
- **Performance**: Each additional page can introduce a small performance cost (texture switching) during rendering.
- **Single Page**: Most fonts with Latin-based character sets will fit on a single 512x512 or 1024x1024 texture.

## Impact on Exported Files

Layout settings directly influence the data in the exported font file (e.g., `.fnt`).

- **Padding**: The padding value is often written directly into the font descriptor file (e.g., the `padding` attribute in the `info` block for BMFont format).
- **Spacing**: Affects the x/y position and offset of each character in the atlas.
- **Pages**: Determines the number of texture files referenced in the descriptor.

## Best Practices

### General
1.  **Start with Defaults**: Use 1px padding and 1px spacing, then adjust as needed.
2.  **Test at Target Size**: Always check how the font looks at its final intended rendering size.
3.  **Plan for Scaling**: If the font will be scaled at runtime, use slightly more padding.
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

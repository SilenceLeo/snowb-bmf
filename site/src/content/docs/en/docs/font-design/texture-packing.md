---
title: "Texture Packing: Auto, Fixed, and Ordered Grid Atlas Optimization"
description: Learn how to efficiently pack glyphs into a texture atlas using auto packing, fixed size, and ordered grid layout modes for optimal font rendering and memory usage.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Texture Packing Optimization in SnowB BMF"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Learn how to efficiently pack glyphs into a texture atlas using auto packing, fixed size, and ordered grid layout modes for optimal font rendering and memory usage."
  "keywords": ["texture packing", "texture atlas", "bin packing", "glyph optimization", "bitmap font", "font rendering", "memory optimization", "GPU performance", "guillotine algorithm", "ordered grid", "grid layout", "glyph arrangement"]
  "about":
    "@type": "Thing"
    "name": "Texture Atlas Generation"
    "description": "The process of efficiently arranging font glyphs into a single texture for optimal rendering performance"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Pack Glyphs into a Texture Atlas"
    "description": "Step-by-step guide to packing glyphs into a texture atlas using SnowB BMF"
    "step":
      - "@type": "HowToStep"
        "name": "Select packing mode (Auto/Fixed/Ordered Grid)"
        "text": "Choose Auto Pack for maximum memory efficiency, Fixed Size for predictable dimensions, or Ordered Grid for neatly arranged glyph rows and columns"
      - "@type": "HowToStep"
        "name": "Enable Ordered Grid for structured glyph layout"
        "text": "Check the Ordered Grid checkbox to arrange glyphs in a uniform grid, then set the Columns value to control how many glyphs appear per row"
      - "@type": "HowToStep"
        "name": "Configure size parameters"
        "text": "Set width, height, and other size parameters for the texture atlas output"
      - "@type": "HowToStep"
        "name": "Run packing and review results"
        "text": "Execute the packing algorithm and review the generated texture atlas for optimal glyph arrangement"
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
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/texture-packing/"
  "audience":
    "@type": "Audience"
    "audienceType": "Game Developers"
  "inLanguage": "en"
  "teaches": ["Texture atlas optimization", "Bin packing algorithms", "GPU performance optimization", "Memory usage optimization", "Ordered grid layout"]
---

Texture packing arranges glyphs into a texture atlas, a single image optimized for GPU rendering. SnowB BMF uses bin packing algorithms to organize glyphs compactly, saving memory and improving rendering performance.

## Packing Modes: Auto, Fixed Size, and Ordered Grid

Three modes are available: optimize for memory, target specific output dimensions, or use a structured grid.

### Auto Pack: For Maximum Memory Efficiency

**Auto Pack** determines the smallest possible texture size for your glyphs using dynamic sizing with binary search.

- Minimizes texture memory usage automatically.
- Calculates the minimum required area and disables manual size settings (Width, Height, Fixed Size).
- Best for general use where minimizing memory footprint is the top priority.

### Fixed Size: For Predictable Dimensions

Use **Fixed Size** when you need specific texture constraints, such as power-of-two dimensions for GPU performance. This mode is active only when Auto Pack is disabled.

- Ensures consistent texture sizes for platforms with specific requirements.
- Settings:
    - **Width/Height:** Define the maximum dimensions for the texture atlas.
    - **Fixed Size Checkbox:** Forces the output texture to match these dimensions exactly.
- Good for:
    - GPU performance: power-of-two dimensions (e.g., 256x256, 512x512, 1024x1024) improve rendering speed and memory handling.
    - Platform constraints: some game engines or rendering frameworks expect specific texture sizes.

### Ordered Grid: For Structured Glyph Arrangement

**Ordered Grid** arranges glyphs in a uniform row-and-column grid instead of compact bin packing. Enable it via the **Ordered Grid** checkbox in the Pack Config panel.

- Clean, predictable grid layout where every glyph occupies an equal cell.
- When Ordered Grid is enabled, a **Columns** input becomes available (minimum value: 1). This controls how many glyphs appear in each row.
- Glyphs are placed left to right, top to bottom. Each cell is sized to fit the largest glyph, so alignment stays uniform.
- Good for:
    - Spritesheet production where the game engine expects grid-based glyph maps.
    - Debugging and previewing individual glyphs in an ordered layout.
    - Renderers that rely on fixed-cell glyph lookup rather than per-glyph coordinates.
    - Consistent exports regardless of glyph count changes.

:::note
When Ordered Grid is enabled, the compact bin packing algorithm is bypassed. The resulting texture may be larger than an Auto Pack result because each cell uses the maximum glyph dimensions. Use this mode when layout clarity is more important than minimal texture size.
:::

## Advanced Packing Algorithms

SnowB BMF uses the **Guillotine Bin Packing** algorithm to arrange rectangular glyphs with minimal wasted space. It runs fast enough for real-time previews and supports both dynamic and fixed texture sizing.

With **Auto Pack** enabled, a binary search layer iterates to find the most compact square dimensions before applying the Guillotine algorithm.

## Best Practices for Texture Packing

### General Recommendations
- **Prioritize Auto Pack** for best memory savings.
- **Use Fixed Size with power-of-two dimensions** (512, 1024) for optimal GPU performance.
- **Adjust Spacing:** Balance minimal spacing against glyph bleeding prevention.

### Troubleshooting
- **Glyphs Don't Fit:** If glyphs fail to pack in Fixed Size mode, try increasing the texture dimensions, reducing the number of glyphs, or switching to Auto Pack.
- **High Memory Usage:** Use Auto Pack to ensure the smallest possible texture size.


## Related Topics

- [Layout Settings](/en/docs/font-design/layout-settings/)
- [Character Sets](/en/docs/font-design/character-sets/)

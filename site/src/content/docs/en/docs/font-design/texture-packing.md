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

Texture packing is a critical step in font asset creation, where glyphs are efficiently arranged into a single image file known as a texture atlas. SnowB BMF leverages advanced bin packing algorithms to automate this process, ensuring your font glyphs are organized compactly to save memory and improve rendering performance.

## Packing Modes: Auto, Fixed Size, and Ordered Grid

SnowB BMF offers three modes for texture packing, allowing you to prioritize memory efficiency, specific output dimensions, or structured grid arrangement.

### Auto Pack: For Maximum Memory Efficiency

The **Auto Pack** mode intelligently determines the smallest possible texture size for your glyphs. It uses a dynamic sizing algorithm combined with binary search to find the most compact arrangement.

- **Key Benefit:** Minimizes texture memory usage automatically.
- **How it Works:** Calculates the minimum required texture area and disables manual size settings (Width, Height, Fixed Size) to guarantee optimal dimensions.
- **Best For:** General use cases where minimizing memory footprint is the top priority.

### Fixed Size: For Predictable Dimensions

When you need to adhere to specific texture constraints, such as power-of-two dimensions for better GPU performance, use the **Fixed Size** mode. This mode is active only when Auto Pack is disabled.

- **Key Benefit:** Ensures consistent texture sizes, ideal for platforms with specific rendering requirements.
- **Settings:**
    - **Width/Height:** Define the maximum dimensions for the texture atlas.
    - **Fixed Size Checkbox:** Forces the output texture to match these dimensions exactly.
- **Best For:**
    - **GPU Performance:** Use power-of-two dimensions (e.g., 256x256, 512x512, 1024x1024) for improved rendering speed and memory handling.
    - **Platform Constraints:** Meet the requirements of game engines or rendering frameworks that expect specific texture sizes.

### Ordered Grid: For Structured Glyph Arrangement

The **Ordered Grid** mode arranges glyphs in a uniform row-and-column grid instead of using compact bin packing. Enable it by checking the **Ordered Grid** checkbox in the Pack Config panel.

- **Key Benefit:** Produces a clean, predictable grid layout where every glyph occupies an equal cell.
- **Columns Setting:** When Ordered Grid is enabled, a **Columns** input becomes available (minimum value: 1). This controls how many glyphs appear in each row of the texture atlas.
- **How it Works:** Glyphs are placed sequentially left to right, top to bottom, into a grid with the specified number of columns. Each cell is sized to fit the largest glyph, ensuring uniform alignment.
- **Best For:**
    - **Spritesheet production:** Creating neatly organized font spritesheets for game engines that expect grid-based glyph maps.
    - **Debugging and preview:** Quickly inspecting individual glyphs in a visually ordered layout.
    - **Grid-based rendering engines:** Meeting the requirements of renderers that rely on fixed-cell glyph lookup rather than per-glyph coordinates.
    - **Consistency:** Ensuring every export produces the same predictable arrangement regardless of glyph count changes.

:::note
When Ordered Grid is enabled, the compact bin packing algorithm is bypassed. The resulting texture may be larger than an Auto Pack result because each cell uses the maximum glyph dimensions. Use this mode when layout clarity is more important than minimal texture size.
:::

## Advanced Packing Algorithms

At its core, SnowB BMF uses the **Guillotine Bin Packing** algorithm, a highly efficient method for arranging rectangular glyphs with minimal wasted space. This algorithm is fast enough for real-time previews and supports both dynamic and fixed texture sizing.

When **Auto Pack** is enabled, an additional optimization layer uses binary search to iteratively find the most compact square dimensions before applying the Guillotine algorithm, ensuring the final texture atlas is as small as possible.

## Best Practices for Texture Packing

### General Recommendations
- **Prioritize Auto Pack** for the best memory savings.
- **Use Fixed Size with power-of-two dimensions** (e.g., 512, 1024) for optimal GPU rendering performance.
- **Adjust Spacing:** Find a balance between minimizing spacing and preventing glyphs from bleeding into each other.

### Troubleshooting
- **Glyphs Don't Fit:** If glyphs fail to pack in Fixed Size mode, try increasing the texture dimensions, reducing the number of glyphs, or switching to Auto Pack.
- **High Memory Usage:** Use Auto Pack to ensure the smallest possible texture size.

By understanding and utilizing these texture packing features, you can create highly optimized bitmap fonts that perform well across a wide range of applications.

## Related Topics

- [Layout Settings](/en/docs/font-design/layout-settings/)
- [Character Sets](/en/docs/font-design/character-sets/)

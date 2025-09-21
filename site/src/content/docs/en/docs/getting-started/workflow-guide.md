---
title: Bitmap Font Workflow Guide
description: Master the step-by-step workflow for creating high-quality, game-ready bitmap fonts with SnowB BMF. Learn to configure, style, and export fonts efficiently.
---

This guide outlines the complete workflow for creating professional bitmap fonts in SnowB BMF, from initial setup to final export. Follow these steps to produce optimized, high-quality assets for your project.

## Core Workflow: 5 Steps to Your Bitmap Font

Follow these essential steps to generate your first bitmap font.

1.  **Load Font:**
    - Click **"ADD FONT FILE"** and select your font (`.ttf`, `.otf`, `.woff`).
    - Your font will appear in the "Font Family" list.

2.  **Configure Font Basics:**
    - **Font Size:** Set the primary size for your glyphs (e.g., 32px).
    - **Line Height:** Adjust to control vertical line spacing.
    - **Sharp:** Fine-tune the slider for optimal anti-aliasing and crispness (80% is a great starting point).

3.  **Optimize Texture Layout:**
    - **Padding:** Use 1-2px to prevent glyphs from bleeding into each other.
    - **Spacing:** Set the distance between glyphs in the atlas (1px is standard).
    - **Auto Pack:** Keep this enabled for the most efficient texture space.
    - **Max Width/Height:** Define the texture dimensions (e.g., 1024x1024) to match your target platform's requirements.

4.  **Customize Visual Style:**
    - **Fill:** Apply a solid color, gradient, or image pattern.
    - **Stroke:** Add outlines to enhance readability.
    - **Shadow:** Create depth with shadow effects.
    - All changes are previewed in real-time.

5.  **Export:**
    - Click the **"Export"** button.
    - Choose your format (`.txt` or `.xml`).
    - Download the generated font descriptor and texture atlas.

## Optimizing for Quality and Performance

Balance visual quality with performance by fine-tuning these settings.

### Texture & Memory Efficiency
- **Enable Auto Pack:** This is the most critical step for a compact atlas.
- **Use Minimal Padding/Spacing:** Start with `1px` and increase only if you see visual artifacts.
- **Limit Character Set:** Only include the glyphs your application actually needs to save space.
- **Choose Optimal Texture Size:**
  - **Mobile:** 512x512 or 1024x1024
  - **Desktop/Console:** 1024x1024 or 2048x2048

### Achieving Visual Clarity
- **Font Size:** Generate the font at the size it will be most commonly displayed.
- **Sharpness Control:**
  - **60-70%:** Softer look, good for smaller text.
  - **80-90%:** Crisp and clear, a reliable choice for UI text.
  - **90-100%:** Ultra-sharp, ideal for large, stylized titles.

## Quality Assurance Checklist

Before finalizing your font, perform these checks.

- **[ ] Inspect Glyphs:** Zoom in on the preview to check for any rendering errors.
- **[ ] Verify Alignment:** Ensure all characters sit correctly on the baseline.
- **[ ] Check for Artifacts:**
    - **Glyph Bleeding:** Glyphs overlapping in the texture atlas. Increase **Padding** if needed.
    - **Clipped Effects:** Strokes or shadows being cut off. Increase **Padding** to fix.
- **[ ] Test in Your Engine:**
    1. Export a test version.
    2. Import the font into your game engine or application.
    3. Verify it renders correctly at its intended size and resolution.
    4. Iterate on settings in SnowB BMF and re-export as needed.

## Advanced Techniques

### Global Metric Adjustments
Fine-tune spacing and positioning for the entire font:
- **xAdvance:** Adjusts the spacing between all characters.
- **xOffset / yOffset:** Shifts all glyphs horizontally or vertically.

### Multi-Page Export
For huge character sets that won't fit on one texture:
1. Increase the **Pages** count.
2. Ensure **Auto Pack** is enabled.
3. The export will produce multiple texture files and a single descriptor.

### Custom Image Glyphs
Embed icons or symbols directly into your font atlas:
1. Click **"SELECT IMAGES"**.
2. Choose your images (PNGs with transparency work best).
3. The images are packed alongside character glyphs.

## Platform-Specific Export Tips

### Game Engines
- **Unity:** Use the text (`.txt`) descriptor.
- **Unreal Engine:** The XML (`.xml`) format is well-supported.
- **Godot:** The text (`.txt`) format is recommended.
- **Web/HTML5:** Use smaller texture sizes (e.g., 512x512) for faster load times.

### Mobile
- **iOS & Android:** Always use power-of-two texture dimensions (e.g., 512, 1024). Efficient packing is crucial for performance on mobile devices.
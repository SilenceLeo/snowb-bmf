---
title: Controlling Font Sharpness and Anti-Aliasing
description: Master the edge rendering of your bitmap fonts. Adjust sharpness to control anti-aliasing, from perfectly smooth (0%) to crisp and pixel-perfect (100%).
---

The **Sharpness** setting gives you precise control over the anti-aliasing and edge rendering of your font glyphs. It allows you to define the visual style of your font, whether you need soft, smooth edges or hard, pixel-perfect lines.

This setting operates on a scale from 0% to 100%:

-   **0% Sharpness:** Delivers full anti-aliasing, resulting in the smoothest possible edges. This is ideal for a clean, modern look, especially at larger font sizes.
-   **100% Sharpness:** Disables anti-aliasing completely, producing crisp, pixelated edges. This is perfect for retro video games, pixel art, or creating ultra-clear text at very small sizes.

## Visual Comparison

The difference is most apparent when viewed up close. A sharpness of 0% creates a gradient of pixels to smooth the edge, while 100% uses a hard on/off transition.

| 0% Sharpness (Smooth)                                  | 100% Sharpness (Crisp)                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| ![Example of a font with 0% sharpness](~/assets/sharp-0.png) | ![Example of a font with 100% sharpness](~/assets/sharp-100.png) |

## Choosing the Right Sharpness

-   **For a smooth, professional look:** Use a low sharpness value (e.g., 0-25%). This works best for larger text where smooth curves are important.
-   **For a pixel-art or retro style:** Use a high sharpness value (e.g., 75-100%). This ensures crisp, blocky edges that align perfectly with a pixel grid.
-   **For a balanced approach:** Mid-range values offer a compromise, retaining some edge definition while avoiding heavy pixelation.

## Important Notes

-   This setting is only available when a font file is loaded into the application.
-   Higher sharpness values generally result in smaller texture file sizes because there are fewer semi-transparent pixels to store.
-   Lower sharpness values can improve readability for complex characters at large scales.
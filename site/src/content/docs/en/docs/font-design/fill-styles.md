---
title: "Font Fill Styles: Solid Colors, Gradients, and Patterns"
description: "Learn how to apply solid colors, gradients, and unique image patterns to your bitmap fonts, creating eye-catching visual effects for any project."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Font Fill Styles: Solid Colors, Gradients, and Patterns"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Learn how to apply solid colors, gradients, and unique image patterns to your bitmap fonts, creating eye-catching visual effects for any project."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "articleSection": "Font Design"
  "keywords": ["font fill styles", "bitmap font", "solid colors", "gradients", "image patterns", "font design", "SnowB BMF", "typography", "visual effects"]
  "inLanguage": "en"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/fill-styles/"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "teaches":
    - "How to apply solid colors to bitmap fonts"
    - "Creating linear and radial gradients for font characters"
    - "Using image patterns and textures in font design"
    - "Customizing gradient color stops and angles"
    - "Controlling image pattern repetition modes"
---

Fill styles define how the inside of your font characters looks. SnowB BMF has three options: solid colors, gradients, and image patterns.

All controls are in the **Fill** section of the right sidebar. Every change previews in real time.

## Solid Colors

A single, uniform hue across your characters. Best for clean, readable fonts.

Pick any color and adjust its transparency (alpha). Changes preview immediately on the canvas.

Works well for UI elements that need high contrast, monochrome designs, and simple color schemes.

## Gradients

Gradients create smooth transitions between two or more colors.

Two types are available:

- **Linear Gradient** blends colors along a straight line. You control the direction with a 0-360 degree angle.
- **Radial Gradient** blends colors outward from a central point, useful for glow and spotlight effects.

**Customizing a Gradient**

The gradient bar is your main editing area. Click anywhere on it to add a color stop, click a stop to change its color, and drag stops along the bar to reposition them. To remove a stop, drag it vertically away from the bar. For linear gradients, use the angle dial or type a value to set the direction.

The default is a white-to-black linear gradient.

### Gradient Presets

SnowB BMF includes a preset system for quick gradient application:

- 10 built-in presets (fire, ice, metallic, neon, etc.) are available with a single click.
- You can save your own gradients as custom presets and reuse them across projects.
- Custom presets can be deleted; built-in presets cannot.

The preset selector appears at the top of the gradient editor.

## Image Patterns

Fill your characters with a custom image or texture for unique, expressive fonts.

Drag and drop any image file to use as a texture. A thumbnail preview appears after upload. Use the scale control to adjust pattern density (step size: 0.01). Repetition modes control how the texture tiles within characters:
  - **`repeat`**: Tiles the pattern seamlessly in all directions.
  - **`repeat-x`**: Repeats the pattern only horizontally.
  - **`repeat-y`**: Repeats the pattern only vertically.
  - **`no-repeat`**: Displays a single instance of the pattern without repeating.

Image patterns work well for simulating materials (wood, metal, stone), integrating brand-specific textures, creating decorative fonts, or building game-themed text assets.

## Related Topics

- [Stroke Styles](/en/docs/font-design/stroke-styles/)
- [Shadow Effects](/en/docs/font-design/shadow-effects/)

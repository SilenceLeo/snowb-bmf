---
title: "Variable Fonts: Dynamic Weight, Width, and Style Control"
description: "Use OpenType Variable Fonts in SnowB BMF. Control weight, width, italic, and custom axes with real-time sliders and named instance presets."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Variable Fonts Guide for SnowB BMF - Dynamic Font Axis Control"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Learn how to use OpenType Variable Fonts in SnowB BMF. Control font weight, width, italic, optical size, and custom axes with real-time sliders. Select named instances for quick presets."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "Browser-based bitmap font generator"
    "url": "https://snowb.org"
  "keywords": ["variable fonts", "font variations", "weight axis", "width axis", "OpenType variable", "bitmap font generator", "named instances", "font design", "SnowB BMF", "font axes", "optical size", "slant axis"]
  "articleSection": "Font Design"
  "audience":
    "@type": "Audience"
    "audienceType": "Game Developers and Font Designers"
  "teaches":
    - "How to use OpenType Variable Font axes and named instances in a bitmap font generator"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Use Variable Fonts in SnowB BMF"
    "description": "Step-by-step guide for controlling variable font axes and named instances in SnowB BMF bitmap font generator"
    "supply":
      - "@type": "HowToSupply"
        "name": "A variable font file (TTF or OTF with OpenType variations)"
    "tool":
      - "@type": "HowToTool"
        "name": "SnowB BMF Font Generator"
        "url": "https://snowb.org"
    "step":
      - "@type": "HowToStep"
        "name": "Import a variable font"
        "text": "Use the 'Add Font File' button to import a variable font (TTF or OTF with OpenType variation tables)."
      - "@type": "HowToStep"
        "name": "View the variation axes panel"
        "text": "Once a variable font is detected, the Variation Axes panel appears automatically below the font settings."
      - "@type": "HowToStep"
        "name": "Adjust individual axes"
        "text": "Use the sliders to adjust each axis (weight, width, italic, optical size, slant, or custom axes). Each slider shows the axis name, current value, and min-max range."
      - "@type": "HowToStep"
        "name": "Select a named instance"
        "text": "Use the Instance dropdown to quickly switch to predefined font styles like Regular, Bold, Light, or Thin."
      - "@type": "HowToStep"
        "name": "Fine-tune and export"
        "text": "After setting the desired variation values, proceed to configure other font settings and export your bitmap font."
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "inLanguage": "en"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/variable-fonts/"
---

A single variable font file replaces separate Regular, Bold, Light, and other style files, and provides every value in between. SnowB BMF gives you control over each variation axis when generating bitmap fonts.

## What Are Variable Fonts?

Traditional font families need one file per style. **OpenType Variable Fonts** pack multiple variation axes into a single file.

Each axis defines a range of values that continuously adjust the font's appearance:

| Axis Tag | Name | Description |
|----------|------|-------------|
| `wght` | Weight | Controls thickness from Thin (100) to Black (900) |
| `wdth` | Width | Controls character width from Condensed to Expanded |
| `ital` | Italic | Toggles between upright (0) and italic (1) |
| `opsz` | Optical Size | Adjusts design details for different display sizes |
| `slnt` | Slant | Controls the angle of oblique text |

Fonts may also include custom axes defined by the type designer, which appear alongside the standard axes.

## Automatic Detection

SnowB BMF detects variable fonts automatically. When you load a font file using the **"Add Font File"** button:

1. The application reads the font's OpenType variation tables.
2. If variation axes exist, the **Variation Axes** panel appears below the font settings.
3. The controls are ready to use immediately. No extra configuration needed.

If the font contains no variation data, the panel does not appear.

**Note:** Variable font controls apply only to the **primary font** (the first font in the fallback chain). Secondary and fallback fonts use their default axis values.

## Variation Axes Control

Each variation axis in the font is displayed as an individual slider with full control:

- **Axis Name**: The human-readable name of the axis (e.g., "Weight", "Width").
- **Current Value**: Displayed next to the slider, updated in real time as you drag.
- **Min–Max Range**: The slider range is set by the font's defined minimum and maximum values.
- **Step Precision**: Most axes use a step size of `(max - min) / 100` for smooth control. The `ital` (Italic) axis uses a step of 1, since it typically functions as an on/off toggle (0 or 1).

### Common Axes in Practice

**Weight (`wght`)** is the most commonly used axis. Drag the slider to move between Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, and Black weights, or any value in between.

**Width (`wdth`)** adjusts the horizontal proportion of characters. Useful for fitting text into constrained spaces or creating wide display styles.

**Italic (`ital`)** is a binary axis. Set to 0 for upright or 1 for italic. The step size of 1 ensures clean switching.

**Optical Size (`opsz`)** adjusts fine typographic details. Smaller optical sizes typically increase stroke contrast and spacing for readability, while larger sizes tighten spacing for display use.

**Slant (`slnt`)** controls the oblique angle of the text, providing a continuous range unlike the binary italic axis.

## Named Instances

Many variable fonts include **named instances**, which are predefined axis value combinations matching traditional font styles. These are set by the font designer and typically include:

- Regular
- Bold
- Light
- Thin
- SemiBold
- ExtraBold
- Condensed

### Using Named Instances

When a variable font contains named instances, an **Instance** dropdown selector appears above the axis sliders:

1. Click the dropdown to see all available instances.
2. Select an instance name (e.g., "Bold") to instantly apply its predefined axis values.
3. All axis sliders update to reflect the selected instance's coordinates.

### Automatic Instance Matching

SnowB BMF compares your current axis values against named instances. If your values **exactly match** a named instance's coordinates, the dropdown highlights that instance name automatically.

If no instance matches, the dropdown shows "Custom".

## Best Practices

1. **Start with Named Instances**: Pick a predefined instance, then fine-tune individual axes.
2. **Test at Target Size**: Axis effects are most visible at the final bitmap font size. Preview at your intended resolution.
3. **Use Weight for Emphasis**: One variable font replaces separate Bold and Regular files. Adjust the weight axis instead.
4. **Mind the Italic Axis**: Italic is a toggle (0 or 1), not a continuous range. Use the slant axis for angular variations.
5. **Check Font Support**: If no Variation Axes panel appears after import, the font is not a variable font.
6. **Primary Font Only**: Variation controls apply only to the first imported font. Fallback fonts use their default styles.

## Related Topics

- [Font Import](/en/docs/font-design/font-import/)
- [Sharp Rendering](/en/docs/font-design/sharp/)
- [SDF Rendering](/en/docs/font-design/sdf-rendering/)

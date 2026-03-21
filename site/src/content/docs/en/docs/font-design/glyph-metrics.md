---
title: "Glyph Metrics: Fine-Tune xAdvance, xOffset, and yOffset"
description: Optimize character spacing and positioning in your bitmap font by adjusting global and individual glyph metrics like xAdvance, xOffset, and yOffset.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Adjusting Glyph Metrics in SnowB BMF"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Optimize character spacing and positioning in your bitmap font by adjusting global and individual glyph metrics like xAdvance, xOffset, and yOffset."
  "about":
    "@type": "Thing"
    "name": "Glyph Metrics"
    "description": "Character spacing and positioning parameters in bitmap fonts"
  "audience":
    "@type": "Audience"
    "audienceType": "Font Designers, Game Developers, Typography Professionals"
  "keywords": ["glyph metrics", "bitmap font", "character spacing", "xAdvance", "xOffset", "yOffset", "font design", "typography", "SnowB BMF"]
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Adjust Glyph Metrics in SnowB BMF"
    "description": "Step-by-step guide to adjusting global and individual glyph metrics for optimal character spacing"
    "step":
      - "@type": "HowToStep"
        "name": "Open the metrics panel"
        "text": "Navigate to the left sidebar and locate the global metric adjustment settings"
      - "@type": "HowToStep"
        "name": "Adjust global metrics"
        "text": "Set xAdvance, xOffset, and yOffset values to control the overall font spacing and positioning"
      - "@type": "HowToStep"
        "name": "Fine-tune individual glyph metrics"
        "text": "Activate Preview mode, select specific characters, and override their individual metric values"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "inLanguage": "en"
  "articleSection": "Font Design"
---

SnowB BMF lets you adjust glyph metrics at the global and individual level, giving you precise control over character spacing and positioning.

## Global Glyph Metrics

Global metrics affect every glyph uniformly. These settings are in the left sidebar.

![Global Metric Adjustments](/src/assets/global-metric-adjustments.png)

### Global Settings

- **xAdvance**: Default horizontal space each character occupies, i.e. how far the cursor advances after rendering.
- **xOffset**: Shifts all glyphs horizontally. Positive = right, negative = left.
- **yOffset**: Shifts all glyphs vertically. Positive = down, negative = up.

All metric values are in pixels and default to 0.

## Individual Glyph Metrics

Override global metrics for specific glyphs to fix spacing issues with individual characters.

### How to Adjust Individual Glyphs

1.  Activate **Preview** mode in the workspace.
2.  Type the characters you want to adjust into the preview text field.
3.  Click on a character in the preview area to select it.
4.  The individual adjustment panel will appear at the bottom.

![Individual Glyph Adjustments](/src/assets/metric-adjustments.png)

### Individual Settings

For any selected glyph, you can override:

- **xAdvance**: Custom advance width for the selected character.
- **xOffset**: Unique horizontal offset for this glyph.
- **yOffset**: Unique vertical offset for this glyph.

Individual adjustments take precedence over global settings.

## Common Use Cases

### When to Use Global Adjustments:
- Applying consistent spacing across the entire font.
- Adjusting the baseline for better alignment.
- Counteracting platform-specific rendering quirks.

### When to Use Individual Adjustments:
- Correcting spacing for problematic characters (e.g., "W" or "I").
- Repositioning punctuation and special symbols.
- Creating custom kerning pairs.
- Balancing visual weight of different characters.

## Best Practices

- **Start Globally**: Set a baseline with global adjustments first.
- **Adjust Individually**: Use per-glyph tweaks for exceptions.
- **Preview Often**: Test changes with different text samples in preview mode.
- **Consider the Target**: Keep your target platform's text rendering in mind.

## Related Topics

- [Kerning Pairs](/en/docs/font-design/kerning-pairs/)
- [Layout Settings](/en/docs/font-design/layout-settings/)

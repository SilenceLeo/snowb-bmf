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

In SnowB BMF, you can fine-tune the metrics of your font's glyphs at both a global and individual level. This allows for precise control over character spacing and positioning.

## Global Glyph Metrics

Global metric adjustments affect every glyph in your font, providing a uniform way to control the overall layout. You can find these settings in the left sidebar.

![Global Metric Adjustments](/src/assets/global-metric-adjustments.png)

### Global Settings

- **xAdvance**: Defines the default horizontal space each character occupies. It controls how far the cursor advances after each glyph is rendered.
- **xOffset**: Shifts all glyphs horizontally. A positive value moves them right, and a negative value moves them left.
- **yOffset**: Shifts all glyphs vertically. A positive value moves them down, and a negative value moves them up.

All metric values are in pixels and default to 0.

## Individual Glyph Metrics

For more granular control, you can override the global metrics for specific glyphs. This is perfect for fixing spacing issues with particular characters.

### How to Adjust Individual Glyphs

1.  Activate **Preview** mode in the workspace.
2.  Type the characters you want to adjust into the preview text field.
3.  Click on a character in the preview area to select it.
4.  The individual adjustment panel will appear at the bottom.

![Individual Glyph Adjustments](/src/assets/metric-adjustments.png)

### Individual Settings

For any selected glyph, you can override the following:

- **xAdvance**: Sets a custom advance width for the selected character.
- **xOffset**: Applies a unique horizontal offset to this glyph.
- **yOffset**: Applies a unique vertical offset to this glyph.

These individual adjustments will always take precedence over the global settings.

## Common Use Cases

### When to Use Global Adjustments:
- To apply a consistent spacing change across the entire font.
- To adjust the font's baseline for better alignment.
- To counteract platform-specific rendering quirks.

### When to Use Individual Adjustments:
- To correct spacing for problematic characters (e.g., "W" or "I").
- To reposition punctuation and special symbols.
- To create custom kerning pairs.
- To balance the visual weight of different characters.

## Best Practices

- **Start Globally**: Begin with global adjustments to set a baseline for your font.
- **Adjust Individually**: Use individual tweaks for exceptions and fine-tuning.
- **Preview Often**: Continuously test your changes with different text samples in preview mode.
- **Consider the Target**: Keep your target platform's text rendering in mind.

## Related Topics

- [Kerning Pairs](/en/docs/font-design/kerning-pairs/)
- [Layout Settings](/en/docs/font-design/layout-settings/)

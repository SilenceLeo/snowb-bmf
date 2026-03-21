---
title: "Kerning Pairs: Adjust Character Spacing for Better Readability"
description: Optimize your font's character spacing by configuring kerning pairs for a professional and polished text layout.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Kerning Pairs - SnowB BMF Font Design Documentation"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Learn how to optimize your bitmap font's character spacing by configuring kerning pairs for professional and polished text layout in SnowB BMF."
  "keywords": ["kerning pairs", "font design", "character spacing", "typography", "bitmap font", "SnowB BMF", "font kerning", "text layout"]
  "inLanguage": "en"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "Font Design"
  "teaches":
    - "How to activate kerning preview mode in SnowB BMF"
    - "How to define and adjust kerning pairs"
    - "Best practices for professional kerning"
    - "Understanding positive and negative kerning values"
  "audience":
    "@type": "Audience"
    "audienceType": "Font designers, game developers, UI designers"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/kerning-pairs/"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Configure Kerning Pairs in SnowB BMF"
    "description": "Step-by-step guide to adjusting character spacing with kerning pairs"
    "step":
      - "@type": "HowToStep"
        "name": "Activate Preview mode"
        "text": "Click the Preview button in the main toolbar to enable kerning visual guides"
      - "@type": "HowToStep"
        "name": "Define kerning pairs"
        "text": "Type the two characters you want to kern in the preview text area"
      - "@type": "HowToStep"
        "name": "Adjust kerning values"
        "text": "Click the first character and use the kerning panel to adjust the spacing value"
---

Kerning is a fundamental technique in typography that involves adjusting the space between specific pairs of characters to create a more visually appealing and readable text. Proper kerning makes your font look professional and balanced.

In SnowB BMF, you have precise control over kerning pairs, allowing you to perfect your bitmap font's layout.

## Visualizing the Impact of Kerning

The difference is clear. Kerning corrects awkward spacing between letters, creating a more natural flow.

| *Before: Default Spacing* | *After: Optimized with Kerning* |
| --- | --- |
| ![Default character spacing before kerning](~/assets/kerning-before.png) | ![Optimized character spacing after kerning](~/assets/kerning-after.png) |

## How to Configure Kerning Pairs

Adjusting kerning in SnowB BMF is an intuitive, visual process.

### 1. Activate Preview Mode

First, click the **Preview** button in the main toolbar. This will render your text in the workspace with helpful visual guides for kerning.

### 2. Define a Kerning Pair

In the preview text area, simply type the two characters you want to kern. For example, to adjust the spacing between 'A' and 'W', type `AW`.

### 3. Adjust the Spacing

Click on the first character of the pair (e.g., the 'A' in `AW`). The kerning panel will appear, allowing you to adjust the spacing between it and the next character.

![Adjusting the kerning value for the 'AW' pair](~/assets/kerning-AW.png)

- **Amount:** This is the kerning value in pixels.
  - A **negative** value (`-10`) moves characters closer.
  - A **positive** value (`10`) pushes them farther apart.

Your changes are reflected in real-time in the preview area, giving you immediate feedback. To adjust the kerning for `WA`, simply type `WA` and select the 'W'.

![Adjusting the kerning value for the 'WA' pair](~/assets/kerning-WA.png)

## Best Practices for Professional Kerning

- **Use Real Words:** Test kerning with actual words and sentences to see how pairs behave in context.
- **Focus on Common Pairs:** Prioritize common problematic combinations, such as `AV`, `AW`, `VA`, `WA`, `To`, `P.`, `To`, `Yo`.
- **Trust Your Eyes:** Aim for visually consistent spacing, not mathematical equality. The goal is perceptual balance.
- **Make Small Adjustments:** Fine-tune kerning with small, incremental changes (1-3 pixels at a time) for the best results.

## Related Topics

- [Glyph Metrics](/en/docs/font-design/glyph-metrics/)

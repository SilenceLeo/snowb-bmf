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

Kerning adjusts the space between specific character pairs so text looks visually balanced and readable. SnowB BMF gives you direct control over kerning pairs to fine-tune your bitmap font's layout.

## Visualizing the Impact of Kerning

Kerning corrects awkward spacing between letters so text reads more naturally:

| *Before: Default Spacing* | *After: Optimized with Kerning* |
| --- | --- |
| ![Default character spacing before kerning](~/assets/kerning-before.png) | ![Optimized character spacing after kerning](~/assets/kerning-after.png) |

## How to Configure Kerning Pairs

### 1. Activate Preview Mode

Click the **Preview** button in the main toolbar. This renders your text with visual guides for kerning.

### 2. Define a Kerning Pair

Type the two characters you want to kern in the preview text area. For example, to adjust the spacing between 'A' and 'W', type `AW`.

### 3. Adjust the Spacing

Click on the first character of the pair (e.g., the 'A' in `AW`). The kerning panel will appear, allowing you to adjust the spacing between it and the next character.

![Adjusting the kerning value for the 'AW' pair](~/assets/kerning-AW.png)

- **Amount:** This is the kerning value in pixels.
  - A **negative** value (`-10`) moves characters closer.
  - A **positive** value (`10`) pushes them farther apart.

Changes appear in real-time in the preview area. To adjust the kerning for `WA`, simply type `WA` and select the 'W'.

![Adjusting the kerning value for the 'WA' pair](~/assets/kerning-WA.png)

## Best Practices for Professional Kerning

- **Use Real Words:** Test with actual words and sentences to see pairs in context.
- **Focus on Common Pairs:** Prioritize problematic combinations: `AV`, `AW`, `VA`, `WA`, `To`, `P.`, `Yo`.
- **Trust Your Eyes:** Aim for perceptual balance, not mathematical equality.
- **Make Small Adjustments:** Adjust 1-3 pixels at a time for best results.

## Related Topics

- [Glyph Metrics](/en/docs/font-design/glyph-metrics/)

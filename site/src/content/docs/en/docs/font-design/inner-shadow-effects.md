---
title: "Inner Shadow Effects: Create Embossed and Inset Bitmap Fonts"
description: "Add inner shadow effects to bitmap fonts for embossed, engraved, and inset glow styles. Configure offset, blur, and color in SnowB BMF."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Inner Shadow Effects in Bitmap Font Design"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Comprehensive guide to creating inner shadow effects for bitmap fonts using SnowB BMF. Learn how to configure inset shadows for embossed, engraved, and inner glow text styles."
  "keywords": ["inner shadow", "inset shadow", "bitmap font", "emboss effect", "text effects", "inner glow", "font styling", "SnowB BMF"]
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "audience":
    "@type": "Audience"
    "audienceType": "Font Designers, Game Developers, UI/UX Designers"
  "articleSection": "Font Design"
  "teaches":
    - "How to enable and configure inner shadow effects"
    - "Adjusting inner shadow offset, blur, and color"
    - "Creating embossed, engraved, and inner glow styles"
    - "Combining inner shadows with outer shadows for depth"
  "inLanguage": "en"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/inner-shadow-effects/"
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
    "name": "How to Create Inner Shadow Effects for Bitmap Fonts"
    "description": "Step-by-step guide to creating professional inner shadow effects"
    "step":
      - "@type": "HowToStep"
        "name": "Enable Inner Shadow"
        "text": "Toggle inner shadows on or off with the Inner Shadow panel switch"
      - "@type": "HowToStep"
        "name": "Adjust Offset Parameters"
        "text": "Set horizontal and vertical offset values to position the inner shadow"
      - "@type": "HowToStep"
        "name": "Configure Blur Radius"
        "text": "Adjust blur radius to control inner shadow softness and spread"
      - "@type": "HowToStep"
        "name": "Select Shadow Color"
        "text": "Choose inner shadow color and opacity using the color picker"
---

Inner shadow effects render shadows inside the glyph boundary, producing embossed, engraved, or inset text styles that add tactile depth to your bitmap fonts. Unlike outer shadows that extend beyond the character, inner shadows create the illusion that the text is carved into a surface. SnowB BMF provides a dedicated Inner Shadow panel with precise controls for offset, blur, and color.

## How Inner Shadows Differ from Outer Shadows

Outer shadows (drop shadows) are drawn behind and outside the glyph, creating a raised or floating appearance. Inner shadows are drawn within the glyph's filled area, simulating light hitting a recessed or indented surface. This difference makes inner shadows ideal for emboss, engrave, and letterpress effects commonly used in game UIs, title screens, and stylized text.

You can use both inner and outer shadows simultaneously on the same font to create complex, layered depth effects.

## Understanding Inner Shadow Controls

The Inner Shadow panel is located in the right sidebar. All parameters work together to define the shadow's position, softness, and color within each glyph.

### Enable or Disable Inner Shadows

Toggle inner shadows on or off with the switch in the Inner Shadow panel header. When disabled, all your settings are preserved so you can re-enable them at any time without reconfiguration.

### Core Inner Shadow Parameters

#### Horizontal & Vertical Offset (Offset X & Offset Y)
- **Description**: Controls where the inner shadow appears inside the glyph. `Offset X` shifts the shadow horizontally, and `Offset Y` shifts it vertically.
- **Values**: Positive values move the shadow right and down; negative values move it left and up. Both positive and negative values are supported.
- **Default**: `0px`
- **Tip**: Think of the offset as a simulated light direction. A positive Offset Y with a negative Offset X suggests light coming from the upper right.

#### Blur Radius
- **Description**: Controls how soft or sharp the inner shadow edge appears. Higher values produce a gradual, diffused shadow, while `0` creates a hard-edged inset.
- **Minimum**: `0px`
- **Default**: `0px`

#### Shadow Color
- **Description**: Sets the inner shadow color. Use the color picker to choose any color and adjust its opacity (alpha channel).
- **Default**: `#000000` (black)
- **Tip**: Dark colors create a carved or engraved look, while lighter colors (especially white or near-white with low opacity) can simulate an inner highlight or bevel.

## Common Inner Shadow Styles

### Embossed Text
Creates the appearance of text raised from the surface with light hitting from one direction.
- **Offset X**: `1px`
- **Offset Y**: `1px`
- **Blur**: `1px`
- **Color**: Black at 50% opacity (`#00000080`)
- **Combine with**: An outer shadow with offset `-1px, -1px` for a full emboss effect.

### Engraved / Letterpress
Simulates text that is cut or pressed into a surface.
- **Offset X**: `0px`
- **Offset Y**: `-2px`
- **Blur**: `1px`
- **Color**: Black (`#000000`)

### Inner Glow
A soft, colorful glow emanating from the inside edges of the glyph.
- **Offset X**: `0px`
- **Offset Y**: `0px`
- **Blur**: `4px` to `8px`
- **Color**: A bright accent color (e.g., cyan `#00FFFF`, gold `#FFD700`)

### Subtle Depth
A minimal inset that adds just a touch of three-dimensionality.
- **Offset X**: `0px`
- **Offset Y**: `1px`
- **Blur**: `2px`
- **Color**: Black at 30% opacity (`#0000004D`)

## Best Practices & Tips

### Combine with Outer Shadows
Use an inner shadow together with an outer [shadow effect](/en/docs/font-design/shadow-effects/) to create convincing emboss and deboss effects. Offset the two shadows in opposite directions to simulate consistent lighting.

### Keep It Subtle
Inner shadows are most effective when kept restrained. Excessive blur or offset values can make text look muddy or difficult to read, especially at small font sizes.

### Consider Your Fill Style
Inner shadows interact visually with your [fill style](/en/docs/font-design/fill-styles/). Solid fills pair well with any inner shadow style. Gradient fills can create especially striking results when combined with a subtle inner glow.

### Performance Considerations
- Inner shadows are rendered per glyph and baked into the final texture. They do not increase the glyph bounding box size (unlike outer shadows).
- High blur values add rendering complexity but have minimal impact on atlas size since the shadow stays within the glyph boundary.

## Important Export Notes

- Inner shadow effects are baked directly into the final bitmap font image, just like outer shadows.
- Because inner shadows render within the glyph boundary, they do not require additional padding or atlas space.
- Inner shadows can be used alongside outer shadows, strokes, and fills — all effects are composited into the final glyph bitmap.

## Related Topics

- [Shadow Effects](/en/docs/font-design/shadow-effects/)
- [Fill Styles](/en/docs/font-design/fill-styles/)
- [Stroke Styles](/en/docs/font-design/stroke-styles/)

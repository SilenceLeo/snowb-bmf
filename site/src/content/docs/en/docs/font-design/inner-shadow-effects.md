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

Inner shadows render inside the glyph boundary, producing embossed, engraved, or inset text styles. Unlike outer shadows that extend beyond the character, inner shadows look like text carved into a surface. SnowB BMF has a dedicated Inner Shadow panel with controls for offset, blur, and color.

## How Inner Shadows Differ from Outer Shadows

Outer shadows (drop shadows) are drawn behind the glyph, creating a raised appearance. Inner shadows are drawn within the glyph's filled area, simulating light hitting a recessed surface. Inner shadows work well for emboss, engrave, and letterpress effects in game UIs, title screens, and stylized text.

You can combine both inner and outer shadows on the same font for layered depth effects.

## Understanding Inner Shadow Controls

The Inner Shadow panel is in the right sidebar.

### Enable or Disable Inner Shadows

Toggle inner shadows on or off with the switch in the panel header. When disabled, settings are preserved for re-enabling later.

### Core Inner Shadow Parameters

#### Horizontal & Vertical Offset (Offset X & Offset Y)
- **Description**: Controls where the inner shadow appears inside the glyph. `Offset X` shifts horizontally; `Offset Y` shifts vertically.
- **Values**: Positive values move right/down; negative values move left/up.
- **Default**: `0px`
- **Tip**: The offset simulates light direction. Positive Offset Y with negative Offset X suggests light from the upper right.

#### Blur Radius
- **Description**: Controls inner shadow edge softness. Higher values produce a diffused shadow; `0` creates a hard-edged inset.
- **Minimum**: `0px`
- **Default**: `0px`

#### Shadow Color
- **Description**: Sets the inner shadow color and opacity via the color picker.
- **Default**: `#000000` (black)
- **Tip**: Dark colors create a carved look; lighter colors (white or near-white at low opacity) simulate an inner highlight or bevel.

## Common Inner Shadow Styles

### Embossed Text
Text appears raised from the surface with directional lighting.
- **Offset X**: `1px`
- **Offset Y**: `1px`
- **Blur**: `1px`
- **Color**: Black at 50% opacity (`#00000080`)
- **Combine with**: An outer shadow with offset `-1px, -1px` for a full emboss effect.

### Engraved / Letterpress
Simulates text cut or pressed into a surface.
- **Offset X**: `0px`
- **Offset Y**: `-2px`
- **Blur**: `1px`
- **Color**: Black (`#000000`)

### Inner Glow
Soft glow emanating from the inside edges of the glyph.
- **Offset X**: `0px`
- **Offset Y**: `0px`
- **Blur**: `4px` to `8px`
- **Color**: A bright accent color (e.g., cyan `#00FFFF`, gold `#FFD700`)

### Subtle Depth
Minimal inset that adds a sense of depth.
- **Offset X**: `0px`
- **Offset Y**: `1px`
- **Blur**: `2px`
- **Color**: Black at 30% opacity (`#0000004D`)

## Best Practices & Tips

### Combine with Outer Shadows
Pair inner shadows with outer [shadow effects](/en/docs/font-design/shadow-effects/) for realistic emboss and deboss effects. Offset the two shadows in opposite directions to simulate consistent lighting.

### Keep It Subtle
Inner shadows work best when restrained. Excessive blur or offset can make text muddy or hard to read, especially at small font sizes.

### Consider Your Fill Style
Inner shadows interact with your [fill style](/en/docs/font-design/fill-styles/). Solid fills pair well with any inner shadow. Gradient fills look good when combined with a subtle inner glow.

### Performance Considerations
- Inner shadows are rendered per glyph and baked into the final texture. They do not increase glyph bounding box size (unlike outer shadows).
- High blur values add rendering cost but have minimal impact on atlas size since the shadow stays within the glyph boundary.

## Important Export Notes

- Inner shadows are baked into the final bitmap font image, just like outer shadows.
- Because inner shadows render within the glyph boundary, they require no additional padding or atlas space.
- Inner shadows work alongside outer shadows, strokes, and fills — all effects are composited into the final glyph bitmap.

## Related Topics

- [Shadow Effects](/en/docs/font-design/shadow-effects/)
- [Fill Styles](/en/docs/font-design/fill-styles/)
- [Stroke Styles](/en/docs/font-design/stroke-styles/)

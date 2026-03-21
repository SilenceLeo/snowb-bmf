---
title: "Character Sets: Define Custom Unicode Glyphs for Bitmap Fonts"
description: Configure which characters to include in your bitmap font. Try it free — no download required.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Character Sets - Configure Characters in Bitmap Fonts"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Complete guide to configuring character sets in SnowB BMF bitmap font generator. Learn how to add, manage, and optimize Unicode characters for your game fonts."
  "keywords": ["character sets", "bitmap font", "Unicode", "glyph", "font design", "texture atlas", "game development", "SnowB BMF"]
  "articleSection": "Font Design"
  "inLanguage": "en"
  "about":
    "@type": "Thing"
    "name": "Character Set Configuration"
    "description": "Feature for managing which characters are included in bitmap fonts"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "audience":
    "@type": "Audience"
    "audienceType": "Developers"
    "name": "Game Developers and Font Designers"
  "teaches": ["Unicode character management", "font optimization", "glyph configuration", "international text support"]
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Configure Character Sets in SnowB BMF"
    "description": "Step-by-step guide for configuring which characters to include in your bitmap font"
    "step":
      - "@type": "HowToStep"
        "name": "Open Glyphs Input"
        "text": "Locate the Glyphs input field in the Font Config panel on the left sidebar"
      - "@type": "HowToStep"
        "name": "Add Characters"
        "text": "Type or paste your desired characters into the multi-line text field — duplicates are removed automatically"
      - "@type": "HowToStep"
        "name": "Preview and Verify"
        "text": "Check the real-time workspace preview to confirm your character set renders correctly with the selected font"
---

Character sets control which glyphs appear in your bitmap font. Add or remove characters with full Unicode support — SnowB BMF deduplicates automatically.

## Understanding Character Sets

Each unique character in your set becomes a separate glyph in the final texture atlas.

### Default Set

SnowB BMF starts with a default character set that includes:

- Numbers: `0123456789`
- Lowercase letters: `abcdefghijklmnopqrstuvwxyz`
- Uppercase letters: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- Common symbols: `!№;%:?*()_+-=.,/|"'@#$^&{}`

This default set covers most Western text use cases.

## Configuring Character Sets

### The Glyphs Input Field

Configure your character set in the **Glyphs** input field, located in the left-hand Font Config panel:

1. Find the "Glyphs" section in the Font Config panel.
2. Type or paste characters into the multi-line text field.
3. Changes apply immediately as you type, and the workspace preview updates automatically.

### Features

Duplicate characters are removed automatically — each character appears only once in the font.

The input supports full Unicode, so you can include international characters (e, n, u), non-Latin scripts, emoji, special symbols, and mathematical symbols.

The input field also supports Input Method Editors (IME) for typing CJK and other complex scripts.

### The Space Character

The space character (` `) is automatically included in every character set and cannot be removed. This ensures proper text spacing in applications using your font.

## Character Set Examples

### Basic Latin Only
```
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
```

### Gaming HUD
```
0123456789
ABCDEFGHIJKLMNOPQRSTUVWXYZ
HP:MP/+-%
```

### International Text (Spanish)
```
abcdefghijklmnopqrstuvwxyzñ
ABCDEFGHIJKLMNOPQRSTUVWXYZÑ
áéíóúüÁÉÍÓÚÜ¿¡
0123456789
```

### Special Symbols
```
★☆♫♪⚡⭐🎮🎯
←→↑↓⬆⬇⬅➡
```

## Best Practices

### Optimize for Performance

Keep your character set minimal. Each additional character increases texture size, memory usage, and load time. Audit your application's text and include only what you need.

### Workflow Tips

- Group characters by language or function for easier management.
- Verify your set covers all text in your application — UI elements, dialogs, and dynamic content.

## Technical Details

### Character Processing

When you input characters, SnowB BMF processes them in this order:

1. Characters are parsed as individual Unicode code points.
2. Duplicates are removed.
3. A space character is added if not present.
4. Each character is rendered as a bitmap glyph using your font and styling settings.

### Glyph Rendering Priority

When rendering a character, SnowB BMF uses this priority order:

1. If an imported TTF/OTF file contains the character, that font is used.
2. If not found, the system tries a browser-default font.
3. If still missing, an empty glyph is generated.

## Integration with Font Export

Your character set directly determines the exported font data:

### Font Descriptor Files
- Text format lists all characters with their texture coordinates.
- XML format includes character codes and glyph information.
- Binary format stores optimized character data for runtime use.

### Texture Atlas
- Each character occupies space in the packed texture
- Character positioning is optimized by the packing algorithm
- The space character does not consume texture space but its metrics are exported.

## Troubleshooting

### Missing or Incorrect Characters
- Verify your imported font file contains the required glyphs.
- Missing characters fall back to a browser-default font, which may cause style mismatches.
- Confirm your input text uses correct Unicode encoding.

### Large Texture Size or Poor Performance
- An oversized character set is the most common cause. Remove non-essential characters.
- Use auto-packing and adjust spacing/padding to shrink the texture atlas.
- Highly detailed characters take longer to process and consume more texture space.

## Related Topics

- [Font Import](/en/docs/font-design/font-import/)
- [Texture Packing](/en/docs/font-design/texture-packing/)
- [Layout Settings](/en/docs/font-design/layout-settings/)
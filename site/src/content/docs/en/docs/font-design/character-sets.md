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

Character sets define which characters (glyphs) are included in your bitmap font. You can manage your character set by adding or removing characters, with full support for Unicode. SnowB BMF automatically handles duplicates and ensures efficient glyph generation.

## Understanding Character Sets

A character set is a collection of characters that will be rendered as bitmap glyphs. Each unique character becomes a separate glyph in the final texture atlas.

### Default Set

SnowB BMF starts with a comprehensive default character set that includes:

- **Numbers**: `0123456789`
- **Lowercase letters**: `abcdefghijklmnopqrstuvwxyz`
- **Uppercase letters**: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- **Common symbols**: `!№;%:?*()_+-=.,/|"'@#$^&{}`

This default set covers most common use cases for Western text.

## Configuring Character Sets

### The Glyphs Input Field

Configure your character set in the **Glyphs** input field, located in the left-hand Font Config panel:

1. **Locate the Input**: Find the "Glyphs" section in the Font Config panel.
2. **Add Characters**: Use the multi-line text field to type or paste your desired characters.
3. **Real-time Updates**: Changes are applied immediately as you type
4. **Visual Preview**: The workspace preview updates automatically to show your character set.

### Features

**Automatic Deduplication**: Duplicate characters are automatically removed. You can type the same character multiple times, but it will only be included once in the font.

**Unicode Support**: Full Unicode support allows you to include:
- International characters (é, ñ, ü, etc.)
- Non-Latin scripts (中, 日, العربية, etc.)
- Emoji and special symbols (★, ♫, ⚡, etc.)
- Mathematical symbols (∑, π, ∞, etc.)

**IME Compatibility**: The input field supports Input Method Editors (IME) for typing complex and international characters.

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

Keep your character set minimal. Large sets increase texture size, memory usage, and loading times. Analyze your application's text to include only the characters you need.

### Workflow Tips

- **Organize Logically**: Group characters in the input field (e.g., by language or function) to make your set easier to manage.
- **Test Coverage**: Ensure your character set covers all text that will appear in your application, including UI elements, dialogs, and dynamic content.

## Technical Details

### Character Processing

When you input characters, SnowB BMF processes them as follows:

1. **Unicode Parsing**: Characters are parsed as individual Unicode code points
2. **Deduplication**: Duplicates are removed automatically.
3. **Space Addition**: A space character is added if not present.
4. **Glyph Generation**: Each character is rendered as a bitmap glyph using your font and styling settings

### Glyph Rendering Priority

When rendering a character, SnowB BMF uses this priority order:

1. **Imported Font**: If an imported TTF/OTF file contains the character.
2. **System Fallback**: If not found, the system tries to render it using a browser-default font.
3. **Missing Glyph**: An empty glyph is generated for unsupported characters.

## Integration with Font Export

Your character set directly affects the exported font data:

### Font Descriptor Files
- **Text Format**: Lists all characters with their texture coordinates
- **XML Format**: Includes character codes and glyph information
- **Binary Format**: Optimized character data for runtime use

### Texture Atlas
- Each character occupies space in the packed texture
- Character positioning is optimized by the packing algorithm
- The space character does not consume texture space but its metrics are exported.

## Troubleshooting

### Missing or Incorrect Characters
- **Font Support**: Ensure your imported font file contains the required glyphs.
- **System Fallback**: If an imported font is missing a character, the system may fall back to a browser-default font, causing a style mismatch.
- **Encoding Issues**: Verify your input text uses correct Unicode encoding.

### Large Texture Size or Poor Performance
- **Reduce Character Count**: The most common cause is a character set that is too large. Remove any characters that are not essential for your application.
- **Optimize Layout**: Use auto-packing and adjust spacing/padding settings to reduce the final texture atlas size.
- **Complex Glyphs**: Fonts with very detailed characters can take longer to process and consume more texture space.

## Related Topics

- [Font Import](/en/docs/font-design/font-import/)
- [Texture Packing](/en/docs/font-design/texture-packing/)
- [Layout Settings](/en/docs/font-design/layout-settings/)
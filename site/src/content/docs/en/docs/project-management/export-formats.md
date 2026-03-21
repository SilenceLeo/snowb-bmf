---
title: "Export Formats: 6 Ways to Export Bitmap Fonts for Game Engines"
description: "Learn how to export bitmap fonts in 6 formats: Text, XML, Binary, JSON, C Header, and MSDF Atlas JSON. Compatible with Unity, Unreal, Godot, embedded systems, and MSDF shader pipelines."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Exporting Bitmap Fonts in 6 Formats from SnowB BMF"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Learn how to export bitmap fonts in 6 formats: Text, XML, Binary, JSON, C Header, and MSDF Atlas JSON. Compatible with Unity, Unreal, Godot, embedded systems, and MSDF shader pipelines."
  "keywords": ["bitmap font export", "font formats", "game development", "Unity", "Unreal", "Godot", "BMFont", "texture atlas", "fnt format", "XML format", "binary format", "JSON format", "C header format", "MSDF Atlas JSON", "embedded systems", "pixel format", "export dialog", "font name", "reconstruction filter", "export options"]
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/project-management/export-formats/"
  "audience":
    "@type": "Audience"
    "audienceType": "Game Developers and Web Developers"
  "teaches":
    - "How to export bitmap fonts in multiple formats"
    - "Configuring export dialog options"
    - "Choosing the right format for your game engine"
    - "Using C Header format for embedded systems"
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Export Bitmap Fonts for Game Engines"
    "description": "Step-by-step guide for exporting bitmap fonts in multiple formats from SnowB BMF"
    "step":
      - "@type": "HowToStep"
        "name": "Open Export Dialog"
        "text": "Click the Export button in the top menu bar or press Ctrl+Shift+S (Cmd+Shift+S on macOS)"
      - "@type": "HowToStep"
        "name": "Set Font Name"
        "text": "Enter a custom font name that will appear in the BMFont descriptor's info face field, or keep the default (main font family name)"
      - "@type": "HowToStep"
        "name": "Set File Name"
        "text": "Enter a custom file name for the exported .zip archive, or keep the default (current project name)"
      - "@type": "HowToStep"
        "name": "Choose Export Type"
        "text": "Select from Text (.fnt), XML, Binary, JSON, C Header, or MSDF Atlas JSON format using the dropdown menu"
      - "@type": "HowToStep"
        "name": "Configure Advanced Options"
        "text": "For C Header format, configure pixel format (GRAY8, RGB, RGBA, etc.), reconstruction filter, include textures toggle, and extended data fields toggle"
      - "@type": "HowToStep"
        "name": "Download Files"
        "text": "Click the Save button to download a .zip archive containing the descriptor file and PNG texture atlas(es)"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "inLanguage": "en"
  "mentions":
    - "@type": "DigitalDocument"
      "name": "BMFont Text Format"
      "fileFormat": ".fnt"
      "description": "Human-readable text format for bitmap font descriptors"
    - "@type": "DigitalDocument"
      "name": "BMFont XML Format"
      "fileFormat": ".xml"
      "description": "Structured XML format for bitmap font descriptors"
    - "@type": "DigitalDocument"
      "name": "BMFont Binary Format"
      "fileFormat": ".fnt"
      "description": "Compact binary format for performance-critical applications"
    - "@type": "DigitalDocument"
      "name": "BMFont JSON Format"
      "fileFormat": ".json"
      "description": "JSON representation of BMFont data with distanceField metadata support"
    - "@type": "DigitalDocument"
      "name": "C Header Format"
      "fileFormat": ".c"
      "description": "Texture data embedded as C language arrays for embedded systems and MCUs"
    - "@type": "DigitalDocument"
      "name": "MSDF Atlas JSON Format"
      "fileFormat": ".json"
      "description": "msdf-atlas-gen compatible format with em-normalized coordinates for MSDF shader pipelines"
    - "@type": "ImageObject"
      "name": "PNG Texture Atlas"
      "fileFormat": ".png"
      "description": "Bitmap font texture containing all character glyphs"
---

SnowB BMF exports your bitmap font as a texture atlas (a `.png` image) and a descriptor file that tells your application how to use it. The descriptor contains all the necessary data, such as glyph positions, metrics, and kerning pairs.

You can choose from several standard formats to ensure compatibility with most game engines, frameworks, and applications.

## How to Export Your Font

1.  **Open the Export Dialog**: Click the **Export** button in the top menu bar or press `Ctrl+Shift+S` (`Cmd+Shift+S` on macOS).
2.  **Set Font Name**: Enter a custom name for your font, or keep the default (your main font family name). This value appears in the `info face` field of the BMFont descriptor.
3.  **Set File Name**: Enter a custom name for the exported `.zip` file, or keep the default (your current project name).
4.  **Choose Export Type**: Select the best format for your needs from the dropdown menu. The preview shows the output as `{fileName}.{ext} (BMFont TYPE)`.
5.  **Configure Advanced Options**: Depending on the selected format, additional options may appear (see [Export Dialog Options](#export-dialog-options) below).
6.  **Save**: Click the **Save** button to download a `.zip` archive containing the descriptor file and the PNG texture atlas(es).

## Supported Export Formats

All formats are based on the official [AngelCode BMFont specification](http://www.angelcode.com/products/bmfont/doc/file_format.html). Choose the format that best fits your project's requirements for compatibility, performance, and ease of use.

### Text Format (`.fnt`, `.txt`)

The most common and widely supported format. It's human-readable, making it easy to debug.

- **Best for**: Maximum compatibility with engines like Unity, Unreal, and Cocos2d-x.
- **Features**: Plain text, easy to parse, includes comments for readability.
- **Specification**: For details, see the [text format documentation](https://www.angelcode.com/products/bmfont/doc/file_format.html#tags).

### XML Format (`.xml`, `.fnt`)

A structured, easy-to-parse format ideal for applications with built-in XML support.

- **Best for**: Web applications or projects using custom tools that can easily process XML.
- **Features**: Standard XML structure, self-descriptive tags.

**Example:**
```xml
<?xml version="1.0"?>
<font>
  <info face="Arial" size="32" ... />
  <common lineHeight="38" base="26" scaleW="512" scaleH="512" pages="1" ... />
  <pages>
    <page id="0" file="font_0.png" />
  </pages>
  <chars count="95">
    <char id="65" x="10" y="0" width="18" height="20" xoffset="0" yoffset="6" ... />
  </chars>
</font>
```

### Binary Format (`.fnt`)

The most compact and efficient format, designed for fast loading and minimal file size.

- **Best for**: Performance-critical applications, mobile games, or projects with memory constraints.
- **Features**: Smallest file size, optimized for quick parsing, follows the BMFont v3 specification.
- **Specification**: For details, see the [binary format documentation](https://www.angelcode.com/products/bmfont/doc/file_format.html#bin).

**Structure:**
The binary file consists of typed blocks for info, common data, pages, characters, and kerning pairs, ensuring fast read times.

### JSON Format (`.json`)

A JSON representation of BMFont data, offering the flexibility of a widely-used data format.

- **Best for**: Web applications, custom parsers, and projects that prefer JSON over plain text or XML.
- **Features**: Standard JSON structure, easy to parse in any language, includes `distanceField` metadata when using SDF rendering modes.

**Example:**
```json
{
  "info": {
    "face": "Arial",
    "size": 32,
    "bold": 0,
    "italic": 0
  },
  "distanceField": {
    "fieldType": "msdf",
    "distanceRange": 4
  },
  "common": {
    "lineHeight": 38,
    "base": 26,
    "scaleW": 512,
    "scaleH": 512,
    "pages": 1
  },
  "pages": ["font_0.png"],
  "chars": [
    { "id": 65, "x": 10, "y": 0, "width": 18, "height": 20, "xoffset": 0, "yoffset": 6, "xadvance": 18, "page": 0 }
  ]
}
```

### C Header Format (`.c`)

Embeds texture data directly as C language byte arrays, designed for resource-constrained environments.

- **Best for**: Embedded systems, microcontrollers (MCU), and bare-metal applications where file system access is limited.
- **Features**: Supports 8 pixel formats (GRAY8, RGB, RGBA, ARGB, BGR, ABGR, BGRA, RGB565), configurable reconstruction filter, texture data compiled directly into the binary.
- **Pixel Formats**: Choose the format that matches your display hardware:
  - `GRAY8` (1 byte/pixel) — Monochrome displays
  - `RGB` (3 bytes/pixel) — Standard color without alpha
  - `RGBA` / `ARGB` (4 bytes/pixel) — Color with alpha, different byte orders
  - `BGR` / `ABGR` / `BGRA` (4 bytes/pixel) — Reversed byte order variants
  - `RGB565` (2 bytes/pixel) — 16-bit color for memory-constrained displays

### MSDF Atlas JSON (`.json`)

An [msdf-atlas-gen](https://github.com/Chlumsky/msdf-atlas-gen) compatible JSON format using em-normalized coordinates.

- **Best for**: MSDF shader pipelines, custom rendering engines with distance field support, and projects using msdf-atlas-gen tooling.
- **Features**: Em-normalized coordinates (Y-axis up), font metrics from OpenType tables, distanceField metadata with configurable range, underline position/thickness data.
- **Note**: This format is designed specifically for SDF/MSDF rendering modes. Using it with the Default render mode will produce valid but non-SDF output.

## Advanced Features

### Multi-Page Export

If your character set is too large to fit on a single texture, SnowB BMF automatically handles it:

- **Automatic Pagination**: Glyphs are split across multiple texture files (e.g., `font_0.png`, `font_1.png`).
- **Unified Descriptor**: A single descriptor file is generated that references all texture pages, so your application can manage them easily.

### Metadata

Exported files automatically include useful metadata, such as the font name, size, generation date, and character set details, which can be helpful for debugging and asset management.

## Advanced Export Options

### Export Dialog Options

When you open the export dialog (`Ctrl+Shift+S` / `Cmd+Shift+S`), the following options are available:

#### Font Name

Customize the font name that appears in the exported BMFont descriptor file.

- **Field**: Text input
- **Default**: Your main font family name
- **Effect**: Sets the `info face` attribute in the BMFont descriptor (e.g., `info face="MyFont"`)

#### File Name

Customize the name of the exported `.zip` archive.

- **Field**: Text input with `.zip` suffix
- **Default**: Current project name
- **Effect**: The download file will be named `{fileName}.zip`

#### Export Type

Select the output format from a dropdown menu.

- **Field**: Dropdown select
- **Preview**: Each option shows `{fileName}.{ext} (BMFont TYPE)` so you can see the exact output filename and format
- **Options**: All six supported formats -- Text (.fnt/.txt), XML (.xml/.fnt), Binary (.fnt), JSON (.json), C Header (.c), MSDF Atlas JSON (.json)

#### Pixel Format (C Header only)

Choose the pixel encoding format for texture data embedded in the C header file. This option only appears when C Header format is selected.

- **Field**: Dropdown select
- **Default**: GRAY8
- **Options**:
  - `GRAY8` (1 byte/pixel) -- Monochrome displays
  - `RGB` (3 bytes/pixel) -- Standard color without alpha
  - `RGBA` (4 bytes/pixel) -- Color with alpha
  - `ARGB` (4 bytes/pixel) -- Alpha-first byte order
  - `BGR` (3 bytes/pixel) -- Reversed byte order
  - `ABGR` (4 bytes/pixel) -- Alpha-first reversed byte order
  - `BGRA` (4 bytes/pixel) -- Reversed with trailing alpha
  - `RGB565` (2 bytes/pixel) -- 16-bit color for memory-constrained displays

#### Reconstruction Filter (C Header only)

Apply a blur filter to the texture before encoding. This option only appears when the selected format supports it.

- **Field**: Off/On toggle switch
- **Default**: Off
- **Effect**: When enabled, applies a reconstruction (blur) filter to the texture data, which can improve visual quality on certain display hardware

#### Include Textures (C Header only)

Control whether texture pixel data is embedded in the C header file. This option only appears when the selected format supports it.

- **Field**: Off/On toggle switch
- **Default**: Off
- **Effect**: When enabled, the generated `.c` file includes the full texture pixel data as C byte arrays, ready to compile directly into your firmware

#### Extended Data Fields (C Header only)

Include additional metadata fields in the export. This option only appears when the selected format supports it.

- **Field**: Off/On toggle switch
- **Default**: Off
- **Effect**: When enabled, the exported file includes extra metadata fields beyond the standard BMFont specification

## Troubleshooting Common Issues

-   **Characters Not Displaying**:
    -   Ensure the `.fnt` file and all `.png` texture files are in the correct path for your project.
    -   Verify that the character you are trying to display was included in the font during export.

-   **Blurry or Distorted Text**:
    -   In your game engine, set the texture's filter mode to **Point** or **Nearest Neighbor** to prevent blurring.
    -   Ensure your game is rendering the font at a 1:1 pixel scale.

-   **Export Fails**:
    -   If the export times out or fails, your character set may be too large for a single texture. Try increasing the texture dimensions in the **Layout** settings or reducing the number of characters.

## Related Topics

- [Texture Packing](/en/docs/font-design/texture-packing/)
- [Project Operations](/en/docs/project-management/project-operations/)
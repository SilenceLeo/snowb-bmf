---
title: Exporting Bitmap Fonts
description: Learn how to export bitmap fonts as PNG files with Text, XML, or Binary descriptors for game engines like Unity, Unreal, and Godot.
---

SnowB BMF exports your bitmap font as a texture atlas (a `.png` image) and a descriptor file that tells your application how to use it. The descriptor contains all the necessary data, such as glyph positions, metrics, and kerning pairs.

You can choose from several standard formats to ensure compatibility with most game engines, frameworks, and applications.

## How to Export Your Font

1.  **Open the Export Dialog**: Click the **Export** button in the top menu bar or press `Ctrl+E`.
2.  **Choose a Format**: Select the best format for your needs from the dropdown menu.
3.  **Configure Settings**: Adjust the filename, texture format, and other options as needed.
4.  **Download Files**: Click the download button to save a `.zip` archive containing the descriptor file and the PNG texture atlas(es).

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
- **Specification**: For details, see the [binary format documentation](https.www.angelcode.com/products/bmfont/doc/file_format.html#bin).

**Structure:**
The binary file consists of typed blocks for info, common data, pages, characters, and kerning pairs, ensuring fast read times.

## Advanced Features

### Multi-Page Export

If your character set is too large to fit on a single texture, SnowB BMF automatically handles it:

- **Automatic Pagination**: Glyphs are split across multiple texture files (e.g., `font_0.png`, `font_1.png`).
- **Unified Descriptor**: A single descriptor file is generated that references all texture pages, so your application can manage them easily.

### Metadata

Exported files automatically include useful metadata, such as the font name, size, generation date, and character set details, which can be helpful for debugging and asset management.

## Troubleshooting Common Issues

-   **Characters Not Displaying**:
    -   Ensure the `.fnt` file and all `.png` texture files are in the correct path for your project.
    -   Verify that the character you are trying to display was included in the font during export.

-   **Blurry or Distorted Text**:
    -   In your game engine, set the texture's filter mode to **Point** or **Nearest Neighbor** to prevent blurring.
    -   Ensure your game is rendering the font at a 1:1 pixel scale.

-   **Export Fails**:
    -   If the export times out or fails, your character set may be too large for a single texture. Try increasing the texture dimensions in the **Layout** settings or reducing the number of characters.
---
title: "SDF & MSDF Rendering: Scalable Distance Field Fonts for Games"
description: "Generate SDF, PSDF, MSDF, and MTSDF bitmap fonts with SnowB BMF. Create resolution-independent fonts for Unity, Godot, and Unreal using msdfgen WASM technology. Free online tool."
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "SDF & MSDF Rendering: Scalable Distance Field Fonts for Games"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Generate SDF, PSDF, MSDF, and MTSDF bitmap fonts with SnowB BMF. Create resolution-independent fonts for Unity, Godot, and Unreal using msdfgen WASM technology."
  "keywords": ["SDF font generator", "MSDF bitmap font", "signed distance field", "msdfgen", "distance field texture", "multi-channel SDF", "MTSDF", "PSDF", "game font rendering", "resolution-independent fonts"]
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "articleSection": "Font Design"
  "inLanguage": "en"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/font-design/sdf-rendering/"
  "teaches":
    - "What SDF rendering is and how it works"
    - "Differences between SDF, PSDF, MSDF, and MTSDF modes"
    - "How to configure distance field parameters"
    - "Using SDF fonts in game engines"
---

Signed Distance Field (SDF) rendering stores the distance from each pixel to the nearest glyph edge, instead of pixel colors. This lets fonts scale to any size while staying sharp. Traditional bitmap fonts pixelate when enlarged; SDF fonts do not.

SnowB BMF supports multiple SDF rendering modes, generating resolution-independent bitmap fonts directly in your browser.

:::caution
SDF rendering is currently an **experimental** feature. Parameters and behavior may change in future releases.
:::

## What is SDF Rendering?

In a standard bitmap font, each glyph is a rasterized image at a fixed resolution. Scaling up makes the text blurry or pixelated. SDF encodes each pixel as a distance value from the nearest glyph edge.

At render time, a shader reconstructs the glyph outline from these distance values. Because the distance field is smooth and continuous, text stays sharp at any scale. This technique is widely used in Unity (TextMeshPro), Godot, and Unreal Engine.

## SDF Rendering Modes in SnowB BMF

There are five rendering modes. **Default** produces standard bitmap fonts; the other four generate distance field textures.

| Mode | Channels | Implementation | Font File Required |
| --- | --- | --- | --- |
| **Default** | RGBA | Standard Canvas rendering | No |
| **SDF** | Single | Felzenszwalb/Huttenlocher EDT (JS) or msdfgen WASM | No (WASM requires font file) |
| **PSDF** | Single | msdfgen WASM | Yes |
| **MSDF** | Multi (RGB) | msdfgen WASM | Yes |
| **MTSDF** | Multi (RGBA) | msdfgen WASM | Yes |

### SDF (Signed Distance Field)

Generates a single-channel distance field. Two pipelines are available:

- **Pure JavaScript (EDT):** Uses the Felzenszwalb/Huttenlocher Euclidean Distance Transform. Works without a font file — processes Canvas-rendered glyphs directly.
- **msdfgen WASM:** When a font file is uploaded, this pipeline produces higher-quality results by working with the font's vector outlines.

### PSDF (Pseudo-SDF)

Uses the msdfgen WASM pipeline to generate a pseudo-signed distance field. Produces single-channel output similar to SDF but with a different distance calculation. Requires a font file.

### MSDF (Multi-channel SDF)

Encodes distance information across three color channels (RGB), preserving sharp corners and fine details that single-channel SDF cannot reproduce. MSDF is the most common distance field format in game development, offering a good balance of quality and performance. Requires a font file.

### MTSDF (Multi-channel + True SDF)

Combines MSDF's multi-channel approach with a true SDF channel in alpha. This gives you sharp corners from MSDF and smooth anti-aliasing from the true SDF. Requires a font file.

## How to Generate SDF Fonts

### 1. Upload a Font File

PSDF, MSDF, and MTSDF modes require a TrueType (.ttf) or OpenType (.otf) font file. Go to **Font Import** and load your font.

> SDF mode works without a font file (via the JS EDT pipeline), but uploading one enables the higher-quality WASM pipeline.

### 2. Select a Rendering Mode

In the **Font Config** panel on the left sidebar, find the **Render Config** section (marked as *Experimental*). Select your desired rendering mode from the dropdown.

### 3. Configure Parameters

Adjust the rendering parameters to suit your needs. See the [Configuration Parameters](#configuration-parameters) section below for detailed explanations.

### 4. Export Your Font

Once satisfied with the preview, export your font using the standard export workflow. SDF fonts are exported as PNG texture atlases with the corresponding BMFont descriptor file. For MSDF/MTSDF, an additional MSDF Atlas JSON format is available — see [Export Formats](/en/docs/project-management/export-formats/) for details.

## Configuration Parameters

### Distance Range

Controls how far (in pixels) the distance field extends from the glyph edge. Larger ranges produce smoother scaling but need more padding.

- **Minimum:** 1
- **Step:** 1
- **Typical values:** 4–8 for most use cases; higher values (16+) for fonts that need extreme scaling

### SDF Channel Options

Available only in **SDF** mode. Controls how the distance field is mapped to the output texture channels:

| Option | Description |
| --- | --- |
| **White/Black** | White inside the glyph, black outside |
| **Black/White** | Black inside the glyph, white outside |
| **White/Alpha** | White glyph with distance in alpha channel |
| **Black/Alpha** | Black glyph with distance in alpha channel |

Choose the option that matches your game engine's shader expectations.

### WASM Pipeline Parameters

These parameters are available when using the msdfgen WASM pipeline (PSDF, MSDF, MTSDF, and SDF with a font file uploaded).

#### Overlap Support

Handles overlapping contours in font glyphs. Enable this if your font has self-overlapping paths — common in complex scripts and decorative fonts.

#### Scanline Pass

Additional scanline-based correction pass to fix artifacts in the distance field output.

#### Fill Rule

Available only when **Scanline Pass** is enabled. Determines how overlapping paths are filled:

- **Non-Zero:** The default winding rule. A point is inside the glyph if the winding number is non-zero.
- **Even-Odd:** A point is inside the glyph if it is enclosed by an odd number of contours.

### MSDF-Specific Parameters

These parameters are available only in **MSDF** and **MTSDF** modes.

#### Angle Threshold

Controls the minimum angle (in radians) at which a corner is detected for multi-channel edge coloring.

- **Range:** 0.5 to π (approximately 3.14159)
- **Step:** 0.1
- **Default:** 3 (approximately 171.9°)

Lower values detect more corners, resulting in sharper features but potentially more artifacts.

#### Coloring Strategy

Determines how edges are assigned to color channels:

| Strategy | Description |
| --- | --- |
| **Simple** | Standard edge coloring algorithm. Works well for most fonts. |
| **Ink Trap** | Optimized for fonts with ink traps (common in serif typefaces). |
| **Distance** *(experimental)* | Uses distance-based coloring. May produce better results for certain glyph shapes. |

#### Edge Coloring Seed

A seed value for the edge coloring algorithm's random number generator. Changing this value can sometimes resolve coloring artifacts.

- **Minimum:** 0
- **Step:** 1

#### Error Correction

Controls the post-processing error correction applied to the MSDF output:

| Mode | Description |
| --- | --- |
| **Off** | No error correction. Fastest but may have artifacts. |
| **Edge Priority** | Corrects errors while prioritizing edge accuracy. Recommended for most use cases. |
| **Indiscriminate** | Aggressively corrects all detected errors. May over-correct in some cases. |

## Which SDF Mode Should I Use?

| Mode | Channels | Sharp Corners | Quality | Speed | Best For |
| --- | --- | --- | --- | --- | --- |
| **SDF** | 1 | No | Good | Fast | Simple fonts, large text, UI elements |
| **PSDF** | 1 | No | Good | Medium | Alternative to SDF with font-file precision |
| **MSDF** | 3 (RGB) | Yes | Excellent | Medium | Most game fonts — the industry standard |
| **MTSDF** | 4 (RGBA) | Yes | Best | Slower | High-fidelity fonts needing both sharp corners and smooth AA |

**Recommendation:** Use **MSDF** for most game development. It has the best balance of quality and compatibility. Use **SDF** for simple, large-scale text or when you don't have a font file.

## Exporting SDF Fonts

SDF fonts use the same export workflow as standard bitmap fonts. PNG texture atlases contain the distance field data; the descriptor file contains glyph metrics.

**MSDF** and **MTSDF** modes also support the **MSDF Atlas JSON** format, compatible with msdf-atlas-gen workflows. See [Export Formats](/en/docs/project-management/export-formats/) for all formats.

## Using SDF Fonts in Game Engines

### Unity (TextMeshPro)

TextMeshPro natively supports SDF fonts. Import the PNG texture and BMFont descriptor, then create a TextMeshPro Font Asset. The shader handles distance field rendering automatically.

### Godot

Godot 4 supports SDF rendering through its built-in text pipeline. Import the texture atlas and configure the font resource to use the SDF shader. For MSDF, select the multi-channel distance field option in font import settings.

### Unreal Engine

Unreal Engine supports distance field fonts through Slate UI and UMG. Import the texture and create a font face asset referencing the SDF texture, then configure the material with an SDF-compatible shader.

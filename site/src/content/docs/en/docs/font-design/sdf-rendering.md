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

Signed Distance Field (SDF) rendering is a technique that stores the distance from each pixel to the nearest glyph edge, rather than the glyph's actual pixel color. This allows fonts to be scaled to any size while remaining sharp and crisp — unlike traditional bitmap fonts that become pixelated when scaled up.

SnowB BMF is a **free online** bitmap font generator that supports multiple SDF rendering modes, enabling you to generate high-quality, resolution-independent bitmap fonts directly in your browser.

:::caution
SDF rendering is currently an **experimental** feature. Parameters and behavior may change in future releases.
:::

## What is SDF Rendering?

In a standard bitmap font, each glyph is stored as a rasterized image at a fixed resolution. Scaling this image up results in blurry or pixelated text. SDF solves this problem by encoding each pixel as a distance value — how far that pixel is from the nearest edge of the glyph.

At render time, the game engine uses a shader to reconstruct the glyph outline from these distance values. Because the distance field is smooth and continuous, the resulting text remains sharp at virtually any scale. This technique is widely used in modern game engines like Unity (TextMeshPro), Godot, and Unreal Engine.

## SDF Rendering Modes in SnowB BMF

SnowB BMF provides five rendering modes. The **Default** mode produces standard bitmap fonts, while the other four modes generate different types of distance field textures.

| Mode | Channels | Implementation | Font File Required |
| --- | --- | --- | --- |
| **Default** | RGBA | Standard Canvas rendering | No |
| **SDF** | Single | Felzenszwalb/Huttenlocher EDT (JS) or msdfgen WASM | No (WASM requires font file) |
| **PSDF** | Single | msdfgen WASM | Yes |
| **MSDF** | Multi (RGB) | msdfgen WASM | Yes |
| **MTSDF** | Multi (RGBA) | msdfgen WASM | Yes |

### SDF (Signed Distance Field)

The basic SDF mode generates a single-channel distance field. SnowB BMF offers two pipelines for SDF generation:

- **Pure JavaScript (EDT):** Uses the Felzenszwalb and Huttenlocher Euclidean Distance Transform algorithm. This works without uploading a font file — it processes the Canvas-rendered glyph directly.
- **msdfgen WASM:** When a font file is uploaded, the WASM pipeline can be used instead, producing higher-quality results by working directly with the font's vector outlines.

### PSDF (Pseudo-SDF)

PSDF uses the msdfgen WASM pipeline to generate a pseudo-signed distance field. It produces a single-channel output similar to SDF but uses a different distance calculation method. A font file must be uploaded to use this mode.

### MSDF (Multi-channel SDF)

MSDF encodes distance information across three color channels (RGB), which preserves sharp corners and fine details that single-channel SDF cannot reproduce. This is the most popular distance field format for game development, offering an excellent balance between quality and performance. A font file is required.

### MTSDF (Multi-channel + True SDF)

MTSDF combines the multi-channel approach of MSDF with an additional true SDF channel in the alpha channel. This provides the best of both worlds: sharp corners from MSDF and smooth anti-aliasing from the true SDF. A font file is required.

## How to Generate SDF Fonts

### 1. Upload a Font File

For PSDF, MSDF, and MTSDF modes, you must first upload a TrueType (.ttf) or OpenType (.otf) font file. Go to **Font Import** and load your font.

> SDF mode can work without a font file using the pure JavaScript EDT pipeline, but uploading a font file enables the higher-quality WASM pipeline.

### 2. Select a Rendering Mode

In the **Font Config** panel on the left sidebar, find the **Render Config** section (marked as *Experimental*). Select your desired rendering mode from the dropdown.

### 3. Configure Parameters

Adjust the rendering parameters to suit your needs. See the [Configuration Parameters](#configuration-parameters) section below for detailed explanations.

### 4. Export Your Font

Once satisfied with the preview, export your font using the standard export workflow. SDF fonts are exported as PNG texture atlases with the corresponding BMFont descriptor file. For MSDF/MTSDF, an additional MSDF Atlas JSON format is available — see [Export Formats](/en/docs/project-management/export-formats/) for details.

## Configuration Parameters

### Distance Range

The distance range defines how far (in pixels) the distance field extends from the glyph edge. A larger range produces smoother scaling but requires more padding around each glyph.

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

Enables handling of overlapping contours in the font glyphs. Turn this on if your font contains glyphs with self-overlapping paths — this is common in complex scripts and decorative fonts.

#### Scanline Pass

Enables an additional scanline-based correction pass to fix potential artifacts in the distance field output.

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

**General recommendation:** Use **MSDF** for most game development scenarios. It provides the best balance of quality and compatibility. Use **SDF** if you only need simple, large-scale text rendering or if you do not have a font file to upload.

## Exporting SDF Fonts

SDF fonts are exported using the same workflow as standard bitmap fonts. The texture atlases (PNG) contain the distance field data, and the descriptor file contains the glyph metrics.

For **MSDF** and **MTSDF** modes, SnowB BMF also supports the **MSDF Atlas JSON** export format, which is compatible with msdf-atlas-gen-based workflows. See [Export Formats](/en/docs/project-management/export-formats/) for all available formats.

## Using SDF Fonts in Game Engines

### Unity (TextMeshPro)

TextMeshPro natively supports SDF fonts. Import the exported PNG texture and BMFont descriptor into your Unity project, then create a TextMeshPro Font Asset from the imported data. TextMeshPro's shader will handle the distance field rendering automatically.

### Godot

Godot 4 supports SDF font rendering through its built-in text rendering pipeline. Import the SDF texture atlas and configure the font resource to use the SDF shader. For MSDF fonts, ensure you select the multi-channel distance field option in the font import settings.

### Unreal Engine

Unreal Engine supports distance field fonts through its Slate UI framework and UMG. Import the exported texture and create a font face asset that references the SDF texture. Configure the material to use an SDF-compatible shader for proper rendering.

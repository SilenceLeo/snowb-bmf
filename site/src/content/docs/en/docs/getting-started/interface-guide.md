---
title: "Interface Guide: Navigate the SnowB BMF Workspace"
description: Complete guide to the SnowB BMF user interface. Try it free — no download required.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF Interface Guide"
  "headline": "Complete Guide to the SnowB BMF User Interface"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Comprehensive documentation covering all interface elements and functions of SnowB BMF, including the three-panel layout, font configuration options, preview area, and style settings."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "Browser-based bitmap font generator for game development"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "User Interface Documentation"
  "keywords": ["SnowB BMF interface", "bitmap font generator UI", "font configuration", "texture atlas preview", "style settings", "user interface guide", "software documentation"]
  "audience":
    "@type": "Audience"
    "audienceType": ["Developers", "Game Developers", "Font Designers", "Digital Artists"]
  "inLanguage": "en"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "teaches":
    - "How to navigate the SnowB BMF interface"
    - "Understanding the three-panel layout"
    - "Font configuration options"
    - "Preview area functionality"
    - "Style and effects configuration"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
---

The interface has three panels: **Font Configuration** (left), **Preview Area** (center), and **Style Configuration** (right). Here is what each panel does.

![SnowB BMF Interface Overview](~/assets/interface-overview.png)

## Main Interface Layout

### Top Menu Bar

The top menu provides core file operations:

- **New** - Create a new bitmap font project
- **Open** - Load existing project files (.sbf or .ltr formats)
- **Save** - Save your current project
- **Export** - Export bitmap fonts and texture atlases

The project name is displayed in the center (shows "Unnamed" for new projects).

### Three-Panel Layout

The interface is organized into three sections.

## Left Panel - Font Configuration

Font settings and layout options live here:

- **Font Family**: Upload font files (TTF, OTF, WOFF formats)
- **Font Size & Line Height**: Control glyph size and vertical spacing
- **Sharp**: Adjust font rendering sharpness for crisp or soft edges
- **Layout Settings**: Configure padding, spacing, and texture atlas organization
- **Auto Pack**: Enable automatic texture optimization for efficient space usage
- **Size Controls**: Set maximum width and choose between fixed or dynamic texture sizing
- **Global Metric Adjustments**: Fine-tune character positioning with xAdvance, xOffset, and yOffset controls

## Center Panel - Preview Area

Real-time preview of your bitmap font:

- **Texture Atlas Display**: Shows all generated glyphs packed efficiently with transparent background (checkered pattern)
- **Size Information**: Displays current texture dimensions (e.g., "439 x 439")
- **Preview Controls**: Zoom slider for detailed inspection and fullscreen toggle
- **Image Glyph Support**: Add custom image glyphs via "SELECT IMAGES" button
- **Real-time Updates**: Changes show up immediately when you adjust settings

## Right Panel - Style Configuration

Style your font glyphs here:

- **Fill Options**: Choose between solid colors, gradients, or texture-based fills with color picker
- **Stroke Settings**: Add outlines with customizable width, type (outer/inner/center), line caps, and joins
- **Shadow Effects**: Apply drop shadows with adjustable offset, blur, and styling options
- **Style Types**: Each effect supports solid, gradient, or image-based styling
- **Toggle Controls**: On/off switches for stroke and shadow effects

## Next Steps

See the [Workflow Guide](../workflow-guide/) for step-by-step instructions on creating and exporting your first bitmap font.

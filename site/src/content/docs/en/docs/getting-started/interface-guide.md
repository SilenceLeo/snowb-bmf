---
title: Interface Guide
description: Complete guide to the SnowB BMF user interface.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF Interface Guide"
  "headline": "Complete Guide to the SnowB BMF User Interface"
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
  "educationalLevel": "Beginner to Intermediate"
  "learningResourceType": "User Guide"
  "inLanguage": "en-US"
  "image": "https://user-images.githubusercontent.com/4632034/89119353-85c0f680-d4e0-11ea-88ae-978dfc01d5fc.png"
  "mainEntity":
    "@type": "UserInterface"
    "name": "SnowB BMF Main Interface"
    "description": "Three-panel interface layout for bitmap font generation"
  "teaches":
    - "How to navigate the SnowB BMF interface"
    - "Understanding the three-panel layout"
    - "Font configuration options"
    - "Preview area functionality"
    - "Style and effects configuration"
  "hasPart":
    - "@type": "Article"
      "name": "Left Panel - Font Configuration"
      "description": "Core font settings and layout options"
    - "@type": "Article"
      "name": "Center Panel - Preview Area"
      "description": "Real-time texture atlas display and controls"
    - "@type": "Article"
      "name": "Right Panel - Style Configuration"
      "description": "Visual styling options for font glyphs"
---

SnowB BMF features a clean, intuitive interface divided into three main panels: Font Configuration (left), Preview Area (center), and Style Configuration (right). This guide covers all interface elements and their functions.

![SnowB BMF Interface Overview](~/assets/interface-overview.png)

## Main Interface Layout

### Top Menu Bar

The top menu provides essential file operations:

- **New** - Create a new bitmap font project
- **Open** - Load existing project files (.sbf or .ltr formats)
- **Save** - Save your current project
- **Export** - Export bitmap fonts and texture atlases

The project name is displayed in the center (shows "Unnamed" for new projects).

### Three-Panel Layout

The interface is organized into three main sections for efficient workflow management.

## Left Panel - Font Configuration

The left panel manages core font settings and layout options:

- **Font Family**: Upload font files (TTF, OTF, WOFF formats)
- **Font Size & Line Height**: Control glyph size and vertical spacing
- **Sharp**: Adjust font rendering sharpness for crisp or soft edges
- **Layout Settings**: Configure padding, spacing, and texture atlas organization
- **Auto Pack**: Enable automatic texture optimization for efficient space usage
- **Size Controls**: Set maximum width and choose between fixed or dynamic texture sizing
- **Global Metric Adjustments**: Fine-tune character positioning with xAdvance, xOffset, and yOffset controls

## Center Panel - Preview Area

The center panel provides real-time preview of your bitmap font:

- **Texture Atlas Display**: Shows all generated glyphs packed efficiently with transparent background (checkered pattern)
- **Size Information**: Displays current texture dimensions (e.g., "439 x 439")
- **Preview Controls**: Zoom slider for detailed inspection and fullscreen toggle
- **Image Glyph Support**: Add custom image glyphs via "SELECT IMAGES" button
- **Real-time Updates**: Changes reflect immediately when adjusting settings

## Right Panel - Style Configuration

The right panel controls the visual styling of your font glyphs:

- **Fill Options**: Choose between solid colors, gradients, or texture-based fills with color picker
- **Stroke Settings**: Add outlines with customizable width, type (outer/inner/center), line caps, and joins
- **Shadow Effects**: Apply drop shadows with adjustable offset, blur, and styling options
- **Style Types**: Each effect supports solid, gradient, or image-based styling
- **Toggle Controls**: Easy on/off switches for stroke and shadow effects

## Next Steps

Now that you're familiar with the interface, check out the [Workflow Guide](../workflow-guide/) for step-by-step instructions on creating your first bitmap font and optimizing it for your specific use case.

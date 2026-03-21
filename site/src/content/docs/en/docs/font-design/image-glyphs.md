---
title: Using Image Glyphs in Your Bitmap Font
description: Add custom images, icons, and symbols as glyphs in your bitmap font. Learn how to import, manage, and optimize image glyphs for game and app development.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Using Image Glyphs in Your Bitmap Font"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Add custom images, icons, and symbols as glyphs in your bitmap font. Learn how to import, manage, and optimize image glyphs for game and app development."
  "about":
    "@type": "Thing"
    "name": "Image Glyphs"
    "description": "Custom image integration feature for bitmap font creation"
  "keywords": ["image glyphs", "bitmap font", "font design", "icons", "symbols", "texture atlas", "game development", "SnowB BMF", "glyph mapping", "character assignment", "drag drop", "fullscreen", "IME support", "batch upload"]
  "audience":
    "@type": "Audience"
    "audienceType": "Developers"
  "inLanguage": "en"
  "teaches": ["How to add image glyphs to bitmap fonts", "Character mapping for image glyphs", "Image glyph optimization", "Texture atlas integration"]
  "mainEntity":
    "@type": "HowTo"
    "name": "Add Image Glyphs to Bitmap Font"
    "description": "Step-by-step guide to integrate custom images as glyphs in bitmap fonts"
    "step":
      - "@type": "HowToStep"
        "name": "Import Images"
        "text": "Select or drag-and-drop image files into the image area"
      - "@type": "HowToStep"
        "name": "Drag and Drop Images"
        "text": "Drag one or multiple image files directly onto the image glyph panel to add them in batch"
      - "@type": "HowToStep"
        "name": "Assign Characters"
        "text": "Map each image to a character for easy use in your font, with full IME support for CJK input"
      - "@type": "HowToStep"
        "name": "Manage Glyphs"
        "text": "Enable/disable images using checkboxes and organize your image glyph collection"
      - "@type": "HowToStep"
        "name": "Adjust Metrics"
        "text": "Fine-tune xAdvance, xOffset, and yOffset for each image glyph in Preview mode"
      - "@type": "HowToStep"
        "name": "Export Font"
        "text": "Export your project — all enabled image glyphs are automatically included in the texture atlas and descriptor file"
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
    "@id": "https://snowb.org/en/docs/font-design/image-glyphs/"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
---

Image glyphs allow you to add custom images like **icons, symbols, or logos** directly into your bitmap font. This is perfect for games and applications that require unique visual elements not found in standard fonts.

![Image Glyphs Interface](~/assets/image-glyphs.png)

## How to Add Image Glyphs

Adding images is straightforward. You can either drag and drop them into the workspace or use the "Select Images" button.

1.  **Select or Drag-and-Drop** your image files into the image area.
2.  The tool automatically processes them and adds them to your image glyph list.
3.  **Assign a character** to each image for easy use.

When you add an image, it's automatically optimized by trimming transparent pixels to save space in the texture atlas.

### Drag-and-Drop Upload

You can drag one or multiple image files directly onto the image glyph panel. The panel accepts any standard image format and will filter out non-image files automatically. This is the fastest way to add many images at once.

### Batch Selection

Click the **"Select Images"** button to open a file picker. The file picker supports multi-selection (`accept="image/*"`), so you can choose several images in one go.

### Supported Image Formats

For best results, use formats that support transparency:

-   **PNG:** Recommended for images with transparency.
-   **JPG/JPEG:** Suitable for solid, rectangular images.

## Panel Interactions

The image glyph panel provides several interaction features to improve your workflow.

### Collapsible Panel

The image glyph list is wrapped in an accordion-style collapsible section. Click the panel header to expand or collapse the list. When in fullscreen mode, the panel remains expanded.

### Fullscreen Mode

Click the fullscreen toggle button (in the panel header) to expand the image glyph panel to fill the entire screen. This is useful when managing a large collection of image glyphs.

-   **Enter fullscreen:** Click the fullscreen icon in the panel header.
-   **Exit fullscreen:** Click the exit-fullscreen icon, or press **Escape** to return to the normal view.

## Managing and Assigning Characters

Once added, you can manage each image glyph individually.

### Character Mapping

To use an image glyph, you must map it to a character:

-   Click the text input field below any image thumbnail.
-   Type a single character (e.g., `A`, `!`, or any Unicode symbol).
-   This character now represents your image glyph.

**Note:** Each character can only map to one image. Assigning a character that's already in use (either by another image or a text glyph) will override the previous one. Image glyphs have priority over text glyphs.

### IME Compatibility

The character input field fully supports Input Method Editors (IME) for CJK (Chinese, Japanese, Korean) and other complex scripts. During an active composition session, the input only updates locally; the character mapping is committed once composition ends. This prevents partial or garbled characters from being assigned.

### Selection Control

Each image glyph thumbnail has a **checkbox** in the top-left corner:

-   **Checked (enabled):** The image is included in the final texture atlas and font descriptor.
-   **Unchecked (disabled):** The image is excluded from packing and export.

Use this to quickly toggle individual images without removing them from your project.

### Organizing Your Image Glyphs

-   **Enable/Disable:** Use the checkbox on each thumbnail to include or exclude an image from the final font atlas.
-   **Delete:** Click the delete icon on any thumbnail to remove it from the project.
-   **Preview:** The interface provides real-time visual feedback.

## Metric Adjustment in Preview Mode

Image glyphs support individual metric adjustment in Preview mode, using the same interface as text glyphs. When you select an image glyph character in the preview, you can fine-tune:

-   **xAdvance:** Controls the horizontal distance to the next character.
-   **xOffset:** Shifts the image horizontally within its character cell.
-   **yOffset:** Shifts the image vertically within its character cell.

This allows precise positioning of image glyphs alongside text for a polished result.

## Integration with the Font Atlas

Image glyphs are treated like any other character and are packed into the same texture atlas alongside your text glyphs.

-   **Seamless Packing:** Images and text are arranged together efficiently to minimize texture size.
-   **Override Priority:** If an image glyph is mapped to the same character as a text glyph (e.g., 'A'), the **image glyph will be used**.
-   **Consistent Metrics:** Spacing and layout rules are applied consistently for all glyphs.

## Best Practices for Performance and Quality

To get the most out of image glyphs, follow these tips:

### Image Preparation
-   **Use Transparent Backgrounds:** This ensures your images blend seamlessly.
-   **Use Consistent Padding:** Since image glyphs don't have a baseline for alignment, it's best to use images with equal top and bottom transparent padding to ensure vertical consistency.
-   **Optimize File Size:** Compress images before importing to improve performance.
-   **Maintain a Consistent Style:** Match the visual theme of your font for a professional look.
-   **Choose Appropriate Resolution:** Use resolutions that match your target font size to avoid scaling issues.

### Character Mapping & Performance
-   **Use Logical Mappings:** Assign intuitive characters to your images.
-   **Avoid Character Conflicts:** Be mindful not to override essential text characters unless intended.
-   **Limit Image Count and Size:** A large number of high-resolution images can increase texture memory usage and loading times.

## Exporting Your Font

When you export your project, all enabled image glyphs are included automatically.

-   **Texture Atlas:** Images are rendered into the final texture sheet(s).
-   **Font Data Files:** The character mappings and metrics for your image glyphs are saved in the font descriptor file (`.fnt`, `.xml`, etc.).
-   **Full Compatibility:** Works with all supported export formats.

## Related Topics

- [Character Sets](/en/docs/font-design/character-sets/)
- [Export Formats](/en/docs/project-management/export-formats/)

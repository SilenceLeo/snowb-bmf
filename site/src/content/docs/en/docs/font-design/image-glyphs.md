---
title: Using Image Glyphs in Your Bitmap Font
description: Add custom images, icons, and symbols as glyphs in your bitmap font. Learn how to import, manage, and optimize image glyphs for game and app development.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Using Image Glyphs in Your Bitmap Font"
  "description": "Add custom images, icons, and symbols as glyphs in your bitmap font. Learn how to import, manage, and optimize image glyphs for game and app development."
  "about":
    "@type": "SoftwareFeature"
    "name": "Image Glyphs"
    "description": "Custom image integration feature for bitmap font creation"
  "applicationCategory": "Font Design"
  "keywords": ["image glyphs", "bitmap font", "font design", "icons", "symbols", "texture atlas", "game development", "SnowB BMF", "glyph mapping", "character assignment"]
  "audience":
    "@type": "Audience"
    "audienceType": "Developers"
    "geographicArea": "Global"
  "educationalLevel": "Intermediate"
  "proficiencyRequired": "Basic font design knowledge"
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
        "name": "Assign Characters"
        "text": "Map each image to a character for easy use in your font"
      - "@type": "HowToStep"
        "name": "Manage Glyphs"
        "text": "Enable/disable images and organize your image glyph collection"
  "isPartOf":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
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

### Supported Image Formats

For best results, use formats that support transparency:

-   **PNG:** Recommended for images with transparency.
-   **JPG/JPEG:** Suitable for solid, rectangular images.

## Managing and Assigning Characters

Once added, you can manage each image glyph individually.

### Character Mapping

To use an image glyph, you must map it to a character:

-   Click the text input field below any image thumbnail.
-   Type a single character (e.g., `A`, `!`, or any Unicode symbol).
-   This character now represents your image glyph.

**Note:** Each character can only map to one image. Assigning a character that's already in use (either by another image or a text glyph) will override the previous one. Image glyphs have priority over text glyphs.

### Organizing Your Image Glyphs

-   **Enable/Disable:** Use the checkbox on each thumbnail to include or exclude an image from the final font atlas.
-   **Preview:** The interface provides real-time visual feedback.

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
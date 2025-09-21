---
title: FAQ
description: Find answers to frequently asked questions about SnowB BMF, the free web-based bitmap font generator. Learn about supported formats, performance, and more.
---

## General

### What is SnowB BMF?

SnowB BMF is a free, web-based bitmap font generator. It allows you to create, edit, and export custom bitmap fonts for games, web, and other applications right from your browser.

### Is SnowB BMF free?

Yes, SnowB BMF is completely free to use. All features are available without registration or installation.

### Which browsers are supported?

SnowB BMF runs on modern browsers that support the Canvas API, including the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using an up-to-date browser.

## Project Management

### How do I save my work?

To save your project, click the "Save" button to download a `.sbf` project file. SnowB BMF does not save your work automatically, so be sure to save frequently.

### I lost my work after refreshing the page. How can I prevent this?

The application does not store data in your browser, so work is lost upon refreshing or closing the tab. Always save your project to a `.sbf` file to prevent data loss.

### Can I work on multiple projects at once?

You can open different projects in multiple browser tabs. Each tab maintains its own independent state. Just be sure to save each project to its own `.sbf` file.

## Font Formats & Exporting

### What formats can I export my fonts in?

SnowB BMF supports three formats:
-   **Text (.fnt, .txt):** Human-readable and widely supported by engines like Unity, Unreal, and Cocos2d-x.
-   **XML (.xml, .fnt):** A structured format ideal for web applications or custom parsers.
-   **Binary (.fnt):** The most compact and performant format, perfect for optimizing file size.

### Which export format is best for my game engine?

-   **Unity/Unreal/Cocos2d-x:** Use the **Text (.fnt)** format.
-   **Custom Engines:** Any format will work, but **Binary (.fnt)** offers the best performance.

### Are exported fonts compatible with Unity?

Yes, the `.fnt` files work with TextMeshPro and NGUI. For sharp, pixel-perfect rendering, set the texture's filter mode to "Point" (or "Nearest") in Unity.

## Font Quality & Rendering

### Why does my font look blurry?

Blurriness is often caused by texture filtering. To fix this, set the texture filter mode to "Point" or "Nearest" in your game engine or application. Also, ensure your text is rendered at integer positions without scaling.

### How can I fix incorrect character spacing?

Incorrect spacing can result from kerning issues or incorrect font metrics. Review your kerning pairs and baseline settings in SnowB BMF before exporting.

### How do I create a pixel-perfect font?

For a crisp, pixel-perfect look:
1.  Use a font designed for pixel art.
2.  Set the font size to match your target resolution exactly.
3.  Disable anti-aliasing and font smoothing.
4.  Ensure characters are aligned to the pixel grid.

## Performance

### Why is the app running slowly or freezing?

Performance issues can occur with very large character sets or complex fonts. To improve performance:
-   **Reduce the character set:** Only include the glyphs you need.
-   **Increase texture size:** A larger texture atlas can reduce the complexity of the packing algorithm.
-   **Close other browser tabs:** Free up system memory.

### I'm getting an "out of memory" error. What should I do?

This happens when generating very large font atlases. Try one of the following solutions:
-   **Reduce texture dimensions.**
-   **Split your character set** into multiple, smaller font files.
-   **Use the Binary export format,** which is more memory-efficient.

## Importing & Customization

### Can I import my own fonts?

Yes, you can upload `.ttf`, `.otf`, and `.woff` font files. However, SnowB BMF cannot access fonts installed on your system directly.

### How do I use custom images as characters?

1.  Import PNG images with transparency.
2.  Assign a Unicode value to each image.
3.  Adjust the position and scale of each image glyph as needed.
4.  Export the font. The image glyphs will be included in the atlas.

### What happens when I import a legacy project file?

SnowB BMF automatically converts legacy project files. Simply open the file, review the imported settings to ensure they are correct, and then save the project as a new `.sbf` file.
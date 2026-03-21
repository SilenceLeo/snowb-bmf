---
title: "FAQ: Common Questions About SnowB BMF Bitmap Font Generator"
description: Find answers to frequently asked questions about SnowB BMF, the free web-based bitmap font generator. Learn about supported formats, performance, and more.
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "name": "SnowB BMF - Frequently Asked Questions"
  "description": "Comprehensive FAQ for SnowB BMF, the free web-based bitmap font generator. Get answers about features, compatibility, performance, and troubleshooting."
  "url": "https://snowb.org/en/docs/faq/"
  "inLanguage": "en"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "mainEntity":
    - "@type": "Question"
      "name": "What is SnowB BMF?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF is a free, web-based bitmap font generator. It allows you to create, edit, and export custom bitmap fonts for games, web, and other applications right from your browser."
    - "@type": "Question"
      "name": "Is SnowB BMF free?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, SnowB BMF is completely free to use. All features are available without registration or installation."
    - "@type": "Question"
      "name": "Which browsers are supported?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF runs on modern browsers that support the Canvas API, including the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using an up-to-date browser."
    - "@type": "Question"
      "name": "How do I save my work?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF automatically saves your projects to the browser's IndexedDB storage whenever you navigate away or close the tab. However, for maximum safety, we recommend also manually saving your project by clicking the 'Save' button to download a .sbf project file. This ensures you have a portable backup that works across different browsers and devices."
    - "@type": "Question"
      "name": "I lost my work after refreshing the page. How can I prevent this?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF uses IndexedDB for automatic persistence, so refreshing the page should not cause data loss under normal circumstances. If your work is missing, it may be because your browser's storage was cleared (e.g., via 'Clear browsing data') or you are using a private/incognito window. To protect against data loss, always keep a .sbf backup file."
    - "@type": "Question"
      "name": "Can I work on multiple projects at once?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes! SnowB BMF has a built-in multi-project workspace with a tabbed interface. You can create, open, and switch between multiple projects within a single browser tab. Click the 'New' button or double-click the empty area in the tab bar to create a new project. All projects are automatically saved to IndexedDB."
    - "@type": "Question"
      "name": "What formats can I export my fonts in?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF supports six export formats: Text (.fnt, .txt) for maximum engine compatibility; XML (.xml, .fnt) for structured data; Binary (.fnt) for compact size; JSON (.json) for web applications and custom parsers; C Header (.c) for embedded systems and MCUs with 8 pixel format options; and MSDF Atlas JSON (.json) for msdf-atlas-gen compatible MSDF shader pipelines."
    - "@type": "Question"
      "name": "Which export format is best for my game engine?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "For Unity/Unreal/Cocos2d-x, use the Text (.fnt) format. For custom engines, any format will work, but Binary (.fnt) offers the best performance."
    - "@type": "Question"
      "name": "Are exported fonts compatible with Unity?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, the .fnt files work with TextMeshPro and NGUI. For sharp, pixel-perfect rendering, set the texture's filter mode to 'Point' (or 'Nearest') in Unity."
    - "@type": "Question"
      "name": "Why does my font look blurry?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Blurriness is often caused by texture filtering. To fix this, set the texture filter mode to 'Point' or 'Nearest' in your game engine or application. Also, ensure your text is rendered at integer positions without scaling."
    - "@type": "Question"
      "name": "How can I fix incorrect character spacing?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Incorrect spacing can result from kerning issues or incorrect font metrics. Review your kerning pairs and baseline settings in SnowB BMF before exporting."
    - "@type": "Question"
      "name": "How do I create a pixel-perfect font?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "For a crisp, pixel-perfect look: 1) Use a font designed for pixel art, 2) Set the font size to match your target resolution exactly, 3) Disable anti-aliasing and font smoothing, 4) Ensure characters are aligned to the pixel grid."
    - "@type": "Question"
      "name": "Why is the app running slowly or freezing?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Performance issues can occur with very large character sets or complex fonts. To improve performance: reduce the character set to only include needed glyphs, increase texture size for less complex packing algorithms, and close other browser tabs to free up memory."
    - "@type": "Question"
      "name": "I'm getting an 'out of memory' error. What should I do?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "This happens when generating very large font atlases. Try reducing texture dimensions, splitting your character set into multiple smaller font files, or using the Binary export format which is more memory-efficient."
    - "@type": "Question"
      "name": "Can I import my own fonts?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, you can upload .ttf, .otf, and .woff font files. However, SnowB BMF cannot access fonts installed on your system directly."
    - "@type": "Question"
      "name": "How do I use custom images as characters?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "1) Import PNG images with transparency, 2) Assign a Unicode value to each image, 3) Adjust the position and scale of each image glyph as needed, 4) Export the font. The image glyphs will be included in the atlas."
    - "@type": "Question"
      "name": "What happens when I import a legacy project file?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF automatically converts legacy project files. Simply open the file, review the imported settings to ensure they are correct, and then save the project as a new .sbf file."
    - "@type": "Question"
      "name": "Does SnowB BMF support SDF/MSDF fonts?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, SnowB BMF supports five rendering modes as an experimental feature: Default (standard canvas rendering), SDF (Signed Distance Field using Felzenszwalb EDT), PSDF (Pseudo-SDF via msdfgen WASM), MSDF (Multi-channel SDF via msdfgen WASM), and MTSDF (Multi-channel + True SDF via msdfgen WASM). SDF fonts are resolution-independent and ideal for game engines. Note: PSDF, MSDF, and MTSDF modes require uploading a font file first. See the SDF Rendering documentation for details."
    - "@type": "Question"
      "name": "What are gradient presets?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF includes 10 built-in gradient presets that you can apply with one click. You can also save your custom gradients as presets for reuse across projects, and delete presets you no longer need. Find the preset selector in the gradient section of the Fill settings panel."
    - "@type": "Question"
      "name": "How does auto-save work?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF automatically saves all your projects to the browser's IndexedDB storage. This happens when you navigate away from the page (beforeunload event) and when the tab loses visibility (visibilitychange event). Your projects are stored as Protocol Buffer encoded data for efficiency. Note: clearing browser data will delete saved projects, so always keep .sbf file backups."
    - "@type": "Question"
      "name": "What is the xFractional setting?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "The xFractional setting is an experimental feature that enables sub-pixel precision for glyph metrics by using fixed-point number format. When enabled, xAdvance, xOffset, and other metrics use fractional values stored as fixed-point numbers, providing smoother text rendering at small sizes. This is an advanced option—most users do not need to change it."
    - "@type": "Question"
      "name": "What is the Inner Shadow feature?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "The Inner Shadow feature renders shadows inside glyph boundaries, creating engraved or embossed effects. It can be used simultaneously with outer shadows for multi-layer depth and dimension in your bitmap fonts. Configure color, blur, offset, and opacity in the Shadow settings panel."
    - "@type": "Question"
      "name": "Does SnowB BMF support variable fonts?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, SnowB BMF automatically detects variable fonts when you import TTF/OTF/WOFF files and displays variation axis controls (weight, width, italic, and custom axes). Adjust each axis with real-time sliders to fine-tune your font's appearance before generating the bitmap."
    - "@type": "Question"
      "name": "Can I import TTC (TrueType Collection) files?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, when you import a TTC file, SnowB BMF automatically detects it and displays a font selection dialog. You can choose one or multiple fonts from the collection to import into your project."
    - "@type": "Question"
      "name": "What is Ordered Grid packing?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Ordered Grid is the third texture packing mode alongside Auto and Fixed. It arranges glyphs in ordered rows and columns with a configurable column count, producing predictable grid-based texture atlas layouts ideal for certain game engine requirements."
    - "@type": "Question"
      "name": "Does SnowB BMF work offline?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "Yes, SnowB BMF is a Progressive Web App (PWA) that supports full offline functionality. Once loaded, you can install it for a native-like experience and create fonts without an internet connection. The app automatically checks for updates when you go back online."
    - "@type": "Question"
      "name": "Where can I find keyboard shortcuts?"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "See the Keyboard Shortcuts documentation page for a full list. Key shortcuts include Space+drag to pan the canvas, Ctrl+scroll wheel to zoom in/out, and various navigation shortcuts for efficient font editing workflows."
---

## General

### What is SnowB BMF?

SnowB BMF is a free, web-based bitmap font generator. You can create, edit, and export custom bitmap fonts for games, web, and other applications directly in your browser.

### Is SnowB BMF free?

Yes. All features are available without registration or installation.

### Which browsers are supported?

Any modern browser with Canvas API support: Chrome, Firefox, Safari, and Edge (latest versions). For the best experience, keep your browser up to date.

## Project Management

### How do I save my work?

Projects auto-save to IndexedDB when you navigate away or close the tab. For backup, click "Save" to download a `.sbf` file. That file works across browsers and devices. See [Project Management](/en/docs/project-management/project-operations/) for details.

### I lost my work after refreshing the page. How can I prevent this?

Refreshing should not cause data loss because IndexedDB persists automatically. If work is missing, check whether browser storage was cleared ("Clear browsing data") or you were in a private/incognito window. Always keep a `.sbf` backup file.

### Can I work on multiple projects at once?

Yes. The tabbed workspace lets you create, open, and switch between multiple projects in a single browser tab. Click "New" or double-click the empty tab bar area to add a project. All projects auto-save to IndexedDB. See [Project Management](/en/docs/project-management/project-operations/) for details.

## Font Formats & Exporting

### What formats can I export my fonts in?

SnowB BMF supports six export formats:
-   **Text (.fnt, .txt):** Widest engine compatibility. Works with Unity, Unreal, and Cocos2d-x.
-   **XML (.xml, .fnt):** Structured format, good for web applications or custom parsers.
-   **Binary (.fnt):** Most compact and fastest to load.
-   **JSON (.json):** For web applications and custom parsers.
-   **C Header (.c):** For embedded systems and MCUs with 8 pixel format options.
-   **MSDF Atlas JSON (.json):** For msdf-atlas-gen compatible MSDF shader pipelines.

See [Export Formats](/en/docs/project-management/export-formats/) for full documentation.

### Which export format is best for my game engine?

-   **Unity/Unreal/Cocos2d-x:** Use the **Text (.fnt)** format.
-   **Custom Engines:** Any format will work, but **Binary (.fnt)** offers the best performance.

See [Export Formats](/en/docs/project-management/export-formats/) for a complete comparison.

### Are exported fonts compatible with Unity?

Yes, the `.fnt` files work with TextMeshPro and NGUI. For sharp, pixel-perfect rendering, set the texture's filter mode to "Point" (or "Nearest") in Unity.

## Font Quality & Rendering

### Why does my font look blurry?

Usually caused by texture filtering. Set the filter mode to "Point" or "Nearest" in your game engine, and render text at integer positions without scaling. See [Sharp Rendering](/en/docs/font-design/sharp/) for anti-aliasing tips.

### How can I fix incorrect character spacing?

Check kerning pairs and baseline settings before exporting. See [Kerning Pairs](/en/docs/font-design/kerning-pairs/) and [Glyph Metrics](/en/docs/font-design/glyph-metrics/) for adjustment details.

### How do I create a pixel-perfect font?

For a crisp, pixel-perfect look:
1.  Use a font designed for pixel art.
2.  Set the font size to match your target resolution exactly.
3.  Disable anti-aliasing and font smoothing.
4.  Ensure characters are aligned to the pixel grid.

See [Sharp Rendering](/en/docs/font-design/sharp/) and [Font Size](/en/docs/font-design/font-size/) for more tips.

## Performance

### Why is the app running slowly or freezing?

Large character sets or complex fonts can cause slowdowns. To fix:
-   **Reduce the character set** to only needed glyphs.
-   **Increase texture size**, which reduces packing algorithm complexity.
-   **Close other browser tabs** to free memory.

See [Texture Packing](/en/docs/font-design/texture-packing/) and [Character Sets](/en/docs/font-design/character-sets/) for optimization tips.

### I'm getting an "out of memory" error. What should I do?

This happens with very large font atlases. Solutions:
-   **Reduce texture dimensions.**
-   **Split your character set** into multiple, smaller font files.
-   **Use the Binary export format,** which is more memory-efficient.

## Importing & Customization

### Can I import my own fonts?

Yes, upload `.ttf`, `.otf`, and `.woff` files. SnowB BMF cannot access system-installed fonts. See [Font Import](/en/docs/font-design/font-import/) for details.

### How do I use custom images as characters?

1.  Import PNG images with transparency.
2.  Assign a Unicode value to each image.
3.  Adjust the position and scale of each image glyph as needed.
4.  Export the font. The image glyphs will be included in the atlas.

See [Image Glyphs](/en/docs/font-design/image-glyphs/) for a detailed guide.

### What happens when I import a legacy project file?

SnowB BMF converts legacy files automatically. Open the file, review the imported settings, and save as a new `.sbf` file.

## New Features

### Does SnowB BMF support SDF/MSDF fonts?

Yes, as an experimental feature. Five rendering modes are available: **Default** (standard canvas rendering), **SDF** (Signed Distance Field using Felzenszwalb EDT), **PSDF** (Pseudo-SDF via msdfgen WASM), **MSDF** (Multi-channel SDF via msdfgen WASM), and **MTSDF** (Multi-channel + True SDF via msdfgen WASM). SDF fonts are resolution-independent, which makes them a good fit for game engines. Note: PSDF, MSDF, and MTSDF modes require uploading a font file first. See the [SDF Rendering documentation](/en/docs/font-design/sdf-rendering/) for details.

### What are gradient presets?

SnowB BMF includes 10 built-in gradient presets that you can apply with one click. You can also save your custom gradients as presets for reuse across projects, and delete presets you no longer need. Find the preset selector in the gradient section of the Fill settings panel. See [Fill Styles](/en/docs/font-design/fill-styles/) for gradient configuration.

### What is the Inner Shadow feature?

Inner Shadow renders shadows inside glyph boundaries, creating engraved or embossed effects. You can use it together with outer shadows for layered depth. Configure color, blur, offset, and opacity in the Shadow settings panel. See [Inner Shadow Effects](/en/docs/font-design/inner-shadow-effects/) for details.

### Does SnowB BMF support variable fonts?

Yes. Import a variable TTF/OTF/WOFF file and you will see axis controls (weight, width, italic, custom axes) with real-time sliders. See [Variable Fonts](/en/docs/font-design/variable-fonts/) for details.

### Can I import TTC (TrueType Collection) files?

Yes. Import a TTC file and a dialog lets you pick one or more fonts from the collection. See [Font Import](/en/docs/font-design/font-import/) for details.

### What is Ordered Grid packing?

A third packing mode alongside Auto and Fixed. It arranges glyphs in rows and columns with a configurable column count, giving you predictable grid-based layouts. See [Texture Packing](/en/docs/font-design/texture-packing/) for details.

### Does SnowB BMF work offline?

Yes. As a PWA, it works fully offline after the first load. Install it for a native-like experience. Updates are detected automatically when you reconnect. See [PWA & Offline](/en/docs/project-management/pwa-offline/) for details.

### Where can I find keyboard shortcuts?

See [Keyboard Shortcuts](/en/docs/getting-started/keyboard-shortcuts/) for the full list. Key shortcuts: Space+drag to pan, Ctrl+scroll to zoom, plus navigation shortcuts for faster editing.

## Data & Storage

### How does auto-save work?

Projects save to IndexedDB on `beforeunload` (page navigation) and `visibilitychange` (tab switch), stored as Protocol Buffer encoded data. Clearing browser data deletes saved projects, so always keep `.sbf` backups. See [Project Management](/en/docs/project-management/project-operations/) for details.

### What is the xFractional setting?

An experimental feature that enables sub-pixel precision for glyph metrics using fixed-point numbers. When enabled, xAdvance, xOffset, and other metrics store fractional values for smoother text rendering at small sizes. Most users do not need to change this setting.

---
title: "Project Management: Create, Save, and Organize Font Projects"
description: Learn how to create, open, save, and manage your bitmap font projects. Efficiently handle multiple projects and understand the supported file formats.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "Managing Bitmap Font Projects - SnowB BMF Documentation"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "Complete guide to project management in SnowB BMF: creating, opening, saving, and managing bitmap font projects with support for .sbf and .ltr file formats."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "inLanguage": "en"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "articleSection": "Documentation"
  "keywords": ["project management", "bitmap font", "file operations", "save project", "open project", ".sbf format", ".ltr format", "SnowB BMF"]
  "mainEntity":
    "@type": "HowTo"
    "name": "How to Manage Bitmap Font Projects"
    "description": "Step-by-step instructions for creating, opening, saving, and managing bitmap font projects in SnowB BMF"
    "step":
      - "@type": "HowToStep"
        "name": "Create New Project"
        "text": "Click the New button in the main menu or double-click the empty area in the project tab bar"
      - "@type": "HowToStep"
        "name": "Open Existing Project"
        "text": "Click the Open button to browse and select .sbf or .ltr project files"
      - "@type": "HowToStep"
        "name": "Save Project"
        "text": "Click Save Project button or press Cmd/Ctrl+S to save as .sbf file"
      - "@type": "HowToStep"
        "name": "Manage Multiple Projects"
        "text": "Switch between projects using tabs and rename by double-clicking tab names"
---

## Create a New Project

A new project is created automatically when you launch the application. To create additional projects:

- Click the **New** button in the main menu.
- Double-click the empty area in the project tab bar.

New projects are automatically assigned default names like `Unnamed`, `Unnamed-1`, and so on, which you can rename later.

## Open an Existing Project

### How to Open
- Click the **Open** button in the main menu to browse and select your project file.

### Supported File Formats
- **SnowB BMF Project (`.sbf`)**: The native format. Preserves all project data.
- **Littera Project (`.ltr`)**: For importing projects from the legacy Flash-based Littera tool.

## Save Your Project

**Important:** SnowB BMF auto-saves to IndexedDB, but always save a `.sbf` file as a portable backup. This protects against browser data clearing, device changes, and storage limitations.

### How to Save
1. Click the **Save Project** button or press `Cmd/Ctrl+S`.
2. Select a location on your computer and enter a filename.
3. The project will be saved as an `.sbf` file, which uses Protocol Buffers for efficient storage.

## Automatic Persistence

All projects are automatically saved to the browser's **IndexedDB** storage on page navigation and tab switches. This prevents data loss from accidental refreshes or crashes.

### How It Works

- **Triggers**: Saves on `beforeunload` (page navigation) and `visibilitychange` (tab switch).
- **Storage format**: Protocol Buffers for compact serialization.
- **Multi-Project**: All open projects are saved and restored automatically.

### Important Notes

- **Browser Data Clearing**: If you clear your browser's data (cookies, storage, etc.), your saved projects will be lost. Always keep `.sbf` file backups for important projects.
- **Private/Incognito Mode**: Auto-save may not persist in private browsing mode, depending on your browser.
- **Cross-Browser**: Saved projects are specific to the browser and profile you used. They do not sync across browsers or devices.

## Manage Multiple Projects

The **tabbed workspace** keeps all your projects in one place. Each tab has its own font settings, character sets, and styling.

- **Create Projects**: Click the **New** button or double-click the empty area in the tab bar.
- **Close Projects**: Click the close (x) icon on a project tab. Note: at least one project must always remain open.
- **Project Isolation**: Changes in one project do not affect others.

### Switching Between Projects
- Click a tab to switch to that project.
- At least one project must always remain open.

### Renaming a Project
1. Double-click the project's name in its tab to make it editable.
2. Type the new name and click anywhere outside the tab to confirm the change.

## Related Topics

- [Export Formats](/en/docs/project-management/export-formats/)
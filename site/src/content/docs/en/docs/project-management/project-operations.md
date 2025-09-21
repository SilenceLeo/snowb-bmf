---
title: Managing Bitmap Font Projects
description: Learn how to create, open, save, and manage your bitmap font projects. Efficiently handle multiple projects and understand the supported file formats.
---

## Create a New Project

Starting a new bitmap font project is simple. A new project is automatically created when you launch the application. You can also create additional projects in two ways:

- Click the **New** button in the main menu.
- Double-click the empty area in the project tab bar.

New projects are automatically assigned default names like `Unnamed`, `Unnamed-1`, and so on, which you can rename later.

## Open an Existing Project

You can open projects from your local file system.

### How to Open
- Click the **Open** button in the main menu to browse and select your project file.

### Supported File Formats
- **SnowB BMF Project (`.sbf`)**: The native format for this tool, ensuring full data compatibility.
- **Littera Project (`.ltr`)**: For importing projects from the legacy Flash-based Littera tool.

## Save Your Project

**Crucial:** Project data is stored temporarily in the browser's memory. **You will lose unsaved work if you refresh or close the browser tab.** Always save your project to a file to prevent data loss.

### How to Save
1. Click the **Save Project** button or press `Cmd/Ctrl+S`.
2. Select a location on your computer and enter a filename.
3. The project will be saved as an `.sbf` file, which uses Protocol Buffers for efficient storage.

## Manage Multiple Projects

The tool supports working on multiple projects simultaneously.

### Switching Between Projects
- Simply click on the corresponding tab to switch between open projects.
- Note: At least one project must always remain open.

### Renaming a Project
1. Double-click the project's name in its tab to make it editable.
2. Type the new name and click anywhere outside the tab to confirm the change.
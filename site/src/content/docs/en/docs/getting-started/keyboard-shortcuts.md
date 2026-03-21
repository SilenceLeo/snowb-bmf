---
title: "Keyboard Shortcuts & Canvas Navigation"
description: Master SnowB BMF keyboard shortcuts, canvas panning, and zoom controls. Speed up your bitmap font workflow with hotkeys and gestures.
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF Keyboard Shortcuts & Canvas Navigation"
  "headline": "Keyboard Shortcuts & Canvas Navigation for SnowB BMF"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "Complete reference for SnowB BMF keyboard shortcuts, canvas pan and zoom controls, trackpad gestures, and zoom presets. Covers all hotkeys for project management and canvas navigation in the bitmap font editor."
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "Browser-based bitmap font generator for game development"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "Keyboard Shortcuts Documentation"
  "keywords": ["keyboard shortcuts", "canvas navigation", "zoom controls", "bitmap font editor", "hotkeys", "pan zoom", "SnowB BMF", "trackpad gestures", "canvas panning"]
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
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/en/docs/getting-started/keyboard-shortcuts/"
  "teaches":
    - "How to pan the canvas with Space + drag"
    - "How to zoom with Ctrl/Cmd + scroll wheel"
    - "How to use zoom presets and the zoom slider"
    - "Global keyboard shortcuts for project management"
    - "Differences between trackpad and mouse navigation"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF Documentation"
    "url": "https://snowb.org"
---

All available hotkeys, mouse gestures, and zoom controls for SnowB BMF.

## Global Keyboard Shortcuts

These shortcuts work anywhere in the application.

| Action | Windows / Linux | macOS |
|--------|----------------|-------|
| New Project | `Alt+N` or `Ctrl+N` | `Alt+N` or `Ctrl+N` |
| Save Project (.sbf) | `Ctrl+S` | `Cmd+S` |
| Export Bitmap Font | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Exit Image Glyph Fullscreen | `Escape` | `Escape` |
| Create New Project (Tab Bar) | Double-click empty area | Double-click empty area |

## Canvas Navigation

The Pack view and Preview view each maintain independent pan and zoom states, so adjustments in one view do not affect the other.

### Panning (Space + Drag)

Hold **Space** and drag the mouse to pan the canvas. The cursor changes to indicate the current state:

1. **Default cursor** -- normal editing mode
2. **Open hand** -- Space is held down, ready to pan
3. **Closed hand** -- Space is held and mouse button is pressed, actively panning

Release Space or the mouse button to stop panning.

### Zooming (Scroll Wheel)

| Input | Action |
|-------|--------|
| `Ctrl` + Scroll Wheel (Windows/Linux) | Zoom in / out |
| `Cmd` + Scroll Wheel (macOS) | Zoom in / out |
| Scroll Wheel (vertical) | Pan vertically |
| Scroll Wheel (horizontal) | Pan horizontally |
| `Alt` + Scroll Wheel | Pan horizontally (mouse wheel only) |

SnowB BMF automatically detects whether you are using a **trackpad** or a **mouse wheel** and applies different sensitivity levels:

- **Trackpad**: direct 1:1 response for smooth, fine-grained control
- **Mouse wheel**: additional damping applied to prevent excessive zoom jumps

### Zoom Controls (Controller Bar)

The bottom controller bar provides precise zoom control:

- **Zoom slider** -- drag to set zoom between 0.01x (1%) and 10x (1000%)
- **Zoom percentage button** -- click to open a preset menu
- **Zoom presets** -- quickly jump to: 25%, 50%, 75%, 100%, 125%, 150%, 500%, 1000%

The displayed percentage always reflects the active view (Pack or Preview).

## Tips for Efficient Navigation

- **Quick reset**: select the **100%** preset from the zoom menu to return to the default zoom level.
- **Large textures**: zoom out to 25% or 50% for an overview, then zoom in to inspect individual glyphs.
- **Precise positioning**: combine Space+drag panning with Ctrl/Cmd+scroll zooming to reach any part of the texture atlas quickly.

## Related Topics

- [Interface Guide](/en/docs/getting-started/interface-guide/) -- overview of the full SnowB BMF workspace layout
- [Workflow Guide](/en/docs/getting-started/workflow-guide/) -- step-by-step instructions for creating bitmap fonts

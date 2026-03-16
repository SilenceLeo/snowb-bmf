<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo Bitmap Font Generator" target="_blank">
    <img alt="SnowBamboo Logo" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">Professional Web-Based Bitmap Font Generator</p>

<p align="center">
  <a href="https://snowb.org/">Web App</a> •
  <a href="https://snowb.org/en/docs/">Documentation</a> •
  <a href="README_ZH.md">中文</a>
</p>

<p align="center">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/SilenceLeo/snowb-bmf"></a>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/SilenceLeo/snowb-bmf">
</p>

---

## Overview

SnowBamboo BMF is a free, open-source bitmap font generator for game developers and digital creators. Create, edit, and export professional bitmap fonts directly in your browser—no installation, no registration, no cloud uploads. Supports SDF/MSDF rendering for resolution-independent text in modern game engines.

**[Try it now at snowb.org](https://snowb.org/)**

[![SnowBamboo Bitmap Font Generator Preview](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### Key Advantages

- **Zero Setup** - Start creating in seconds with no installation required
- **True Cross-Platform** - Works identically on Windows, Mac, Linux, ChromeOS
- **Privacy-First** - 100% local processing, no tracking, no cloud uploads
- **Production-Ready** - Advanced packing algorithms reduce texture memory by 30-50%
- **SDF/MSDF Support** - Resolution-independent rendering via msdfgen WASM integration
- **Multi-Project Workspace** - Manage multiple font projects simultaneously with tabbed interface
- **Full Compatibility** - Native support for Unity, Unreal, Godot, Cocos2d, Phaser, PixiJS
- **Legacy Support** - Import from Littera to migrate existing projects seamlessly

## Core Features

### Font Editing & Design

- **Real-time Preview** - Visual feedback as you edit with text preview mode
- **Advanced Typography** - Kerning pairs, letter spacing, baseline adjustment, per-glyph metric editing
- **Professional Fill** - Solid colors, gradients (linear/radial) with 10 built-in presets, image/pattern textures
- **Advanced Stroke** - Width, position (outer/middle/inner), line cap/join options, supports solid/gradient/image fill
- **Multi-layer Shadows** - Configurable shadow effects
- **Custom Glyphs** - Import images via drag-and-drop for icons and special characters, auto character mapping from filename
- **Multi-Project Workspace** - Tabbed interface to manage multiple font projects, double-click to create/rename
- **Flexible Input** - Unicode blocks, custom character sets
- **Interactive Canvas** - Space+drag to pan, Ctrl+scroll to zoom (25%–1000%), preview mode toggle
- **Font Sharpness** - Adjustable rendering sharpness control

### SDF/MSDF Rendering

- **5 Rendering Modes** - SDF, PSDF, MSDF, MTSDF, and standard bitmap
- **msdfgen Integration** - Compiled to WASM via Emscripten for native-speed distance field generation
- **Configurable Parameters** - Distance range, angle threshold, coloring strategy (Simple/Ink Trap/Distance), error correction, fill rule, overlap support
- **Channel Modes** - White/Black, Black/White, White/Alpha, Black/Alpha output options
- **Resolution Independent** - Sharp text at any scale in game engines with SDF shader support

### File Format Support

**Import** - `.sbf`, `.ltr`, `TTF/OTF/WOFF/TTC`

**Export** - [AngelCode format](https://www.angelcode.com/products/bmfont/doc/file_format.html) BMFont Text, XML, Binary, JSON, C Header, PNG atlases, MSDF Atlas JSON

### Game Engine Integration

Native support for all major engines: Unity (TextMesh Pro/legacy), Unreal Engine (Slate/UMG), Godot, [Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html), [Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text)/PixiJS, and custom engines via standard BMFont format.

### Performance & Architecture

- **Optimized Rendering** - React 19 with Canvas API and Web Workers for heavy computation
- **Smart Packing** - MaxRects, Guillotine, and Shelf algorithms via worker pool; Auto/Fixed/Adaptive modes with multi-page support
- **Progressive Web App** - Works offline with in-app update notifications and automatic version detection
- **Type-Safe** - Full TypeScript with strict mode, reactive Legend State v2

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19, TypeScript 5.8+ |
| **Build Tool** | Vite 7 with optimized bundling |
| **State Management** | Legend State v2 |
| **UI Components** | Material-UI v7, Emotion CSS-in-JS |
| **WASM** | msdfgen (SDF/MSDF generation), FreeType (font parsing) |
| **Testing** | Vitest, React Testing Library |
| **Graphics** | Canvas API, Web Workers |
| **Serialization** | Protocol Buffers (.sbf format) |
| **PWA** | Workbox service worker |
| **Monitoring** | Sentry (error tracking & performance) |

## Quick Start

### Prerequisites

- Node.js 18+ and Yarn package manager

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/SilenceLeo/snowb-bmf.git
cd snowb-bmf

# Install dependencies
yarn install

# Start development server
yarn start
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
yarn build

# Preview production build
yarn preview
```

## Development Guide

### Essential Commands

```bash
# Development
yarn start                    # Start Vite dev server (port 3000)
yarn test                     # Run Vitest tests

# Code Quality
yarn lint                     # Run ESLint
yarn lint:fix                 # Auto-fix linting issues
yarn lint:check               # Check with zero warnings
yarn format                   # Format with Prettier

# Build & Deploy
yarn build                    # Build production bundle
yarn build:all                # Complete build pipeline (app + docs + sitemap)
yarn preview                  # Preview production build locally
yarn deploy                   # Deploy to GitHub Pages

# Utilities
yarn pb                       # Generate Protocol Buffer definitions
yarn find-unused              # Find unused files
yarn find-unused:cleanup      # Remove unused files
```

### Project Architecture

- **State Management** — Legend State v2 observables (`src/store/legend/`)
- **Texture Packing** — Web Worker pool with MaxRects/Guillotine algorithms (`src/utils/PackingEngine.ts`)
- **Persistence** — IndexedDB via Dexie, Protocol Buffers for project serialization
- **SDF Generation** — msdfgen compiled to WASM via Emscripten
- **Code Quality** — ESLint 9 flat config, Prettier with import sorting, Husky pre-commit hooks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project uses third-party open-source libraries. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for complete license information.

## Acknowledgments

- [msdfgen](https://github.com/Chlumsky/msdfgen) by Viktor Chlumsky — Multi-channel signed distance field generator
- [FreeType](https://www.freetype.org) — Font rendering library

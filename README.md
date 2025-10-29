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
  <a href="README_ZH.md">简体中文</a>
</p>

---

## Overview

SnowBamboo BMF is a free, open-source bitmap font generator for game developers and digital creators. Create, edit, and export professional bitmap fonts directly in your browser—no installation, no registration, no cloud uploads.

**[Try it now at snowb.org](https://snowb.org/)**

[![SnowBamboo Bitmap Font Generator Preview](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### Key Advantages

- **Zero Setup** - Start creating in seconds with no installation required
- **True Cross-Platform** - Works identically on Windows, Mac, Linux, ChromeOS
- **Privacy-First** - 100% local processing, no tracking, no cloud uploads
- **Production-Ready** - Advanced packing algorithms reduce texture memory by 30-50%
- **Full Compatibility** - Native support for Unity, Unreal, Godot, Cocos2d, Phaser, PixiJS
- **Legacy Support** - Import from Littera migrate existing projects seamlessly

## Core Features

### Font Editing & Design

- **Real-time Preview** - Visual feedback as you edit
- **Advanced Typography** - Kerning pairs, letter spacing, baseline adjustment
- **Professional Effects** - Gradients (linear/radial), multi-layer shadows, custom strokes
- **Custom Glyphs** - Import images for icons and special characters
- **Flexible Input** - Unicode blocks, custom sets
- **Interactive Canvas** - Precise control via mouse and keyboard

### File Format Support

**Import** - `.sbf`, `.ltr`, `TTF/OTF/WOFF`

**Export** - [AngelCode format](https://www.angelcode.com/products/bmfont/doc/file_format.html) BMFont Text/XML, `.fnt` binary, PNG atlases

### Game Engine Integration

Native support for all major engines: Unity (TextMesh Pro/legacy), Unreal Engine (Slate/UMG), Godot, [Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html), [Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text)/PixiJS, and custom engines via standard BMFont format.

### Performance & Architecture

- **Optimized Rendering** - React 19 with Canvas API and Web Workers for heavy computation
- **Smart Packing** - MaxRects, Guillotine, and Shelf algorithms via worker pool
- **Progressive Web App** - Works offline with automatic updates
- **Type-Safe** - Full TypeScript with strict mode, reactive MobX state management

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19, TypeScript 5.8+ |
| **Build Tool** | Vite 7 with optimized bundling |
| **State Management** | MobX 6 (strict mode) |
| **UI Components** | Material-UI v7, Emotion CSS-in-JS |
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

### Key Development Patterns

See [CLAUDE.md](./CLAUDE.md) for detailed development patterns including:
- State management with MobX 6
- Protocol Buffer schema versioning
- Canvas operations and utilities
- Performance optimization strategies
- Code quality standards (linting, formatting, testing)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

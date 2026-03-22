<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo Bitmap Font Generator" target="_blank">
    <img alt="SnowBamboo Logo" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">Bitmap font generator that runs in your browser</p>

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

SnowBamboo BMF is a free, open-source bitmap font generator for game developers and digital creators. Create, edit, and export bitmap fonts directly in your browser — no install, no sign-up, nothing leaves your machine. SDF/MSDF rendering is built in, so text stays sharp at any scale.

**[Try it now at snowb.org](https://snowb.org/)**

[![SnowBamboo Bitmap Font Generator Preview](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### Why this one

- **Zero setup.** Open your browser and start working.
- **Cross-platform.** Windows, Mac, Linux, ChromeOS, same behavior everywhere.
- **Privacy-first.** Everything runs locally. No tracking, no uploads.
- **Smaller textures.** Packing algorithms cut memory use by 30–50%.
- **SDF/MSDF built in.** msdfgen compiled to WASM; text stays sharp at any scale.
- **Tabbed workspace.** Work on several font projects at once.
- **Engine-ready.** Exports drop into Unity, Unreal, Godot, Cocos2d, Phaser, PixiJS.
- **Littera migration.** Import `.ltr` files and bring old projects over.

## Features

### Editing and design

- **Live preview.** WYSIWYG editing with a text preview mode.
- **Typography.** Kerning, letter spacing, baseline, per-glyph metrics.
- **Fills.** Solid, gradient (linear/radial, 10 presets), image textures.
- **Strokes.** Width, position (outer/middle/inner), cap/join; solid, gradient, or image fill.
- **Shadows.** Multi-layer, all parameters adjustable.
- **Custom glyphs.** Drag in images for icons or special characters; filenames map to character codes.
- **Project tabs.** Manage multiple fonts, double-click to create or rename.
- **Character input.** Unicode block picker, custom character sets.
- **Canvas.** Space+drag to pan, Ctrl+scroll to zoom (25%–1,000%).
- **Sharpness.** Font rendering sharpness is adjustable.

### SDF/MSDF rendering

- **Five modes.** SDF, PSDF, MSDF, MTSDF, standard bitmap.
- **msdfgen WASM.** Emscripten-compiled, near-native distance field generation.
- **Tunable.** Distance range, angle threshold, coloring strategy (Simple/Ink Trap/Distance), error correction, fill rule.
- **Channel output.** White/Black, Black/White, White/Alpha, Black/Alpha.
- **Scale-independent.** Sharp at any size if the engine supports SDF shaders.

### File formats

**Import:** `.sbf`, `.ltr`, `TTF/OTF/WOFF/TTC`

**Export:** [AngelCode BMFont](https://www.angelcode.com/products/bmfont/doc/file_format.html) Text, XML, Binary, JSON, C Header, PNG atlases, MSDF Atlas JSON

### Engine support

Exports work with Unity (TextMesh Pro/legacy), Unreal Engine (Slate/UMG), Godot, [Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html), [Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text)/PixiJS. Standard BMFont format, so custom engines can read the files too.

### Under the hood

- **Rendering.** React 19 + Canvas API. Heavy work runs in Web Workers.
- **Packing.** Worker pool runs MaxRects/Guillotine/Shelf. Auto, Fixed, and Adaptive modes. Multi-page.
- **PWA.** Works offline. In-app update prompts.
- **Type safe.** TypeScript strict mode, Legend State v2 for reactive state.

## Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19, TypeScript 5.8+ |
| **Build** | Vite 7 |
| **State Management** | Legend State v2 |
| **UI Components** | Material-UI v7, Emotion CSS-in-JS |
| **WASM** | msdfgen (SDF/MSDF generation), FreeType (font parsing) |
| **Testing** | Vitest, React Testing Library |
| **Graphics** | Canvas API, Web Workers |
| **Serialization** | Protocol Buffers (.sbf format) |
| **PWA** | Workbox service worker |
| **Monitoring** | Sentry |

## Quick Start

### Prerequisites

- Node.js 18+ and Yarn package manager

### Install and run

```bash
# Clone the repository
git clone https://github.com/SilenceLeo/snowb-bmf.git
cd snowb-bmf

# Install dependencies
yarn install

# Start development server
yarn start
```

Open `http://localhost:3000`.

### Production build

```bash
yarn build
yarn preview        # check locally before deploying
```

## Development

### Commands

```bash
# Development
yarn start                    # Start Vite dev server (port 3000)
yarn test                     # Run Vitest tests

# Code quality
yarn lint                     # Run ESLint
yarn lint:fix                 # Auto-fix linting issues
yarn lint:check               # Check with zero warnings
yarn format                   # Format with Prettier

# Build and deploy
yarn build                    # Build production bundle
yarn build:all                # Complete build pipeline (app + docs + sitemap)
yarn preview                  # Preview production build locally
yarn deploy                   # Deploy to GitHub Pages

# Utilities
yarn pb                       # Generate Protocol Buffer definitions
yarn find-unused              # Find unused files
yarn find-unused:cleanup      # Remove unused files
```

### Architecture

- **State:** Legend State v2 observables (`src/store/legend/`)
- **Packing:** Web Worker pool, MaxRects/Guillotine (`src/utils/PackingEngine.ts`)
- **Persistence:** IndexedDB via Dexie, Protocol Buffers for serialization
- **SDF:** msdfgen compiled to WASM via Emscripten
- **Lint/format:** ESLint 9 flat config, Prettier with import sorting, Husky pre-commit

## License

MIT. See [LICENSE](LICENSE).

Third-party licenses: [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Acknowledgments

- [msdfgen](https://github.com/Chlumsky/msdfgen) by Viktor Chlumsky — multi-channel signed distance field generator
- [FreeType](https://www.freetype.org) — font rendering library
- [fontkit](https://github.com/foliojs/fontkit) by Devon Govett — font engine supporting OpenType, TrueType, WOFF, WOFF2, TTC

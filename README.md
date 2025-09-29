<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo Bitmap Font Generator" target="_blank">
    <img alt="SnowBamboo Logo" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">Modern Web-Based Bitmap Font Generator</p>

<p align="center">
  <a href="https://snowb.org/">🌐 Web App</a> •
  <a href="https://snowb.org/en/docs/">📚 Documentation</a> •
  <a href="README_ZH.md">简体中文</a> •
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#development">Development</a>
</p>

---

## Overview

SnowBamboo BMF is a modern, web-based bitmap font generator built with cutting-edge web technologies. It provides a comprehensive solution for creating, editing, and exporting bitmap fonts for games, applications, and digital media projects.

**🎯 [Try it now at snowb.org](https://snowb.org/)**

[![SnowBamboo Bitmap Font Generator Preview](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

## Features

### 🎨 **Advanced Font Editing**
- Real-time font preview and editing
- Multiple glyph generation modes
- Advanced typography controls (kerning, spacing, baseline)
- Support for gradients, shadows, and effects
- Interactive canvas-based editing

### 🔄 **File Format Support**
- **Import**: `.sbf` (SnowBamboo native format), `.ltr` (Littera legacy files)
- **Font Resources**: TTF/OTF/WOFF fonts for glyph generation
- **Export**: Text-based descriptors, XML formats, PNG texture atlases
- Seamless migration from legacy tools

### ⚡ **Performance & Modern Architecture**
- Built with React 19 and TypeScript 5.8+
- Vite 7 for lightning-fast development
- Web Workers for heavy computation
- Progressive Web App (PWA) capabilities
- Real-time state management with MobX 6

### 🛠 **Developer Experience**
- Modern build tooling and linting
- Comprehensive test suite with Vitest
- Protocol Buffers for efficient file serialization
- Sentry integration for monitoring
- Hot reloading and instant feedback

## Tech Stack

- **Frontend**: React 19, TypeScript 5.8+, Material-UI v7
- **Build Tool**: Vite 7 with optimized bundling
- **State Management**: MobX 6 with strict mode
- **Styling**: Emotion CSS-in-JS, Material-UI theming
- **Testing**: Vitest, React Testing Library
- **Graphics**: Canvas API, Web Workers for packing algorithms
- **Serialization**: Protocol Buffers (.sbf format)
- **PWA**: Workbox for service worker and caching
- **Monitoring**: Sentry for error tracking and performance

## Quick Start

### Prerequisites
- Node.js 18+ and Yarn package manager

### Installation

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

### Building for Production

```bash
# Build the application
yarn build

# Preview production build
yarn preview
```

## Development

### Development Commands

```bash
# Development
yarn start                    # Start Vite dev server

# Code Quality
yarn lint                     # Run ESLint
yarn lint:fix                 # Fix linting issues automatically
yarn format                   # Format code with Prettier

# Build & Deploy
yarn build:all                # Complete build pipeline
yarn deploy                   # Deploy to GitHub Pages

# Utilities
yarn pb                       # Generate Protocol Buffer definitions
```

### Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── layout/              # Main layout components
│   └── theme/               # Material-UI theme configuration
├── file/
│   ├── conversion/          # File format conversion logic
│   └── export/              # Export functionality
├── store/
│   ├── base/                # MobX store models
│   └── index.ts             # Store configuration
├── utils/                   # Utility functions and helpers
└── workers/                 # Web Workers for heavy computation
```

### Architecture Highlights

- **State Management**: Single workspace store pattern with MobX 6
- **File Formats**: Versioned Protocol Buffer schemas with migration support
- **Canvas Operations**: Optimized font rendering and texture atlas generation
- **Performance**: Web Workers for rectangle packing algorithms
- **Type Safety**: Strict TypeScript configuration with comprehensive typing

## File Format Support

### Import Formats
- **`.sbf`** - SnowBamboo native format (Protocol Buffer-based)
- **`.ltr`** - Legacy Littera project files (automatic conversion)

### Font Resources
- **TTF/OTF/WOFF** - Font files for glyph generation (uploaded via interface)

### Export Formats
- **Text Descriptors** - Human-readable font definitions
- **XML Descriptors** - Structured XML format for frameworks
- **PNG Atlases** - Optimized texture atlases with various packing algorithms

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

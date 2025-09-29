# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

**NEVER use `git add` or `git commit` commands under any circumstances.** All git operations for staging and committing should be handled manually by the developer.

## Project Overview

SnowBamboo BMF is a web-based bitmap font generator that replaces the deprecated Flash-based Littera tool. It's built as a React application that allows users to create, edit, and export bitmap fonts for use in games and applications.

## Development Commands

```bash
# Start development server (Vite)
yarn start  # or yarn dev

# Build for production
yarn build

# Preview production build locally
yarn preview

# Run tests (Vitest)
yarn test

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Check linting with zero warnings
yarn lint:check

# Format code
yarn format

# Generate Protocol Buffer files
yarn pb

# Deploy to GitHub Pages (with Sentry integration)
yarn predeploy && yarn deploy

# Setup git hooks
yarn prepare

# Find unused files in the codebase
yarn find-unused

# Find unused files with cleanup options
yarn find-unused:cleanup  # Actually removes unused files
yarn find-unused:dry-run  # Shows what would be removed without deleting

# Build and deployment commands
yarn build:app           # Build main application
yarn build:site          # Build documentation site
yarn build:merge         # Merge builds
yarn build:sitemap       # Generate sitemap
yarn build:all           # Run all build steps
```

## Architecture

### Core Technologies
- **React 19** with TypeScript 5.8+
- **Vite 7** for build tooling and development server
- **MobX 6** for state management (configured with strict mode)
- **Material-UI v7** for UI components with Emotion styling
- **Vitest** for testing (replaces Jest)
- **Canvas API** for font rendering and manipulation
- **Protocol Buffers** for project file serialization (.sbf format)
- **Web Workers** for heavy computation (packing algorithms)
- **Sentry** for error tracking and performance monitoring
- **PWA** capabilities with service worker and workbox

### State Management
The application uses MobX 6 with a single workspace store pattern:
- `Workspace` - manages projects, fonts, glyphs, editing state, and UI state
- Store is created as a singleton and provided via React Context at `src/store/index.ts`
- Configured with strict mode: `enforceActions: 'always'` and `computedRequiresReaction: true`

### Key Directories

- `src/app/layout/` - Main application layout components (LeftBar, RightBar, TitleBar, WorkSpace)
- `src/app/components/` - Reusable UI components (ColorInput, GradientPicker, Palette, etc.)
- `src/app/hooks/` - Custom React hooks for interaction (useSpaceDrag, useWheel)
- `src/app/theme/` - Material-UI theme configuration and component overrides
- `src/file/` - File import/export functionality
  - `conversion/` - Handles .ltr (Littera) and .sbf (SnowBamboo) format conversion with versioning
  - `export/` - Exports to various bitmap font formats (text, XML)
- `src/workers/` - Web Workers for rectangle packing algorithms (AutoPacker.worker.ts)
- `src/utils/` - Utility functions for canvas operations, font handling, and file processing
- `src/store/base/` - Base data models for fonts, glyphs, gradients, shadows, etc.
- `scripts/` - Build and deployment scripts (Protocol Buffer generation, Sentry integration)

### File Format Support

**Import formats:**
- `.sbf` - SnowBamboo project files (Protocol Buffer format)
- `.ltr` - Littera project files (legacy Flash tool)

**Export formats:**
- Text-based bitmap font descriptors
- XML-based bitmap font descriptors
- PNG texture atlases

### Protocol Buffers

The project uses Protocol Buffers for the `.sbf` file format with versioning support:
- Current schema: `src/file/conversion/fileTypes/sbf/proto/1.2.0/project.proto`
- Versioned schemas: `src/file/conversion/fileTypes/sbf/proto/[version]/`
- Migration system: Automatic updates from older project file versions (currently up to v1.2.0)
- Run `yarn pb` to regenerate TypeScript definitions when making schema changes

The system supports backward compatibility through version-specific decoders and update functions. Note: File type code has been reorganized from `types/` to `fileTypes/` directory.

### Canvas Operations

Heavy use of Canvas API for:
- Font rendering and glyph generation
- Texture atlas packing
- Real-time preview rendering
- Image processing and manipulation

Canvas utilities are located in `src/utils/` with key functions for font metrics, baselines, and image processing operations:
- Font metrics and baselines: `getFontBaselinesFromCanvas.ts`, `getFontBaselinesFromMetrics.ts`
- Font glyph generation: `getFontGlyphs.ts`, `getFontGlyphsProgressive.ts`
- Image processing: `getTrimImageInfo.ts`, `trimTransparentPixels.ts`
- Text measurement: `measureTextSize.ts`

### Testing

Uses React Testing Library with Vitest (modern Vite-native test runner). Run tests with `yarn test`.

Test configuration is in `vite.config.ts` with jsdom environment and global test utilities.

## Development Configuration

### Build System
- **Vite 7** with optimized build configuration
- Path aliases configured (`@/`, `@/components`, `@/store`, `@/utils`, `@/types`)
- Code splitting for vendor libraries (React, MobX, MUI)
- Web Workers support with ES module format
- Source maps enabled for debugging
- ES module package with `"type": "module"` configuration
- Development server on port 3000 with hot reloading

### Linting & Formatting
- **ESLint 9** with flat configuration (`eslint.config.mjs`)
- TypeScript-ESLint integration with project-aware parsing
- React and React Hooks plugin rules
- CSpell plugin for spell checking with auto-fix enabled
- Prettier with Trivago's import sorting plugin
- Code style: no semicolons, single quotes, 2-space indentation, trailing commas

### Pre-commit Hooks
The project has Husky 9 configured with lint-staged 16 to automatically:
- Format JS/JSX/TS/TSX files with Prettier and ESLint auto-fix
- Format CSS/SCSS files with Prettier only
- Configuration in `.lintstagedrc` file

### Environment & Monitoring
- **Sentry** integration for error tracking and performance monitoring
- **Google Analytics** for usage analytics
- **PWA** features with service worker and update management
- Environment-specific configuration support

## Common Development Patterns

### Adding New Glyph Types
1. Update Protocol Buffer schema in `src/file/conversion/fileTypes/sbf/proto/1.2.0/project.proto`
2. Run `yarn pb` to regenerate TypeScript definitions
3. Add corresponding store models in `src/store/base/`
4. Update conversion logic for import/export
5. Create update function for version migration if needed

### Working with Canvas
- Use existing canvas utilities in `src/utils/`
- Font metrics and baselines: `getFontBaselinesFromCanvas.ts`, `getFontBaselinesFromMetrics.ts`
- Font glyph generation: `getFontGlyphs.ts`, `getFontGlyphsProgressive.ts`
- Image processing: `getTrimImageInfo.ts`, `trimTransparentPixels.ts`
- Text measurement: `measureTextSize.ts`

### State Updates (MobX 6)
- All MobX actions must be wrapped in `runInAction` or use `@action` decorator
- Store is configured with `enforceActions: 'always'`
- Use MobX hooks from `mobx-react-lite` for React integration

### Component Development
- Use Material-UI v7 components with Emotion styling
- Path aliases available: `@/`, `@/components`, `@/store`, `@/utils`, `@/types`
- Custom hooks in `src/app/hooks/` for interaction patterns
- Theme customization in `src/app/theme/`

### Performance Considerations
- Web Workers for heavy computation (packing algorithms in `src/utils/AutoPackerWorkerPool.ts`)
- AutoPacker worker pool for efficient parallel processing
- Vite's optimized bundling with manual chunk splitting
- Service worker for caching and offline capabilities
- Sentry for performance monitoring and error tracking
- Performance monitoring utilities in `src/utils/performanceMonitor.ts`
- Progressive font glyph generation to improve loading times

### TypeScript Configuration
- Target: ES2020 with strict mode enabled
- Experimental decorators enabled for MobX
- Module resolution: bundler mode with `.ts` extension imports allowed
- JSX: react-jsx (automatic runtime)
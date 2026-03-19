# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

**NEVER use `git add` or `git commit` commands under any circumstances.** All git operations for staging and committing should be handled manually by the developer.

**NEVER create additional documentation files after completing tasks.** Do not generate task summaries, case studies, examples, or any other documentation unless explicitly requested by the user. Focus only on the requested code changes.

## Project Overview

SnowBamboo BMF is a web-based bitmap font generator for game developers. Users create, edit, and export bitmap fonts (AngelCode BMFont format) directly in the browser. Built with React 19 + TypeScript 5.8+ + Vite 7.

## Development Commands

```bash
yarn start              # Dev server on port 3000
yarn build              # tsc + vite build
yarn test               # Vitest (jsdom)
yarn test src/utils/measureTextSize.test.ts  # Single test file
yarn lint:check         # ESLint with zero warnings
yarn lint:fix           # Auto-fix lint issues
yarn format             # Prettier
yarn pb                 # Regenerate Protocol Buffer TypeScript definitions
yarn find-unused        # Find unused files
yarn build:all          # Full pipeline: app + docs site + sitemap
```

## Architecture

### State Management — Legend State

All state is managed via Legend State v2 observables in `src/store/legend/`. Six domain stores:

| Store | Purpose |
|-------|---------|
| `styleStore$` | Font config, fill (solid/gradient/image), stroke, shadow, background, global metrics |
| `layoutStore$` | Padding, spacing, dimensions, packing mode (auto/fixed/adaptive) |
| `uiStore$` | Canvas transform, preview mode, letter selection, pack failure state |
| `workspaceStore$` | Multi-project workspace, active project ID, project metadata |
| `glyphStore$` | Font glyphs + image glyphs (high-frequency: positions, dimensions, kerning) |
| `projectStore$` | Project name, text content, timing, initialization state |

**Key patterns:**
- Access with `.get()`, update with `.set()`, group updates with `batch()`
- 47+ hooks in `src/store/legend/hooks.ts` for React components (e.g., `useFont()`, `useGlyph()`, `useLayout()`)
- `useSelectorShallow` for shallow-comparison derived state
- Actions: `packingActions`, `glyphActions`, `projectActions` in `src/store/legend/actions/`

**Backward compatibility layer:** `src/store/index.ts` re-exports Legend State types under old names (e.g., `FillData` → `FontStyleConfig`) for file conversion code. The `Project` interface there is a plain data interface (not observable) matching the protobuf `IProject` structure.

### Packing Engine

`src/utils/PackingEngine.ts` — Core texture atlas packing with two modes:
- **Auto mode**: Web Worker pool (`AutoPackerWorkerPool`) with semaphore-controlled concurrency (max `hardwareConcurrency` or 8), 30s timeout, batch of 4 pages
- **Fixed mode**: Synchronous `GuillotineBinPack` from `rectangle-packer` library

Supports `AbortController` cancellation and Sentry error reporting.

### Persistence

IndexedDB via Dexie (`src/utils/persistence.ts`):
- Database `snowb-bmf`: tables `workspaceMeta` and `projects`
- Auto-save on `beforeunload` and `visibilitychange`
- Projects stored as Protocol Buffer encoded `Uint8Array`
- Serialization/deserialization: `src/store/legend/persistence/`

### File Formats

**Import:** `.sbf` (Protocol Buffer), `.ltr` (Littera/legacy Flash)
**Export:** BMFont text, BMFont XML, BMFont binary, PNG texture atlases

Protocol Buffer schema versioning: 10 versions (1.0.0 → 1.0.1 → 1.0.2 → 1.1.0 → 1.1.1 → 1.1.2 → 1.2.0 → 1.2.1 → 1.2.2 → 1.3.0). Each version has `updateToNext.ts` for automatic migration. Current schema: `src/file/conversion/fileTypes/sbf/proto/1.3.0/project.proto`. Run `yarn pb` after schema changes.

### Application Layout

```
App.tsx → ThemeProvider → Wrap.tsx
  ├─ TitleBar     (top: New/Open/Save/Export buttons)
  ├─ LeftBar      (FontConfig, GlobalMetric, Glyphs, LayoutConfig, PackConfig)
  ├─ WorkSpace    (ProjectTabs, MainView canvas, ControllerBar, ImageGlyphList)
  │   ├─ PackView    (texture atlas preview)
  │   └─ Preview     (text preview with kerning/metric adjustment)
  └─ RightBar     (FillConfig, StrokeConfig, ShadowConfig, BackgroundColor)
```

Reusable form components in `src/app/layout/common/` (FormFill, FormGradient, FormImage, FormColor, FormAngle, FormAdjustMetric).

## Build Configuration

### Vite Chunk Splitting

Manual chunks in `vite.config.ts`:
- `vendor`: react, react-dom
- `legendstate`: @legendapp/state, @legendapp/state/react
- `mui`: @mui/material, @mui/icons-material
- `utils`: color, clsx, file-saver, jszip

### Path Aliases

`@/` → `src/`, `@/components` → `src/components/`, `@/store` → `src/store/`, `@/utils` → `src/utils/`, `@/types` → `types/`

Also `src` → `src/` (bare `src` prefix imports).

### Code Style

- No semicolons, single quotes, 2-space indentation, trailing commas
- Prettier with `@trivago/prettier-plugin-sort-imports`
- ESLint 9 flat config (`eslint.config.mjs`): `@typescript-eslint/no-explicit-any` is off, `no-unused-vars` allows `_` prefix
- CSpell spell checking enabled in ESLint
- Pre-commit hooks: Husky 9 + lint-staged 16

### TypeScript

- Target: ES2020, strict mode, bundler module resolution
- No `experimentalDecorators`
- JSX: react-jsx (automatic runtime)

## Key Gotchas

- `src/store/index.ts` `Project` type is a plain interface for file conversion — do not confuse with observable stores
- `encodeProject.ts` needs explicit types for `any` array items (e.g., `fontResource` param)
- When deleting store files, check `vite.config.ts` `manualChunks` and `optimizeDeps`
- Kerning data is always `Record<string, number>` (not Map)
- `MetricData` interface (`{ xAdvance, xOffset, yOffset }`) is used as plain objects throughout
- Performance thresholds in `src/store/legend/config.ts`: `PROGRESSIVE_THRESHOLD: 500` glyphs, `BATCH_SIZE: 100`

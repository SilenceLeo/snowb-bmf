# GEMINI.md

## Project Overview

This is a TypeScript-based web application for generating bitmap fonts. It's a modern replacement for the Flash-based tool "Littera" and is built using React, Vite, and MobX.

### Building and Running

To get the project up and running, you'll need to have Node.js and Yarn installed.

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Run the development server:**
    ```bash
    yarn dev
    ```
    This will start a development server on `http://localhost:3000`.

3.  **Build for production:**
    ```bash
    yarn build
    ```
    This will create a production-ready build in the `build` directory.

4.  **Run tests:**
    ```bash
    yarn test
    ```

### Development Conventions

*   **State Management:** The project uses MobX for state management. The main store is defined in `src/store/index.ts`, with the core logic in `src/store/project.ts` and `src/store/workspace.ts`.
*   **Styling:** The project uses Material-UI for UI components and Emotion for styling.
*   **Linting and Formatting:** The project uses ESLint for linting and Prettier for code formatting. You can run the linter and formatter with the following commands:
    *   `yarn lint`
    *   `yarn format`
*   **Web Workers:** The project uses web workers for performance-intensive tasks like packing the glyphs. The worker code is located in `src/workers/AutoPacker.worker.ts`.
*   **File Structure:**
    *   `src/app`: Contains the main application component and layout.
    *   `src/components`: Contains reusable React components.
    *   `src/store`: Contains the MobX store and data models.
    *   `src/utils`: Contains utility functions.
    *   `src/workers`: Contains the web worker code.
    *   `types`: Contains TypeScript type definitions.
*   **Path Aliases:** The project uses path aliases for easier imports. The aliases are defined in `vite.config.ts`.
    *   `@`: `src`
    *   `@/components`: `src/components`
    *   `@/store`: `src/store`
    *   `@/utils`: `src/utils`
    *   `@/types`: `types`
    *   `src`: `src`
*   **Deployment:** The project is deployed to GitHub Pages using the `gh-pages` package. The deployment script is in `package.json`.
*   **Sentry:** The project uses Sentry for error tracking. The Sentry configuration is in `scripts/sentry.js`.
*   **Protobuf:** The project uses Protocol Buffers for data serialization. The protobuf definitions are likely in the `src/file/conversion/fileTypes` directory, and the script to generate the protobuf files is in `scripts/createProtocol.js`.
*   **Sitemap:** The project generates a sitemap for SEO purposes. The sitemap generation script is in `scripts/sitemap.js`.
*   **Unused Files:** The project has a script to find unused files. The script is in `scripts/find-unused-files.js`.
*   **Husky:** The project uses Husky for pre-commit hooks. The pre-commit hooks are defined in `.husky/pre-commit`.
*   **Lint-Staged:** The project uses lint-staged to run linters on staged files. The lint-staged configuration is in `package.json`.
*   **CSpell:** The project uses CSpell to check for spelling errors. The CSpell configuration is in `cspell.json`.
*   **Prettier:** The project uses Prettier to format code. The Prettier configuration is in `.prettierrc`.
*   **ESLint:** The project uses ESLint to lint code. The ESLint configuration is in `eslint.config.mjs`.
*   **TypeScript:** The project uses TypeScript. The TypeScript configuration is in `tsconfig.json`.
*   **Vite:** The project uses Vite as a build tool. The Vite configuration is in `vite.config.ts`.
*   **Yarn:** The project uses Yarn as a package manager. The Yarn configuration is in `.yarnrc`.
*   **Environment Variables:** The project uses environment variables. The environment variables are defined in `.env` and `.env.development`.
*   **License:** The project is licensed under the MIT License. The license is in the `LICENSE` file.
*   **README:** The project has a README file in English and Chinese. The README files are in `README.md` and `README_ZH.md`.
*   **CLAUDE.md:** The project has a `CLAUDE.md` file, which might contain instructions for another AI agent.
*   **cspell.json:** The project has a `cspell.json` file, which is used to configure CSpell.
*   **eslint.config.mjs:** The project has an `eslint.config.mjs` file, which is used to configure ESLint.
*   **index.html:** The project has an `index.html` file, which is the entry point for the application.
*   **package.json:** The project has a `package.json` file, which contains information about the project and its dependencies.
*   **tsconfig.json:** The project has a `tsconfig.json` file, which is used to configure TypeScript.
*   **vite.config.ts:** The project has a `vite.config.ts` file, which is used to configure Vite.
*   **yarn.lock:** The project has a `yarn.lock` file, which is used to lock the versions of the project's dependencies.
*   **public:** The `public` directory contains static assets that are copied to the build directory.
*   **scripts:** The `scripts` directory contains scripts that are used to build and deploy the project.
*   **site:** The `site` directory contains the project's website.
*   **src:** The `src` directory contains the source code for the application.
*   **types:** The `types` directory contains TypeScript type definitions.
*   **.claude:** The `.claude` directory contains settings for the Claude AI agent.
*   **.cursor:** The `.cursor` directory contains settings for the Cursor code editor.
*   **.husky:** The `.husky` directory contains Git hooks.
*   **.specstory:** The `.specstory` directory contains specifications for the project.
*   **node_modules:** The `node_modules` directory contains the project's dependencies.
*   **.cursorindexingignore:** The `.cursorindexingignore` file is used to ignore files when indexing the project with Cursor.
*   **.env:** The `.env` file is used to define environment variables.
*   **.env.development:** The `.env.development` file is used to define environment variables for development.
*   **.gitignore:** The `.gitignore` file is used to ignore files when committing to Git.
*   **.lintstagedrc:** The `.lintstagedrc` file is used to configure lint-staged.
*   **.prettierrc:** The `.prettierrc` file is used to configure Prettier.
*   **.yarnrc:** The `.yarnrc` file is used to configure Yarn.
*   **CLAUDE.md:** The `CLAUDE.md` file contains instructions for the Claude AI agent.
*   **cspell.json:** The `cspell.json` file is used to configure CSpell.
*   **eslint.config.mjs:** The `eslint.config.mjs` file is used to configure ESLint.
*   **index.html:** The `index.html` file is the entry point for the application.
*   **LICENSE:** The `LICENSE` file contains the project's license.
*   **package.json:** The `package.json` file contains information about the project and its dependencies.
*   **README_ZH.md:** The `README_ZH.md` file is the README file in Chinese.
*   **README.md:** The `README.md` file is the README file in English.
*   **tsconfig.json:** The `tsconfig.json` file is used to configure TypeScript.
*   **tsconfig.node.json:** The `tsconfig.node.json` file is used to configure TypeScript for Node.js.
*   **vite.config.ts:** The `vite.config.ts` file is used to configure Vite.
*   **yarn.lock:** The `yarn.lock` file is used to lock the versions of the project's dependencies.
*   **GEMINI.md:** The `GEMINI.md` file contains instructions for the Gemini AI agent.

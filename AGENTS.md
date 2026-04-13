# Repository Guidelines

## Project Structure & Module Organization
This repository is a Quartz v4 site customized for China travel content. Author-facing content lives in `content/`: trip plans in `content/trips/`, destination notes in `content/places/`, reference pages in `content/resources/`, and images in `content/photos/`. Quartz source code and site behavior live in `quartz/`, with UI components in `quartz/components/`, plugins in `quartz/plugins/`, and shared styles in `quartz/styles/`. Configuration is primarily in `quartz.config.ts` and `quartz.layout.ts`. Generated output appears in `public/`; treat it as build output, not a source directory.

## Build, Test, and Development Commands
Use Node `>=22` and npm `>=10.9.2`.

- `npm install`: install dependencies.
- `npx quartz build --serve`: build the site from `content/` and start the local dev server.
- `npm run docs`: build and serve the bundled Quartz docs from `docs/`.
- `npm test`: run the TypeScript test suite with `tsx --test`.
- `npm run check`: run `tsc --noEmit` and Prettier checks.
- `npm run format`: apply Prettier across the repo.

## Coding Style & Naming Conventions
Formatting is enforced with Prettier via [`.prettierrc`](/Users/hang/RoadMapForChina-site/.prettierrc): 2-space indentation, 100-character line width, trailing commas, and no semicolons. Use TypeScript and ESM patterns consistent with the existing Quartz code. Name Markdown files with descriptive kebab-case slugs such as `forbidden-city.md`; keep related image names aligned, for example `forbidden-city-2.jpg`. Prefer small, focused edits in `quartz/` and keep content frontmatter consistent across pages.

## Testing Guidelines
Tests currently live beside implementation in files like `quartz/util/path.test.ts` and `quartz/components/scripts/search.test.ts`. Add new `*.test.ts` files near the code they cover. Run `npm test` before submitting changes, and run `npm run check` for type and formatting validation when touching TypeScript, config, or layout files.

## Commit & Pull Request Guidelines
Recent commits use short imperative subjects, for example `Add full trip overview route map to home page` and `Standardize website structure for consistency`. Follow that pattern: one clear action per commit. Pull requests should include a concise summary, note any changed routes or content sections, link related issues when relevant, and attach screenshots for visible UI or content layout changes.

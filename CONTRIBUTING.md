# Contributing to ATS-Friendly CV Generator

Thanks for your interest in contributing! This is a personal-use project, but contributions that improve quality, fix bugs, or add practical features are welcome.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run Vitest tests (single run) |
| `npm run test:watch` | Run Vitest in watch mode |

## Code Conventions

- **TypeScript strict mode** — no `any` without a justified comment
- **No emojis** in source code, comments, or UI copy (unless explicitly part of the feature)
- **Conventional commits** — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Keep components small and focused (split beyond ~150 lines)
- Business logic goes in `/lib`, not in UI components
- No new dependencies without explicit justification

### File Organization

- `/app` — Next.js pages and API routes
- `/components` — React components (split by feature domain)
- `/hooks` — Custom React hooks
- `/lib` — Business logic, schemas, utilities
- `/stores` — Zustand stores
- `/types` — TypeScript type definitions
- `/__tests__` — Vitest tests

### Testing

- Write tests for business logic, schemas, and utility functions
- Use Vitest with `@testing-library/react` for component tests
- Run `npm run test` before submitting a PR

## Submitting Changes

1. Create a branch from `main` (`git checkout -b feat/my-feature`)
2. Make your changes with clear, focused commits
3. Run lint, type-check, and tests locally
4. Push and open a pull request against `main`

### PR Requirements

- Clear description of what changed and why
- All existing tests pass (`npm run test`)
- No lint errors (`npm run lint`)
- No type errors (`npm run type-check`)
- If applicable, verify the PDF is still ATS-compliant (single-column, selectable text, no images)

## Reporting Issues

- Use the [bug report template](https://github.com/josepita0/ats-generator-friendly/issues/new?template=bug_report.yml) for bugs
- Use the [feature request template](https://github.com/josepita0/ats-generator-friendly/issues/new?template=feature_request.yml) for ideas
- For security vulnerabilities, see [SECURITY.md](SECURITY.md)

## Questions?

Open a discussion or issue — keep it simple.

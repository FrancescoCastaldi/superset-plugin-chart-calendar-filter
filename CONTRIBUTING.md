# Contributing

Thanks for your interest in contributing to the Calendar Filter Superset Plugin.

## Development Setup

```bash
git clone <repo-url>
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
npm test
```

## Commit Conventions

Use [conventional commits](https://www.conventionalcommits.org/):

```
feat: add year overview grid view
fix: correct timezone offset in date parsing
chore: update dependencies
docs: update install instructions
refactor: extract month navigation into hook
test: add cell density test cases
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`.

## Branch Naming

Use descriptive prefixes:

- `feat/my-feature-name` - new features
- `fix/bug-description` - bug fixes
- `chore/maintenance-task` - maintenance, dependency updates
- `docs/documentation-change` - documentation updates
- `refactor/code-restructure` - refactoring without behavior change

## Pull Request Process

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Make your changes. Follow the code style guidelines below.
4. Run `npm test` and ensure all 44 tests pass.
5. Run `npm run build` and verify no errors.
6. Run `npm run lint` if available (verify TypeScript strict checking passes).
7. Commit with a clear conventional commit message.
8. Push and open a Pull Request against the `master` branch.
9. In the PR description, describe the change, motivation, and testing steps.

### PR Requirements

- All tests must pass in CI.
- New features must include tests. See `test/` directory for patterns.
- UI changes should include before/after screenshots if visual.
- Do not introduce new peer dependencies without discussion.

## Code Style

- **Language**: TypeScript with strict mode enabled (`strict: true` in tsconfig.json).
- **Imports**: Use `@superset-ui/core` imports for Superset APIs. Peer dependencies use `*` version range.
- **Components**: PascalCase for component files and names (`CalendarFilter.tsx`).
- **Directories**: kebab-case for directory names (`plugin/`, `__mocks__/`).
- **Styled components**: Use `@emotion/styled` with transient props (`$isToday`, `$cellHeight`) to prevent DOM leakage.
- **Hooks**: Extract reusable logic into `src/hooks/` directory.
- **Types**: Define interfaces in `src/types.ts`. Use specific types over `any`.
- **Formatting**: Follow existing patterns in `src/`. Consistent 2-space indentation.

## Testing

- All new features must include Jest tests.
- Run the full suite before submitting: `npm test`.
- Tests use Jest + jsdom + @testing-library/react.
- Test files live in `test/` following the source file structure:
  - `src/CalendarFilter.tsx` -> `test/CalendarFilter.test.tsx`
  - `src/plugin/buildQuery.ts` -> `test/plugin/buildQuery.test.ts`
  - `src/plugin/transformProps.ts` -> `test/plugin/transformProps.test.ts`
- Mock Superset dependencies in `test/__mocks__/`.
- Snapshot updates are acceptable for intentional UI changes.

## Project Architecture

- `src/CalendarFilter.tsx` - main React component with all calendar logic.
- `src/hooks/` - custom React hooks (selection, navigation, etc.).
- `src/styles/` - Emotion styled components.
- `src/plugin/` - Superset integration layer (registration, query, controls, transform).
- `test/` - Jest test suite (44 tests across 5 suites).

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

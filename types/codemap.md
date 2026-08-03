# types/

## Responsibility

Contains external module declarations and ambient type extensions for third-party or untyped Apache Superset packages (`external.d.ts`).

## Design

- Uses TypeScript ambient module declarations (`declare module '...'`) to provide type safety for external modules lacking standard `@types` packages.
- Declares signatures for `@apache-superset/core/translation` (`t()` function).

## Flow

Included automatically by TypeScript compiler via `tsconfig.json` during build (`npm run ts-types` / `tsc --build`).

## Integration

Ensures type checking passes across plugin code when using Superset translation functions.

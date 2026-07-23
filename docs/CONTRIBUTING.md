# Contributing

Thanks for your interest in contributing to this project!

## Development setup

```bash
npm install --legacy-peer-deps
npm run build
npm test
```

## Pull request process

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run tests (`npm test`) and ensure all pass
5. Run the build (`npm run build`) and ensure no errors
6. Commit with a clear message
7. Push and open a Pull Request

## Code style

- TypeScript with strict mode
- Follow the existing patterns in `src/`
- Use `@superset-ui/core` imports for Superset APIs
- Peer dependencies use `*` version range

## Testing

- All new features should include tests
- Run `npm test` to verify
- Tests use Jest + jsdom + @testing-library/react

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

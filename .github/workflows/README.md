# GitHub Workflows

This directory contains GitHub Actions CI/CD pipeline configurations for superset-plugin-chart-calendar-filter.

## Files

- `ci.yml` : Main continuous integration workflow. Builds and tests the plugin on every push and pull request using Node 20 and 22. Publishes to npm when a tag is pushed.
- `codeql.yml` : CodeQL security analysis workflow. Runs static analysis on every push to default branch and on a weekly schedule.
- `release.yml` : Release workflow for automated npm publishing and GitHub Release creation.

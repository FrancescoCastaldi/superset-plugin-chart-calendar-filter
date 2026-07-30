# Automatic Installer Implementation Plan

**For agentic workers:** Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Create a one-command automatic installer that installs the calendar filter chart plugin into any vanilla Apache Superset 6.1.0 project, with Docker integration and verification.

**Architecture:** The installer is a PowerShell script that (1) builds the plugin, (2) installs it into superset-frontend, (3) registers it in MainPreset, (4) configures Docker compose override, (5) builds the frontend, (6) starts Docker stack. A companion bash script covers Linux/macOS. Documentation in docs/ explains usage.

**Tech Stack:** PowerShell 5.1+, Bash, Apache Superset 6.1.0, Docker Compose, npm

## Global Constraints

- Target Superset version: 6.1.0
- Plugin key: superset-plugin-chart-calendar-filter
- Must work on Windows (PowerShell) and Linux/macOS (bash)
- Must auto-detect Superset root via multiple fallback paths
- Must validate prerequisites (node, npm, docker, docker compose)
- Must support -SupersetRoot parameter for custom paths
- Must support -SkipBuild, -Link, -Docker, -Test flags
- All paths must be absolute-resolved
- Errors must be descriptive with exit code 1

---

## Task 1: Enhanced PowerShell Installer (scripts/install-to-superset.ps1)

**Files:**
- Modify: scripts/install-to-superset.ps1

**Interfaces:**
- Consumes: Superset checkout path (parameter or auto-detect), plugin build output (lib/)
- Produces: Installed + registered plugin in superset-frontend, Docker override if requested

- [ ] **Step 1: Add parameter validation and help improvements**
  Add -Docker and -Test switches. Improve help text. Add prerequisite checks (node, npm, docker, docker compose).

- [ ] **Step 2: Add Docker compose override setup**
  When -Docker is specified, auto-configure superset's docker-compose.yml with the plugin override from docker/docker-compose.yml.

- [ ] **Step 3: Add verification mode**
  When -Test is specified, after installation run npm run build in superset-frontend and verify the build succeeds, then output the chart URL.

- [ ] **Step 4: Add post-install summary**
  Print clear next steps with URLs and commands.

## Task 2: Enhanced Bash Installer (scripts/install-to-superset.sh)

**Files:**
- Modify: scripts/install-to-superset.sh

**Interfaces:**
- Same as Task 1 but for bash environments

- [ ] **Step 1: Mirror all PowerShell changes in bash version**
  Same parameters, same flow, same docker and test modes.

- [ ] **Step 2: Add prerequisite checks**
  Check node, npm, docker, docker-compose availability. Check for required files.

## Task 3: Documentation (docs/INSTALL.md)

**Files:**
- Modify: docs/INSTALL.md

- [ ] **Step 1: Add automatic installer section**
  Document the quick-start one-command install with clear examples for Windows and Linux.

- [ ] **Step 2: Document Docker mode**
  Explain how to use -Docker flag for development with docker compose.

- [ ] **Step 3: Document test/verification**
  Explain how to verify the installation works.

## Task 4: Test against target project

- [ ] **Step 1: Run installer against C:\Users\fracas\Music\superset**
  Execute the enhanced installer with -SupersetRoot and -Docker flags.

- [ ] **Step 2: Verify frontend build**
  Run npm run build in superset-frontend and confirm success.

- [ ] **Step 3: Verify Docker stack starts**
  Run docker compose up and verify containers start.

## Task 5: Commit and push

- [ ] **Step 1: Commit all changes**
- [ ] **Step 2: Push to GitHub and Bitbucket**

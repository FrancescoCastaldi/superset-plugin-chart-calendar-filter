---
name: git-smart-push
description: Smart Git commit and push workflow with automatic detection of remote protocol (SSH, HTTPS Token, Credential Manager), active branch verification, build safety checks, and Windows PowerShell command compatibility. Use when user requests to push code changes to remote repositories.
---

# Git Smart Push Skill

This skill provides a robust, fail-safe procedure for committing and pushing code changes to remote Git repositories (GitHub, GitLab, Bitbucket, etc.) across different authentication setups (SSH vs HTTPS Tokens).

## Protocol & Credentials Auto-Detection

Before executing a push, inspect the current Git configuration:

1. **Check Remote URL & Protocol**:
   ```powershell
   git remote -v
   ```
   - **SSH Remote** (`git@github.com:user/repo.git`):
     - Uses local SSH keys (`~/.ssh/id_rsa`, `id_ed25519`).
     - Test SSH connectivity if needed: `ssh -T git@github.com`
   - **HTTPS Remote** (`https://github.com/user/repo.git`):
     - Uses Git Credential Manager (`manager-core`/`manager`), stored tokens (`~/.git-credentials`), or Personal Access Tokens (PAT).
     - Check credential helper: `git config --get credential.helper`

2. **Detect Current Branch**:
   ```powershell
   git rev-parse --abbrev-ref HEAD
   ```

3. **Check Working Directory Status**:
   ```powershell
   git status
   ```

## Pre-Push Verification Protocol

Always ensure code health before pushing:

1. **Run Project Build / Tests** (if applicable):
   - For Node.js / TypeScript projects: `npm run build` (or `npm test`)
   - For Python projects: `pytest` / `python -m unittest`
   - For Rust projects: `cargo check`

2. **Verify `.gitignore` Compliance**:
   - Ensure sensitive files (`.env`, secrets, credentials) or temporary build folders are not accidentally staged.

## Execution Workflow (Windows PowerShell Safe)

> **CRITICAL**: On Windows PowerShell, **NEVER** use `&&` to chain commands (which throws a syntax error). Use `;` to separate sequential commands or run them as separate tool invocations.

### Step 1: Stage Changes
```powershell
git add .
```
*(Or specify explicit files if performing a selective commit)*

### Step 2: Commit
```powershell
git commit -m "<type>(<scope>): <concise description of changes>"
```
*Follow Conventional Commits format (e.g., `fix`, `feat`, `docs`, `refactor`, `style`, `test`, `chore`).*

### Step 3: Push to Tracking Branch
```powershell
git push origin <current-branch>
```

### Combined PowerShell Command Example:
```powershell
git add . ; git commit -m "fix(controlPanel): expand groupby control object" ; git push origin master
```

## Error Recovery & Handling

1. **Non-Fast-Forward Rejection (`[rejected - fetch first]`)**:
   - Pull remote changes with rebase:
     ```powershell
     git pull --rebase origin <current-branch>
     ```
   - Re-run `git push origin <current-branch>`.

2. **Authentication / Permission Denied (HTTP 403 / SSH Public Key)**:
   - For SSH: Verify SSH key is loaded (`ssh-add -l`) or set up `~/.ssh/config`.
   - For HTTPS: Prompt user to configure Git Credential Manager or set PAT token:
     ```powershell
     git remote set-url origin https://<TOKEN>@github.com/<USER>/<REPO>.git
     ```

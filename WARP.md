# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: NOTEKRAFT

Status summary
- Current repository contents: README.md only. No language/runtime or build/test tooling is detected.
- No package or config manifests found (e.g., package.json, pyproject.toml, go.mod, Cargo.toml, Makefile, Dockerfile, etc.).

Commands
- Build: Not defined (no build system detected).
- Lint: Not defined (no linter config found).
- Tests: Not defined (no test framework/config found).

When code is added, update these with exact commands from the repo. As a quick detection checklist:
- Node/TypeScript: package.json (scripts), tsconfig.json, eslint/prettier configs, test runner configs (jest.config.*, vitest.config.*).
- Python: pyproject.toml or requirements.txt, pytest.ini/tox.ini/setup.cfg.
- Go: go.mod/go.work, make targets.
- Rust: Cargo.toml, cargo commands.
- Docker: Dockerfile/docker-compose.yml.

High-level architecture and structure
- At present there is no source tree or application code to describe. Once modules and directories are introduced (e.g., app/, src/, backend/, frontend/, packages/), summarize the top-level boundaries and how components interact (entry points, shared libs, data flow, external services). Keep it at a “big picture” level and avoid listing trivial files.

Repository guidelines and auxiliary rules
- README.md exists but only contains the project name.
- No project-scoped agent rules detected: WARP.md (this file), CLAUDE.md, .cursor/rules/, .cursorrules, or .github/copilot-instructions.md were not found.

Next actions for Warp
- As soon as manifests or configs are committed, refresh this file with:
  - Concrete build/lint/test commands (including how to run a single test).
  - A concise architectural overview spanning the main packages/apps.
- Prefer commands that work in PowerShell on Windows (current shell) unless the repo specifies otherwise.

---
title: "Rebuild create-pila-app as admin dashboard boilerplate"
description: "Simplify CLI, add rich dashboard with charts, user management module, and Sentry integration"
status: pending
priority: P1
effort: 12h
branch: init
tags: [cli, dashboard, data-table, sentry, recharts]
created: 2026-04-07
---

# Rebuild create-pila-app

## Goal
Transform from multi-framework scaffolder into opinionated Vite-only admin dashboard boilerplate (similar to shadcn-admin). Remove framework/theme/feature selection; include everything by default.

## Current State
- CLI supports nextjs/vite framework, 4 themes, optional features (editor, charts, dnd, sentry), auth selection
- Template has placeholder dashboard, basic sidebar (Dashboard/Profile/Settings), auth flow
- Optional features stored in `optional/` with deps.json files, merged at scaffold time

## Target State
- CLI: only asks project name + package manager. All features baked in.
- Template: rich dashboard with recharts, full user management CRUD with TanStack Table, Sentry by default
- Sidebar: Dashboard, Users, Settings

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Simplify CLI | pending | 2h | [phase-01](./phase-01-simplify-cli.md) |
| 2 | Dashboard + Charts | pending | 3h | [phase-02](./phase-02-dashboard-charts.md) |
| 3 | User Management Module | pending | 5h | [phase-03](./phase-03-user-management.md) |
| 4 | Sentry Integration | pending | 2h | [phase-04](./phase-04-sentry-integration.md) |

## Execution Order
1. Phase 1 (CLI) -- independent, can start first
2. Phase 2 + 3 -- can run in parallel (different files)
3. Phase 4 -- depends on phase 2 (modifies main.tsx, vite.config.ts)

## Key Decisions
- Use `recharts` only (drop `echarts`/`echarts-for-react` from charts deps)
- Use `violet` theme as hardcoded default (keep themes.ts but only call violet)
- Move sentry + charts deps from optional into base package.json
- Remove `optional/` directory entirely -- everything is included
- Keep i18n and dark-mode as always-included (already are)
- Sidebar nav: Dashboard, Users, Settings (remove Profile from nav, keep route)

## Dependencies
- recharts (already in optional/charts/deps.json)
- @sentry/react, @sentry/vite-plugin (already in optional/sentry/deps.json)
- shadcn/ui: table, command, popover (popover already exists via @radix-ui/react-popover)

## Risk
- TanStack Table v8 column API -- ensure type-safe column defs
- Recharts bundle size -- use tree-shaking, add to manualChunks in vite.config

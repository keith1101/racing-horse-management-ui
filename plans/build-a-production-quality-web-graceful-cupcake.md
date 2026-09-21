# RTMS — Horse Management / Horse Overview Screen

## Context

The client needs the **Horse Management / Horse Overview** screen for RTMS (Racehorse Training & Management System), a desktop-first operational platform for a racehorse training club. The attached `DESIGN.md` is a complete, normative design system (tokens, typography, components, layout rules, do's/don'ts) inspired by Prism-style equine operations software, and is the single source of truth.

The current project is a bare React 19 + Vite + Tailwind v4 scaffold: `src/App.tsx` is an empty placeholder and `src/index.css` only imports Tailwind. Everything here is net-new, so there is no existing app architecture to preserve.

The goal is a production-quality, responsive, data-dense master/detail Horse Management screen built from **reusable components** that later RTMS screens (Trainer Dashboard, Vet Health Map, Groom Task Board, Owner Dashboard, Horse Profile, Training Plan) can inherit. All interactive affordances (search, filters, status filtering, selection, primary/secondary actions, navigation) must have working basic behavior.

## Design system wiring (foundation)

**`src/index.css`** — establish the token layer so no page hardcodes hex values (DESIGN.md §59):
- `@import` Inter and Geist Mono from Google Fonts (CSS `@import` must be the first non-comment statements, before `@import 'tailwindcss'`... note Tailwind import stays — place font imports above it).
- Define all DESIGN.md colors as CSS custom properties (`--color-primary`, `--color-success`, `--color-danger`, `--color-training`, etc.), radii (`--radius-xs..xl`, full), and expose them to Tailwind v4 via `@theme` so utilities like `bg-surface`, `text-secondary`, `rounded-md` map to tokens.
- Set base `font-family: Inter`, body background `--color-background`, base text color `--color-text-primary`, 14px/1.5 body.
- Add a `.font-mono`/metric helper mapping to Geist Mono for telemetry/metric numbers.
- Do NOT add an unlayered `* {}` reset (would break Tailwind's layered preflight).

## Component architecture

Create `src/components/` (shared/reusable primitives) and `src/features/horses/` (screen-specific). Reusable primitives are named to match DESIGN.md §59 handoff list so they carry to other screens.

### Shared primitives — `src/components/`
- `AppShell.tsx` — full-height app canvas + top nav + page region. Wraps the screen.
- `TopNav.tsx` (ModuleNav) — 56px white bar, 1px bottom border, RTMS wordmark, horizontal modules (Dashboard, Horses[active], Schedule, Training, Medical, Racing, More), notification + user menu on far right. Active module = restrained primary color underline/soft bg (not a giant filled tab). Module click updates active state.
- `PageHeader.tsx` — title (page-title type), one-line context/breadcrumb, primary action slot, secondary action slot.
- `FilterBar.tsx` — compact inline bar: search input + dropdown filters + Clear. Not wrapped in a big card.
- `Button.tsx` — variants: primary (lavender fill), secondary (white+border), tertiary (text/icon), destructive; states default/hover/active/focus/disabled/loading. Radius `sm`.
- `IconButton.tsx` — icon-only with `aria-label` + tooltip + visible focus.
- `StatusBadge.tsx` — pill (`rounded-full`), semantic token-driven, always text + shape/icon + color (never color alone). Health (FIT/MONITOR/INJURED/ISOLATED), Training (ACTIVE/COMPLETED/BLOCKED/SCHEDULED/DRAFT), plus a generic variant map. Colors pulled from tokens only.
- `DataTable.tsx` — generic, column-config driven: sticky compact header, sortable columns, row hover, selected row = `primary-subtle`, right-aligned row actions, 40–46px rows. Renders empty / loading (skeleton) / error slots.
- `Select.tsx` / dropdown — compact 36px control, `rounded-xs`, used by FilterBar.
- `SearchInput.tsx` — labeled/aria search with debounce, magnifier icon.
- `Panel.tsx` — white surface, 1px border, `rounded-md`, no shadow (default panel primitive).
- `TrainingLockBanner.tsx` — reusable restriction banner (used in detail header) with reason + review date + action link.
- `EmptyState.tsx`, `TableSkeleton.tsx` — small, non-decorative.

### Feature — `src/features/horses/`
- `horseData.ts` — realistic Thoroughbred/racing dataset (~12–16 horses): name, imageUrl, sex, breed, DOB→age, microchip, health status (FIT/MONITOR/INJURED/ISOLATED), stable+stall, owner, trainer, training status + active plan/phase/next workout, training-lock (some locked), readiness. Plus filter option lists (stables, statuses, trainers). Real names (e.g. Thunder Bolt, Winter Solstice, Midnight Reign, Silver Comet…), realistic owners, believable metrics with units. Horse profile images sourced via Unsplash search (horse photos).
- `HorseListItem.tsx` — compact avatar + name + one secondary descriptor + health status + training-lock icon; selected state = soft primary bg + strong text + optional left indicator (DESIGN.md §16).
- `HorseMasterList.tsx` — left pane (280–340px): sticky FilterBar/search on top, scrollable horse list, count. Handles empty/loading/no-results.
- `HorseDetailPanel.tsx` — right pane: HorseHeader (name, avatar, health badge, training-lock banner when locked, stable/stall, owner, trainer, quick actions) + HorseTabs (Overview[active], Pedigree, Health, Training, Racing, Schedule, Media) + Overview content (Basic Information, Current Health, Current Training, Upcoming Schedule/Recent Activity per §17). Non-active tabs show a lightweight placeholder panel (this screen focuses on Overview).
- `HorseHeader.tsx`, `HorseTabs.tsx` — split out as reusable per §59.
- `HorseTable.tsx` (optional secondary view) — a table-mode of the same horses using `DataTable` (columns: Horse, Age/Sex/Breed, Status, Stable, Owner, Training, Health, actions). Provide a list/table view toggle in PageHeader since DESIGN.md treats tables as first-class; default to master/detail.

### Screen — `src/features/horses/HorseManagementScreen.tsx`
Composes AppShell → PageHeader ("Horses" + context like "48 active horses · Riverside Training Club" + primary `+ Register horse` + secondary Export/More) → master/detail two-pane layout (§ Horse master/detail). Owns state: search query, active status filter, stable/trainer filters, selected horse id, view mode, simulated loading. Wires all interactions. Empty state when filters match nothing; brief simulated loading skeleton on mount.

### `src/App.tsx`
Replace placeholder to render `<HorseManagementScreen />`.

## Interaction behavior to implement
- **Search** — debounced filter across horse name (+ owner, sire/dam microchip where present).
- **Status filtering** — health-status quick filter chips/segmented control + Status dropdown; combine with search.
- **Filters** — Stable and Trainer dropdowns; Clear resets all.
- **Selection** — clicking a list item / table row selects it, updates detail pane, applies selected styling.
- **Navigation** — top-nav module switching (active state), horse tabs switching within detail.
- **Primary action** — `+ Register horse` opens a confirmation/quick-create toast or drawer stub (non-blocking); secondary actions (Export, row More menu) wired to visible feedback.
- **States** — loading skeleton, empty (no horses / no filter matches), selected, training-locked banner.

## Responsive behavior (§ Responsive)
- ≥1280px: full master/detail, left pane 300px.
- 1024–1279px: shrink master pane, allow table horizontal scroll.
- <768px: stack — list becomes full-width compact cards; selecting routes to detail view (simple in-component view switch); primary actions stay reachable.

## Constraints from DESIGN.md to honor
- Flat: background contrast → border → spacing → typography → shadow (shadow only on menus/popovers/dialogs).
- No glassmorphism, big gradients, oversized headings (page title 22–28px), giant KPI cards, per-section cards, huge radii, color-only status.
- Units always on metrics; timestamps on realtime; sentence case; tokens not hardcoded hex.

## Critical files
- `src/index.css` (tokens, fonts, Tailwind `@theme`)
- `src/App.tsx` (render screen)
- `src/components/*` (reusable primitives listed above)
- `src/features/horses/*` (data + screen composition)

## Verification
- Rely on the already-running Vite dev server / preview panel; confirm the screen renders.
- Manually exercise: search, status/stable/trainer filters + Clear, horse selection (list + table), tab switching, module nav active state, register-horse primary action feedback, empty state (search nonsense string), loading skeleton on load, training-lock banner on a locked horse.
- Check responsive reflow at ~1280 / ~1100 / ~700 px widths.
- Confirm no hardcoded hex in components (tokens only) and status badges convey state with text + shape, not color alone.

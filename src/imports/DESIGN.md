---
version: alpha
name: RTMS Prism-Inspired Operational Design System
description: Desktop-first design system for a Racehorse Training & Management System, inspired by Prism's dense equine operations patterns while retaining original RTMS branding and domain-specific workflows.
colors:
  primary: "#6657C7"
  primary-hover: "#5748B8"
  primary-soft: "#F1EEFF"
  primary-subtle: "#F8F6FF"
  background: "#F6F6F8"
  surface: "#FFFFFF"
  surface-subtle: "#FAFAFB"
  surface-muted: "#F2F2F5"
  text-primary: "#27272A"
  text-secondary: "#64646F"
  text-muted: "#6F6F79"
  text-inverse: "#FFFFFF"
  border: "#E3E3E8"
  border-strong: "#CDCDD5"
  focus: "#7C6EE6"
  success: "#1F7A4D"
  success-soft: "#EAF7F0"
  warning: "#8A5B08"
  warning-soft: "#FFF5DD"
  danger: "#C33C3C"
  danger-soft: "#FDECEC"
  info: "#315FA8"
  info-soft: "#EDF3FD"
  isolated: "#704AA1"
  isolated-soft: "#F2EBF8"
  telemetry-live: "#16765A"
  telemetry-stale: "#70707A"
  training: "#496BC3"
  medical: "#B94B58"
  grooming: "#8C6A2E"
  racing: "#5D4FB5"
  finance: "#28756E"
typography:
  page-title:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  section-title:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0em
  card-title:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0.01em
  metric:
    fontFamily: Geist Mono
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
rounded:
  xs: 3px
  sm: 5px
  md: 8px
  lg: 10px
  xl: 12px
  full: 9999px
spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
  topbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    height: 56px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  panel-subtle:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  panel-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  metadata:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3}"
  button-primary-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3}"
  table-row-selected:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.text-primary}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-strong:
    backgroundColor: "{colors.border-strong}"
    height: 1px
  focus-indicator:
    backgroundColor: "{colors.focus}"
    size: 3px
    rounded: "{rounded.full}"
  status-fit:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  status-monitor:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  status-injured:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  status-info:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  status-isolated:
    backgroundColor: "{colors.isolated-soft}"
    textColor: "{colors.isolated}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  telemetry-live:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.telemetry-live}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
  telemetry-stale-indicator:
    backgroundColor: "{colors.telemetry-stale}"
    size: 8px
    rounded: "{rounded.full}"
  module-training-indicator:
    backgroundColor: "{colors.training}"
    size: 8px
    rounded: "{rounded.full}"
  module-medical-indicator:
    backgroundColor: "{colors.medical}"
    size: 8px
    rounded: "{rounded.full}"
  module-grooming-indicator:
    backgroundColor: "{colors.grooming}"
    size: 8px
    rounded: "{rounded.full}"
  module-racing-indicator:
    backgroundColor: "{colors.racing}"
    size: 8px
    rounded: "{rounded.full}"
  module-finance-indicator:
    backgroundColor: "{colors.finance}"
    size: 8px
    rounded: "{rounded.full}"
  page-title:
    typography: "{typography.page-title}"
    textColor: "{colors.text-primary}"
  section-title:
    typography: "{typography.section-title}"
    textColor: "{colors.text-primary}"
  card-title:
    typography: "{typography.card-title}"
    textColor: "{colors.text-primary}"
  body-small:
    typography: "{typography.body-small}"
    textColor: "{colors.text-secondary}"
  metric-value:
    typography: "{typography.metric}"
    textColor: "{colors.text-primary}"
  compact-control:
    height: 36px
    rounded: "{rounded.xs}"
    padding: "{spacing.2}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  feature-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.5}"
  micro-gap:
    size: "{spacing.1}"
  no-gap:
    size: "{spacing.0}"
  dashboard-gap:
    size: "{spacing.8}"
  section-gap-large:
    size: "{spacing.10}"
  page-gap-large:
    size: "{spacing.12}"
---


# RTMS DESIGN.md

## Overview

RTMS is a desktop-first operational management system for racehorse clubs. It serves five primary roles: Head Trainer, Veterinarian, Groom / Stable Hand, Horse Owner, and Club Manager.

The visual and interaction model is intentionally inspired by Prism-style equine operations software: compact navigation, information-dense screens, table-first management, horse-centric master/detail layouts, calendar-based scheduling, and restrained visual hierarchy.

RTMS must NOT be a pixel-for-pixel copy of Prism. Do not copy Prism logos, trademarks, proprietary illustrations, wording, screenshots, or branded assets. Replicate the operational interaction language and information architecture, then apply the RTMS tokens and domain rules defined here.

### Product personality

The UI should feel:
- professional
- calm
- operational
- trustworthy
- information-dense
- stable under heavy daily use
- optimized for repeated work rather than marketing presentation

The UI should NOT feel:
- like a betting platform
- like a fantasy racing game
- like a luxury horse marketplace
- like a consumer fitness application
- like a generic SaaS dashboard full of decorative metric cards

### Primary UX principle

The Horse is the central domain object.

When a user opens a horse, related data should remain reachable from the same context:

- Overview
- Pedigree
- Health
- Training
- Racing
- Schedule
- Media
- Finance where allowed
- Audit/history where allowed

Prefer stable context and tabs over repeatedly navigating away from the Horse.

### Business baseline

This design assumes the following baseline business model.

#### Horse lifecycle

A candidate horse is not yet an official Horse.

Typical lifecycle:

1. Candidate profile is submitted.
2. Candidate is reviewed for stable availability, health, and training suitability.
3. Club Manager approves or rejects admission.
4. Only after approval is an official Horse created.
5. Official Horse enters normal Training, Medical, Stable, Racing, Owner, and Finance workflows.

Candidate/admission statuses:

- GROOM_REVIEW
- WAITING_FOR_STALL
- VET_REVIEW
- TRAINER_REVIEW
- MANAGER_REVIEW
- APPROVED
- REJECTED

Do not show candidate horses inside normal active Horse operations until approved.

#### Training model

A Horse may have many Training Plans historically.

At most one Training Plan should be ACTIVE at a time unless the domain model explicitly changes.

Training Plan contains phases and/or scheduled workouts.

A workout can contain:
- distance
- workload
- surface
- intensity
- planned duration
- assigned staff
- scheduled time
- notes

A completed workout can contain:
- actual duration
- average speed
- maximum speed
- average heart rate
- maximum heart rate
- recovery indicators
- trainer evaluation
- comments
- media/video

#### Medical model

Veterinarian owns:
- examination
- clinical findings
- diagnosis
- treatment plan
- medication
- injury tracking
- preventive care
- medical clearance
- training lock

Training staff do not edit diagnosis or medication.

#### Training lock

A Veterinarian can lock a Horse from training.

A training lock is a system-level restriction, not merely a label.

While locked:
- heavy workouts cannot be assigned
- trainer scheduling must show a blocking reason
- race registration must check medical clearance
- dashboards must show the restriction
- schedule views must show unavailability
- Owner may see a simplified restriction status but not confidential veterinary notes unless permitted

Training lock includes:
- reason
- start time
- review date
- status
- veterinarian
- optional restriction level

#### Stable operations

Groom / Stable Hand owns daily execution of:
- feeding
- stall cleaning
- bathing
- ice bath / recovery care
- assigned routine care tasks
- incident reporting
- assigned training support tasks
- stock awareness and restock requests

Groom does not prescribe treatment or change a training plan.

#### Realtime telemetry

Realtime telemetry may include:
- heart rate
- speed
- temperature
- location
- session timestamp

The system may receive demo telemetry through MQTT.

Telemetry is time-series data. It must not be treated as a replacement for the medical record.

#### Racing readiness

Race readiness is a training/operational assessment.

It is not a veterinary diagnosis.

Race registration should consider:
- readiness
- medical clearance
- active training lock
- race eligibility
- race registration deadline

#### Finance

Owner Finance is primarily a readable summary:
- feeding/stable expenses
- training expenses
- medical expenses
- other club charges
- race winnings
- net summary

Club Manager can access broader financial reporting.

The product is not required to behave like a full accounting ERP unless the project scope explicitly expands.

### Required business flows

#### Flow 1 — Horse Profile & Pedigree

Candidate
→ review
→ approval
→ official Horse
→ profile
→ ownership
→ pedigree
→ race history

#### Flow 2 — Training Plan & Execution

Head Trainer
→ create Training Plan
→ define phases/workouts
→ assign/schedule
→ Groom supports execution where assigned
→ telemetry captured
→ workout completed
→ result recorded
→ Trainer evaluates
→ readiness updated

#### Flow 3 — Medical & Injury

Observation / alert
→ Vet examination
→ optional 3D injury location mark
→ clinical findings
→ diagnosis
→ treatment plan
→ optional training lock
→ follow-up
→ recovery monitoring
→ medical clearance / unlock

### Supporting modules

RTMS uses nine top-level operational modules:

1. Horse Management
2. Training Management
3. Medical & Health
4. Stable & Daily Care
5. Realtime Monitoring
6. Racing
7. Inventory
8. Finance
9. Administration

The UI should expose only modules allowed for the signed-in role.

### Role focus

#### Head Trainer

Primary jobs:
- inspect progress of all horses
- compare fitness trends
- create and maintain training plans
- schedule workouts
- assign daily work
- inspect realtime threshold alerts
- evaluate completed sessions
- review readiness
- choose horses for races
- register eligible horses

#### Veterinarian

Primary jobs:
- inspect stable-wide health state
- open horse medical history
- record examination and diagnosis
- update treatment plans
- mark injury location on a 3D horse model
- lock/unlock training
- monitor preventive care due dates
- review health-related incidents

#### Groom / Stable Hand

Primary jobs:
- inspect stall allocation
- see today's assigned horses and tasks
- follow feeding plan
- complete care checklist
- submit incidents with photos
- support scheduled workouts
- monitor local inventory
- submit restock requests

#### Horse Owner

Primary jobs:
- see owned horses
- inspect profile and pedigree
- inspect race history
- follow current health summary
- inspect weight and readiness
- follow schedule and completed workouts
- watch trial-run media
- read trainer notes
- view periodic finance summary

#### Club Manager

Primary jobs:
- manage horses and staff
- manage stable allocation
- manage catalog/inventory
- manage access and RBAC
- inspect operational reports
- inspect finance reports
- inspect Audit Log
- resolve admission and administrative workflow

### Desktop-first strategy

Primary design target:
- 1440 × 1024

Minimum desktop target:
- 1280px width

Tablet:
- supported for viewing and light operations

Mobile:
- not the primary operational environment
- optimize Owner summary and Groom task checklist for mobile
- dense administration screens may switch to stacked sections rather than full desktop tables

### Screen generation priority for Stitch

Generate screens in this order to establish the design language:

1. Trainer Dashboard
2. Horse Management master/detail
3. Horse Profile — Overview
4. Horse Profile — Training
5. Horse Profile — Health
6. Veterinarian Stable Health Map
7. Veterinarian 3D Injury Examination
8. Groom Daily Task Board
9. Schedule / Calendar
10. Owner Horse Detail
11. Owner Finance Summary
12. Club Manager Audit Log

Each later screen must inherit patterns from earlier screens rather than inventing a new visual language.

## Colors

RTMS uses a cool lavender operational palette inspired by equine management software, combined with neutral surfaces and semantic status colors.

### Brand color

Primary lavender `{colors.primary}` is used for:
- active navigation
- active tabs
- selected rows
- primary actions
- focus affordances
- limited visual emphasis

Do not use the primary color as a large decorative page background.

### Neutral surfaces

Use:
- `{colors.background}` for the application canvas
- `{colors.surface}` for cards, tables, menus, panels
- `{colors.surface-subtle}` for secondary surfaces
- `{colors.surface-muted}` for grouped sections and disabled containers

Tables and forms should feel light and flat.

### Text hierarchy

Use:
- `{colors.text-primary}` for primary content
- `{colors.text-secondary}` for explanatory and secondary content
- `{colors.text-muted}` for timestamps, metadata, placeholders, inactive labels

Never reduce critical information to low-contrast muted text.

### Semantic statuses

#### Horse health

FIT:
- color: `{colors.success}`
- background: `{colors.success-soft}`

MONITOR:
- color: `{colors.warning}`
- background: `{colors.warning-soft}`

INJURED:
- color: `{colors.danger}`
- background: `{colors.danger-soft}`

ISOLATED:
- color: `{colors.isolated}`
- background: `{colors.isolated-soft}`

Status must always combine:
- text
- icon or shape when useful
- color

Never communicate health state by color alone.

#### Training states

Suggested mapping:
- DRAFT → neutral
- SCHEDULED → info
- ACTIVE → primary
- COMPLETED → success
- CANCELLED → muted
- BLOCKED → danger

#### Medical states

Suggested mapping:
- OPEN → danger
- UNDER_TREATMENT → warning
- RECOVERING → info
- CLEARED → success
- CLOSED → neutral

#### Task states

Suggested mapping:
- TODO → neutral
- IN_PROGRESS → primary
- DONE → success
- OVERDUE → danger
- BLOCKED → warning/danger depending on severity

### Alert severity

Info:
- `{colors.info}`

Warning:
- `{colors.warning}`

Critical:
- `{colors.danger}`

Critical alerts must not use pulsing animation continuously.

### Realtime state

Live data:
- `{colors.telemetry-live}`
- display a small LIVE indicator

Stale data:
- `{colors.telemetry-stale}`
- display "Last updated …"

Disconnected:
- danger or muted depending on context
- display explicit "Disconnected"

Do not make a disconnected sensor look like a medical emergency unless actual threshold logic confirms it.

### Module accents

Module accent colors can be used sparingly:
- Training → `{colors.training}`
- Medical → `{colors.medical}`
- Grooming → `{colors.grooming}`
- Racing → `{colors.racing}`
- Finance → `{colors.finance}`

Do not turn every page into a differently colored product.

### Charts

Charts use semantic colors only when the color has meaning.

Use restrained series colors.

Avoid:
- rainbow charts
- 3D charts
- neon gradients
- visually dominant filled areas unless appropriate

Threshold regions may use soft warning/danger backgrounds.

## Typography

Primary UI font:
- Inter

Numeric telemetry font:
- Geist Mono where available
- fallback to a readable monospace

### Hierarchy

Page title:
- `{typography.page-title}`

Section title:
- `{typography.section-title}`

Card title:
- `{typography.card-title}`

Body:
- `{typography.body}`

Small body:
- `{typography.body-small}`

Label:
- `{typography.label}`

Caption:
- `{typography.caption}`

Metric:
- `{typography.metric}`

### Typography behavior

Use sentence case.

Avoid all-caps headings except:
- compact status labels
- small table metadata
- tiny utility tags

Horse name should be visually stronger than metadata but should not look like a marketing hero heading.

Page title should normally stay between 22–28px.

Do not use 40–64px headings on operational screens.

### Numbers and units

Never display a metric without its unit when ambiguity is possible.

Examples:
- 42 bpm
- 49.2 km/h
- 37.8 °C
- 487 kg
- 1,400 m

Keep number and unit visually associated.

### Dates and time

Prefer localized, unambiguous operational formats.

Examples:
- 20 Sep 2026
- 14:30
- 20 Sep 2026, 14:30

Avoid ambiguous numeric date formats in shared operational screens.

## Layout

RTMS follows a Prism-inspired desktop application shell.

### App shell

Default desktop structure:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ RTMS │ Dashboard │ Horses │ Schedule │ Training │ Medical │ Racing │ More   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Page Header                                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Main Content                                                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Top navigation:
- 52–58px height
- white surface
- 1px bottom border
- active module indicated by restrained primary color
- no oversized brand area

User menu and notifications live on the far right.

### Module navigation

Prefer horizontal module navigation on desktop.

Use secondary tabs beneath the page header when a module has multiple subareas.

Example:

Medical:
- Stable Health
- Cases
- Treatments
- Preventive Care
- Alerts

Training:
- Plans
- Schedule
- Sessions
- Readiness
- Alerts

### Horse master/detail layout

Core Horse management pattern:

```text
┌───────────────────────┬──────────────────────────────────────────────────────┐
│ Search / Filters      │ Horse Header                                         │
│                       ├──────────────────────────────────────────────────────┤
│ Horse List            │ Overview | Pedigree | Health | Training | Racing    │
│                       ├──────────────────────────────────────────────────────┤
│                       │ Horse Detail                                         │
└───────────────────────┴──────────────────────────────────────────────────────┘
```

Left pane:
- 280–340px
- searchable
- filterable
- scroll independently when useful

Right pane:
- flexible width
- keeps selected Horse context
- shows tabs

Do not navigate back to a global page merely to change Horse if a master/detail interaction is available.

### Horse header

Horse header contains:
- horse name
- compact image/avatar when available
- health status
- training lock when active
- stable/stall
- owner
- current Trainer where relevant
- quick actions appropriate to role

Do not overload the header with every field.

### Content width

Operational tables and dashboards should use available horizontal space.

Do not impose a narrow blog-style max-width on:
- horse tables
- training schedules
- stable maps
- audit logs
- inventory
- race registration

### Grid

Use a 12-column conceptual grid.

Recommended content gaps:
- compact: `{spacing.3}`
- standard: `{spacing.4}`
- section: `{spacing.6}`

### Spacing

Spacing scale is 4px-based.

Prefer:
- 8px between tightly related controls
- 12px between field label and adjacent microcontent
- 16px inside standard cards/panels
- 24px between sections
- 32px between major blocks

Avoid excessive whitespace.

The product is intentionally denser than a marketing site.

### Page header

A page header may include:
- title
- one sentence or breadcrumb context
- primary action
- secondary actions
- filters when they apply to the whole page

Example:

```text
Training Plans                                  [+ New Training Plan]
Thunder Bolt / Current Season                   [Export] [More]
```

### Tables

Tables are first-class layout primitives.

Use tables for:
- horses
- staff
- training sessions
- medical cases
- preventive care
- inventory
- race registration
- financial transactions
- audit logs

Standard row height:
- 40–46px

Dense mode:
- 34–38px

Tables should support, where relevant:
- sort
- filter
- pagination
- sticky header
- row selection
- bulk actions
- empty state
- loading state
- error state

### Filters

Prefer compact filter bars.

Example:

```text
[Search horse...] [Status ▾] [Stable ▾] [Trainer ▾] [Clear]
```

Do not place every filter inside a large card.

### Dashboard composition

Dashboards should answer operational questions.

Good dashboard blocks:
- horses requiring attention
- today's schedule
- overdue tasks
- active medical restrictions
- fitness trend
- realtime alerts
- upcoming races

Avoid decorative KPI cards that do not lead to an action.

### Responsive behavior

At 1024–1279px:
- collapse secondary navigation where required
- allow master pane to shrink
- convert large 4-column grids to 2 columns
- preserve table horizontal scrolling rather than crushing columns

Below 768px:
- Horse master/detail becomes separate list/detail routes or stacked views
- tables may become compact list cards
- primary actions remain reachable
- Groom checklist and Owner summary receive priority

## Elevation & Depth

RTMS is mostly flat.

Visual hierarchy priority:
1. background contrast
2. border
3. spacing
4. typography
5. shadow only when needed

### Cards and panels

Default panel:
- white surface
- 1px `{colors.border}`
- `{rounded.md}`
- no shadow

### Floating surfaces

Use subtle shadow only for:
- menus
- popovers
- dropdowns
- dialogs
- date pickers
- tooltips

### Modals

Modal backdrop should be restrained.

Critical medical or destructive actions may use a modal.

Do not put routine editing into modals when a side panel or dedicated detail area is more usable.

### Drawers

Use right-side drawers for:
- quick create
- quick edit
- incident details
- task details
- lightweight medical context

Use full pages for:
- complex Training Plan editing
- detailed Medical Examination
- 3D injury workflow
- comprehensive Horse Profile

## Shapes

RTMS uses restrained rectangular geometry.

### Corner radii

Inputs:
- `{rounded.sm}`

Buttons:
- `{rounded.sm}`

Cards:
- `{rounded.md}`

Dialogs:
- `{rounded.lg}`

Badges:
- `{rounded.full}`

3D viewport:
- `{rounded.md}`

Charts:
- use container radius, not rounded chart geometry

### Shape rules

Do not use large pill-shaped containers for normal content.

Pill shapes are reserved for:
- status badges
- small filters
- compact tags

Do not introduce arbitrary radius values.

Avoid:
- excessive circles
- bubbly consumer-app cards
- glassmorphism
- irregular decorative blobs

## Components

This section is normative for screen design.

### 1. Top Navigation

Desktop top navigation contains:
- RTMS brand mark/text
- primary modules
- notification entry
- user/profile menu

Active module:
- primary text
- subtle underline or soft background
- never a giant filled tab

Role-based visibility:
- hide modules users cannot access
- do not merely disable every unauthorized module

### 2. Secondary Tabs

Use tabs for Horse subareas and module subareas.

Horse tabs:
- Overview
- Pedigree
- Health
- Training
- Racing
- Schedule
- Media

Tabs should remain in a stable order.

If a role cannot access a tab:
- hide it, or
- show an explicit restricted state only when awareness is operationally valuable

### 3. Buttons

Primary button:
- one dominant action per logical region
- primary lavender fill
- white text

Secondary button:
- white/neutral surface
- border
- dark text

Tertiary button:
- text/icon only

Destructive button:
- danger color
- requires confirmation when irreversible

Required states:
- default
- hover
- active
- focus
- disabled
- loading

### 4. Icon Buttons

Icon-only buttons require:
- tooltip
- accessible label
- visible focus state

Use for:
- edit
- more
- filter toggle
- panel collapse
- media actions

Do not use an unlabeled ambiguous medical icon for critical actions.

### 5. Inputs

Every field must have a visible label.

Placeholder must not replace the label.

Show validation directly beneath the field.

Required fields:
- explicit required indication
- not color alone

Use grouped forms.

Avoid one giant vertical form with 30 ungrouped fields.

### 6. Select and Combobox

Use select for short controlled lists.

Use searchable combobox for:
- horse selection
- owner selection
- staff selection
- medication
- inventory items
- race selection

### 7. Search

Search should be instant or debounced.

Horse search should support at least:
- horse name

Where data allows:
- microchip
- sire
- dam
- owner

### 8. Status Badge

Status badge must show semantic text.

Horse:
- FIT
- MONITOR
- INJURED
- ISOLATED

Training:
- ACTIVE
- COMPLETED
- BLOCKED

Task:
- TODO
- IN PROGRESS
- DONE
- OVERDUE

Do not invent new colors per status.

### 9. Data Table

Table header:
- sticky when list is long
- compact typography
- sortable state visible

Rows:
- subtle hover
- selected row uses primary-subtle
- row actions aligned right

Avoid card grids when tabular comparison is more efficient.

### 10. Empty State

An empty state must explain:
- what is empty
- whether it is expected
- available action

Example:
"No training sessions are scheduled for this phase."

Do not use huge illustrations.

### 11. Loading State

Use:
- table skeletons
- content skeletons
- inline spinners for actions

Do not blank the entire application during one panel refresh.

### 12. Error State

Show:
- human-readable error
- retry action
- relevant context

For telemetry:
- distinguish network/sensor failure from abnormal horse health.

### 13. Toast

Use toast for non-blocking confirmation:
- task completed
- plan saved
- report submitted

Critical medical restrictions should also remain visible in context, not only in toast.

### 14. Confirmation Dialog

Use for:
- delete
- cancel important plan
- training lock/unlock
- final admission decision
- race registration withdrawal

Include consequence in plain language.

### 15. Side Drawer

Use for:
- quick task detail
- incident preview
- restock request
- quick Horse metadata edit

Do not put 3D examination into a drawer.

### 16. Horse List Item

Contains:
- compact horse image/avatar
- name
- one secondary descriptor
- health status
- optional training-lock icon

Selected state:
- soft primary background
- strong text
- left indicator optional

### 17. Horse Profile Overview

Recommended layout:

```text
┌───────────────────────────────┬──────────────────────────────────────────────┐
│ Horse media / 3D preview      │ Basic Information                           │
│ optional                       │ DOB · Sex · Breed · Microchip               │
│                                │ Owner · Stable · Stall                      │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ Current Health                │ Current Training                            │
│ FIT / MONITOR / ...           │ Active plan · phase · next workout          │
├───────────────────────────────┴──────────────────────────────────────────────┤
│ Upcoming Schedule / Recent Activity                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

The 3D preview on Overview is optional and informational.

The full medical 3D injury workflow is separate.

### 18. Horse Pedigree

Pedigree is a structured genealogy visualization.

Minimum levels:
- horse
- sire
- dam

Optional:
- grandparents
- further generations if data exists

Use a compact tree or generation columns.

Each ancestor node can show:
- registered name
- registration identifier
- sex
- birth year
- breed
- country when relevant

Do not fake pedigree data.

Missing ancestors:
- explicit Unknown / Not available

### 19. Training Plan Card

Show:
- plan name
- horse
- start/end
- phase
- goal
- status
- progress
- next workout

Primary actions:
- View
- Edit when allowed

Avoid showing full session detail inside the plan card.

### 20. Training Plan Editor

Use a full-width operational editor.

Recommended structure:

```text
Plan Header
Goal / Period / Status

Phase Timeline
────────────────────────────────────
Foundation | Conditioning | Race Prep

Workouts
Date | Course/Subject | Distance | Surface | Load | Assigned | Status
```

Prevent scheduling heavy work when an active training lock blocks it.

The restriction must be visible before submit.

### 21. Workout / Training Session

Planned section:
- date/time
- distance
- surface
- load
- intensity
- assigned staff
- target metrics

Result section:
- actual duration
- avg/max speed
- avg/max HR
- recovery
- trainer comment
- video/media

### 22. Fitness Chart

Use line charts for change over time.

Suggested metrics:
- average speed
- max speed
- recovery HR
- workload
- weight
- readiness score if domain defines it

Always show:
- metric
- unit
- period
- hover value
- no-data state

Thresholds must be labeled.

### 23. Realtime Telemetry Panel

Recommended structure:

```text
LIVE · updated 2s ago

Heart Rate        154 bpm
Speed              47 km/h
Temperature       37.9 °C
```

Optional:
- short sparkline
- threshold
- trend

Do not make numeric telemetry huge.

Critical threshold:
- visually clear
- text explanation
- timestamp
- action path

### 24. Alert Center

Categories:
- physiological threshold
- injury risk
- medical restriction
- overdue preventive care
- stable incident
- sensor/disconnection

Each alert:
- horse
- severity
- reason
- timestamp
- source
- acknowledgement state
- action

### 25. Readiness Panel

Readiness should show:
- current readiness state
- last assessment time
- Head Trainer assessment
- medical clearance state
- active restriction if any

Avoid representing readiness as veterinary diagnosis.

### 26. Stable Health Map

This is a core Veterinarian and Groom visualization.

Layout:

```text
Barn A
┌──────────┬──────────┬──────────┬──────────┐
│ A01      │ A02      │ A03      │ A04      │
│ Thunder  │ Black    │ Silver   │ —        │
│ FIT      │ MONITOR  │ INJURED  │ EMPTY    │
└──────────┴──────────┴──────────┴──────────┘
```

Stall tile contains:
- stall number
- horse name
- health status
- critical restriction icon when present
- optional assigned task indicator

Filters:
- stable
- health state
- veterinarian concern
- empty/occupied

Click:
- opens Horse health context

Do not render this as a decorative floorplan if exact physical geometry is unknown.

A logical stall grid is acceptable.

### 27. Medical Examination

Use a focused detail page.

Sections:
- examination metadata
- symptoms / owner or Groom-reported observations
- clinical findings
- diagnosis
- injury location
- treatment recommendation
- restrictions
- follow-up

Clinical findings and reported symptoms must remain distinguishable.

### 28. 3D Horse Injury Viewer

The 3D horse viewer is a REQUIRED domain component for medical injury tracking.

Primary purpose:
- mark injury location
- review recorded injury location
- give Veterinarian spatial context

It is not decorative.

#### Source

Preferred asset format:
- GLB / glTF

Preferred web implementation:
- Three.js
- React Three Fiber in React/Next.js

#### Viewer behavior

Required:
- drag to rotate
- wheel/pinch to zoom
- reset camera
- predefined left/right/front/rear views
- selectable anatomical regions
- selected-region visual highlight
- textual selected-region label

Optional:
- exact point marker
- multiple active injury markers
- injury history overlay

Do NOT auto-rotate continuously during medical workflow.

#### Default camera

Use a three-quarter side view where the full horse is visible.

#### Background

Use neutral application surface.

Avoid:
- scenic environment
- grass field
- dramatic lighting
- racing stadium
- decorative particle effects

#### Anatomical selection

Suggested high-level selectable regions:
- Head
- Neck
- Shoulder
- Chest
- Back
- Abdomen
- Left Front Leg
- Right Front Leg
- Left Hind Leg
- Right Hind Leg
- Left Front Hoof
- Right Front Hoof
- Left Hind Hoof
- Right Hind Hoof

If the GLB model has meaningful mesh names, map regions to mesh identifiers.

If not, use a domain-defined overlay/hit-area system.

#### Injury marker

Injury record should support at least:
- body region
- side where applicable
- injury type
- severity
- status
- diagnosis/reference to examination

Optional for exact visualization:
- mesh identifier
- normalized local coordinates
- x/y/z marker position
- camera snapshot preset

The UI must always store a human-readable region even if 3D coordinates are stored.

#### 3D accessibility

Do not rely on the 3D canvas alone.

Provide a parallel textual body-region selector.

Selected region must be announced/readable outside the canvas.

#### 3D layout

Recommended:

```text
┌────────────────────────────────┬───────────────────────────────────────────┐
│                                │ Injury Details                            │
│          3D HORSE              │                                           │
│                                │ Region: Left Front Leg                    │
│      highlighted region        │ Injury: Tendon inflammation              │
│                                │ Severity: Moderate                        │
│ [Left] [Front] [Right] [Reset] │ Clinical findings                        │
│                                │ Diagnosis                                 │
└────────────────────────────────┴───────────────────────────────────────────┘
```

Desktop split:
- 55–65% viewer
- 35–45% medical form

### 29. Training Lock Banner

When a horse is locked:

```text
TRAINING LOCKED
Veterinarian restriction · Review 23 Sep 2026
[View restriction]
```

Display on:
- Horse header
- Training Plan
- scheduling
- readiness
- race registration where relevant

Do not hide the restriction inside Medical tab only.

### 30. Treatment Plan

Show:
- diagnosis context
- treatment goal
- medication
- dose
- frequency
- duration
- treatment schedule
- restrictions
- follow-up
- status

Medication editing is Veterinarian-only.

### 31. Preventive Care

Categories:
- Vaccination
- Deworming
- Farrier

Preventive care list:
- horse
- care type
- due date
- status
- assigned provider/staff
- completed date
- next due date

Provide:
- upcoming
- overdue
- completed history

Calendar integration is recommended.

### 32. Groom Daily Task Board

This is a core Groom screen.

Default view:
- Today

Group tasks by:
- time
- horse
or
- stable

Task examples:
- Feed
- Clean stall
- Bath
- Ice bath
- Escort to training
- Recovery care
- Stable check

Each task:
- horse
- stall
- scheduled time
- instructions
- status
- completion action

One-click completion is allowed for simple tasks.

Tasks requiring evidence may request:
- note
- photo
- measurement

### 33. Feeding Plan

Horse feeding view:

```text
06:00 Breakfast
- 2 kg oats
- 4 kg hay
- Vitamin supplement

12:00 Lunch
- 3 kg hay

18:00 Dinner
- 2 kg grain
- 4 kg hay
- Electrolyte
```

Show:
- meal time
- item
- amount
- unit
- special instructions
- approved plan/version

Groom can mark a feeding task complete.

Groom does not edit nutrition plan unless the role explicitly receives permission.

### 34. Stable Incident Report

Quick report flow:

1. Horse
2. Incident type
3. Observed time
4. Description
5. Severity / urgency
6. Photos
7. Submit

Incident examples:
- not eating
- signs of colic
- fever
- hoof scratch
- abnormal behavior
- stall hazard

After submit:
- show recipient/escalation state
- preserve reporter/time
- connect health-related incidents to Vet review

### 35. Inventory

Inventory screen is table-first.

Columns:
- item
- category
- location
- quantity
- unit
- reorder level
- status
- last updated

Categories:
- FEED
- MEDICINE
- SUPPLEMENT
- EQUIPMENT
- CARE_SUPPLY

Low stock uses warning state.

Do not make inventory a retail catalog.

### 36. Restock Request

Groom can create:
- item
- requested amount
- reason
- priority
- notes

Manager can:
- review
- approve
- reject
- mark fulfilled

### 37. Schedule / Calendar

Calendar is a major operational screen.

Views:
- Day
- Week
- Month

Optional:
- Agenda

Schedule categories:
- Training
- Treatment
- Preventive Care
- Groom Task
- Race
- Transport
- General Task

Events use soft categorical color accents.

Do not use saturated blocks that overpower text.

Event detail should show:
- horse
- type
- time
- assigned staff
- status
- location
- conflict/restriction

### 38. Race Event

Race event shows:
- name
- location
- date
- track/surface
- distance
- eligibility
- registration deadline
- registered horses

### 39. Race Registration

Before registration, show checks:

```text
Readiness             READY
Medical clearance     CLEARED
Training lock         NONE
Eligibility           PASS
```

If blocked:
- clearly state why
- link to the relevant context
- do not allow silent failure

### 40. Race History

Horse race history table:
- event
- date
- location
- distance
- position
- time
- prize
- notes/media where available

Owner can view this for owned horses.

### 41. Owner Dashboard

Owner UI should be simpler than staff UI.

Primary blocks:
- My Horses
- Current Health
- Readiness
- Upcoming Schedule
- Recent Training
- Latest Trainer Notes
- Race Results
- Finance Summary

Avoid exposing staff-only operational controls.

### 42. Owner Horse Detail

Suggested tabs:
- Overview
- Pedigree
- Health Summary
- Training
- Racing
- Media
- Finance

Health Summary should not expose confidential clinical detail unless the domain permits it.

### 43. Training Media

Use video thumbnail/list for:
- trial run
- workout footage
- trainer-uploaded media

Each media item:
- title
- session
- date
- duration when known
- uploader
- trainer note

Avoid autoplay.

### 44. Owner Finance Summary

Period selector:
- month
- quarter
- custom period when available

Summary:
- stable/feeding
- training
- medical
- other
- total expenses
- race winnings
- net

Use table/detail breakdown below summary.

Avoid financial visualization that implies precision not present in the data.

### 45. Club Manager Dashboard

Operational blocks:
- horses by status
- staff/tasks
- stable occupancy
- upcoming races
- inventory warnings
- medical restrictions
- operating cost summary
- race revenue summary
- recent admin activity

### 46. RBAC

RBAC screen:
- roles list
- permission matrix
- user assignment

Prefer explicit action labels:
- horse.view
- training.manage
- medical.record
- medical.lock_training
- inventory.approve
- finance.view
- audit.view

Do not expose raw technical permission codes without readable labels.

### 47. Audit Log

Audit Log is immutable-looking and table-first.

Columns:
- time
- user
- role
- action
- entity
- entity identifier
- result

Filters:
- user
- role
- action
- entity type
- date range

Detail drawer may show structured metadata.

Do not allow normal users to edit audit entries.

### 48. Notification Center

Notification types:
- medical
- training
- preventive care
- task
- race
- inventory
- system

Each:
- readable message
- time
- source
- deep link
- read/unread

Critical alert ≠ normal notification.

Keep critical alerts visible in operational context.

### 49. Photo / File Upload

Use for:
- stable incident
- medical attachments
- horse documents
- media

Show:
- upload progress
- validation
- preview where useful
- file type/size
- remove before save

### 50. Image Handling

Horse profile images:
- natural aspect ratio
- crop conservatively
- no artificial racing poster effects

Incident photos:
- show thumbnail
- preserve original for review

### 51. KPI / Metric Card

Metric cards are allowed when they answer an operational question.

Good:
- 3 active training locks
- 8 workouts today
- 4 overdue preventive-care tasks

Bad:
- "Total Horses" displayed as a giant decorative number on every page

### 52. Activity Timeline

Use chronological activity for:
- Horse history
- medical follow-up
- training history
- admission workflow

Each entry:
- timestamp
- actor
- event
- short detail
- link to entity

### 53. Admission Review

Use a staged review view:

```text
Candidate Profile
Documents
Stable Review
Vet Review
Trainer Review
Manager Decision
```

Show review states clearly.

Approval action belongs to Manager.

On approval:
- confirm official Horse creation
- show assigned stable/stall
- link to new Horse Profile

### 54. Cross-module restriction presentation

Cross-module rules must be visible near the action they affect.

Examples:

Trainer schedules workout:
- show training-lock blocker inline

Race registration:
- show medical clearance failure inline

Groom opens task:
- show relevant health warning without exposing private diagnosis

Owner:
- show simplified restriction status

### 55. Permissions and privacy

Do not assume all roles can see all data.

Design every screen with role-aware field visibility.

Sensitive examples:
- private veterinary notes
- staff-only incident discussion
- medication detail
- internal audit metadata
- club-wide finance

### 56. Accessibility

Target WCAG 2.2 AA.

Requirements:
- visible keyboard focus
- 4.5:1 normal-text contrast where applicable
- status not represented by color alone
- accessible labels for icon actions
- explicit form labels
- keyboard-reachable menus
- accessible table headers
- readable validation
- motion reduced when user preference requests it

3D viewer:
- parallel textual selector
- camera controls keyboard reachable where feasible
- no critical information exclusively inside canvas

### 57. Stitch generation instructions

When using Google Stitch, treat this file as the visual source of truth.

Generate ONE coherent application, not independent concept screens.

Prompt Stitch with:
- screen purpose
- actor
- exact business context
- required components
- desktop-first target
- instruction to reuse this design system

Recommended prompt prefix:

"Design an RTMS operational web application screen using the attached DESIGN.md as the source of truth. Follow a Prism-inspired equine operations layout: compact module navigation, dense data presentation, subtle lavender accents, white surfaces, thin borders, minimal shadows, and practical horse-centric workflows. Do not create a marketing page."

For Horse screens, add:

"Use the established horse master/detail pattern. Preserve selected horse context and use stable tabs for Overview, Pedigree, Health, Training, Racing, Schedule, and Media where role-appropriate."

For Medical 3D screen, add:

"Create a full-width Veterinarian injury examination screen with a neutral 3D horse viewport on the left and a structured injury/diagnosis form on the right. The 3D model is operational, not decorative. Include rotate, zoom, reset, viewpoint controls, selected anatomical region, injury severity, findings, diagnosis, and training-lock action."

For Groom screen, add:

"Prioritize today's tasks, stall context, feeding details, fast completion actions, and incident reporting. Keep interaction fast and mobile-tolerant."

For Owner screen, add:

"Simplify the staff interface. Prioritize owned horses, health summary, readiness, training schedule, trainer notes, race history, video, and finance summary. Hide operational editing controls."

### 58. Screen consistency rules

Every generated screen must reuse:
- same top navigation
- same typography hierarchy
- same border treatment
- same button family
- same badges
- same table density
- same filters
- same Horse header
- same status semantics

Do not redesign navigation per role.

Role differences should come from:
- module visibility
- available actions
- field visibility
- default dashboard content

### 59. Implementation handoff rules

Coding agents should map tokens to:
- CSS variables
- Tailwind theme
- component variants

Do not hardcode arbitrary colors inside individual pages.

Create reusable components for:
- AppShell
- ModuleNav
- PageHeader
- FilterBar
- DataTable
- StatusBadge
- HorseSelector
- HorseHeader
- HorseTabs
- TrainingLockBanner
- TelemetryMetric
- AlertRow
- StableHealthMap
- DailyTaskRow
- FeedingMeal
- Injury3DViewer
- AuditTable

The 3D viewer is a domain component and should not leak Three.js implementation details into normal page components.

## Do's and Don'ts

### Do

- Use a Prism-inspired operational layout.
- Keep the product visibly RTMS, not Prism-branded.
- Keep Horse as the primary context object.
- Prefer dense, readable tables for collections.
- Prefer tabs for Horse subdomains.
- Use calendar for time-based operational work.
- Keep actions close to the object they modify.
- Show cross-module restrictions before users submit invalid actions.
- Keep health status visible.
- Keep training lock visible across affected screens.
- Make Stable Health Map a first-class Vet/Groom component.
- Make 3D injury marking a first-class Vet workflow.
- Make Groom daily work fast to complete.
- Make Owner interfaces simpler and read-oriented.
- Use semantic states consistently.
- Show units on metrics.
- Show timestamps on realtime information.
- Distinguish stale telemetry from abnormal telemetry.
- Use explicit loading, error, empty, offline, and permission states.
- Preserve role permissions in the UI.
- Keep Audit Log easy to scan and difficult to confuse with editable data.
- Reuse components across screens.
- Maintain desktop information density.
- Keep mobile support strongest for Owner and Groom workflows.
- Use the same selected-Horse context across Horse tabs.
- Provide textual alternatives for 3D anatomical selection.
- Use confirmation for training lock, unlock, rejection, deletion, and other high-consequence actions.
- Keep charts analytical and labeled.
- Keep race registration eligibility checks visible.
- Keep preventive care due dates prominent.
- Show stable/stall information wherever it changes the action.
- Use photos as evidence/context, not decoration.

### Don't

- Do not copy Prism logos, trademarks, proprietary artwork, or exact branded assets.
- Do not make RTMS look like a betting site.
- Do not make RTMS look like a racing game.
- Do not use casino black/gold styling.
- Do not use glassmorphism.
- Do not use large gradients.
- Do not use oversized marketing headings.
- Do not use giant KPI cards merely to fill dashboard space.
- Do not turn every section into a separate card.
- Do not use huge rounded corners.
- Do not use heavy shadows on normal panels.
- Do not hide operational actions behind hover only.
- Do not hide critical medical restrictions inside the Medical tab.
- Do not let Groom change diagnosis, medication, or training plan.
- Do not let Trainer edit veterinary diagnosis.
- Do not expose Manager-only or Vet-only actions to Owner.
- Do not treat telemetry as the medical record.
- Do not interpret sensor disconnection as horse injury.
- Do not use color as the only health indicator.
- Do not show a 3D horse purely as decorative spinning content.
- Do not auto-rotate the 3D horse during medical workflow.
- Do not store an injury only as x/y/z without a human-readable body region.
- Do not make users memorize icon meaning for critical actions.
- Do not allow scheduling that silently violates a training lock.
- Do not allow race registration that silently ignores medical clearance.
- Do not overload Owner views with staff operational details.
- Do not invent pedigree ancestors.
- Do not autoplay training videos.
- Do not use decorative 3D charts.
- Do not use random chart colors.
- Do not invent a new component style on each screen.
- Do not create separate visual identities for each role.
- Do not make dense tables unreadably small.
- Do not sacrifice accessibility for visual similarity to a reference product.

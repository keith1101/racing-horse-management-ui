Continue building the existing RTMS application. Do NOT redesign the application and do NOT change the current visual language.

The existing application already follows the Prism-inspired design system defined in `src/imports/DESIGN.md`. Treat that file and the existing implementation as the source of truth.

## Core constraint

Preserve the existing:

- Prism visual language
- application shell
- TopNav
- PageHeader
- typography
- spacing scale
- colors
- border radii
- status badge conventions
- panel styling
- buttons
- form controls
- data table patterns
- master/detail interaction patterns
- loading, empty, selected, locked and error states
- responsive behavior

Do not introduce a second design system.

Do not replace existing components with newly invented equivalents when an existing reusable component can be extended.

Use design tokens from `DESIGN.md` and `src/index.css`. Do not hard-code arbitrary colors.

The existing Horse Management / Horse Overview implementation is correct and should remain intact.

The goal of this iteration is to EXPAND the application into the missing core RTMS workflows.

---

# APPLICATION INFORMATION ARCHITECTURE

Extend navigation so the application can support these major domains:

- Overview
- Horses
- Training
- Veterinary
- Stable Care
- Racing
- Management

Keep the navigation visually consistent with the current TopNav.

The current Horse Management screen remains under Horses.

Horse Profile should support:

- Overview
- Pedigree
- Health
- Training
- Race History
- Documents

Do not implement placeholder-only pages. Each new screen below must contain realistic domain information and useful interactions.

---

# 1. TRAINING DASHBOARD

Create a Head Trainer-oriented Training Dashboard.

Purpose:
Give the Head Trainer an operational overview of today's training workload, horse readiness, active plans and exceptions.

Page header:

Title:
Training

Description:
Plan, monitor and evaluate racehorse training.

Primary action:
Create training plan

Secondary action:
View schedule

## Summary area

Create compact Prism-style metric cards for:

- Horses in active training
- Training sessions today
- Horses requiring attention
- Average readiness
- Training-restricted horses

Metrics should use Geist Mono where appropriate.

Avoid giant marketing-style cards.

## Today's Training Schedule

Create a dense operational schedule.

Each session should show:

- time
- horse
- training phase
- session type
- distance
- surface
- assigned trainer
- readiness
- status

Statuses can include:

- Scheduled
- In progress
- Completed
- Delayed
- Cancelled

Selecting a session should expose details without navigating away unnecessarily.

## Horse Readiness

Create a table/list showing:

- Horse
- Current phase
- Readiness score
- Latest workload
- Recovery status
- Health status
- Next session

Highlight exceptions such as:

- poor recovery
- elevated heart rate
- veterinarian restriction
- missed training

Use text + icon/shape + color. Never color alone.

## Active Training Plans

Show current plans with:

- horse
- phase
- goal
- date range
- progress
- next session
- trainer

Include realistic mock data based on the horses already present in the project.

---

# 2. TRAINING PLAN

Create a detailed Training Plan screen.

Use a structure that communicates the hierarchy:

Training Plan
→ Phase
→ Training Sessions
→ Training Results

The user must clearly understand that a horse has a plan covering a period, while individual workouts are sessions inside that plan.

## Header

Show:

- Horse identity
- Plan status
- Trainer
- start date
- end date
- overall goal
- progress

Actions:

- Edit plan
- Add phase
- Schedule session

## Training phases

Example phases:

- Foundation
- Conditioning
- Speed Development
- Race Preparation
- Recovery

Each phase should contain:

- phase goal
- date range
- workload target
- distance target
- intensity
- surface preference
- progress

Use an expandable or structured vertical presentation rather than a decorative timeline.

## Session table

Columns:

- Date
- Session
- Distance
- Surface
- Load
- Intensity
- Status
- Result

Selecting a completed session opens its result details.

## Training Result detail

Include:

- average speed
- maximum speed
- average heart rate
- maximum heart rate
- recovery
- trainer assessment
- notes

Use unit-aware metric formatting.

---

# 3. VETERINARY — STABLE HEALTH MAP

Create a Veterinarian operational screen called:

Stable Health

The screen should allow a veterinarian to assess the entire stable quickly.

Do NOT interpret “health map” as a geographical map.

It is a visual stable/horse status board.

## Summary

Show counts for:

- Fit
- Monitor
- Injured
- Isolated
- Training restricted

## Stable board

Group horses by stable or barn section.

Each horse tile should contain:

- horse name
- stall
- health status
- important alert
- training restriction indicator
- latest observation

Health states:

- Fit
- Monitor
- Injured
- Isolated

Selecting a horse opens a medical summary side panel.

## Medical side panel

Show:

- latest examination
- clinical findings
- symptoms
- diagnosis
- current treatment
- medications
- next treatment
- veterinarian
- training restriction

Actions:

- Record examination
- Start treatment
- Update restriction
- View medical record

Keep this operational and data-dense.

---

# 4. MEDICAL RECORD + TREATMENT

Create a detailed veterinary workflow.

Tabs or clearly separated views may include:

- Medical Record
- Examination
- Treatment
- Treatment Schedule

## Examination

Form/record structure:

- examination date
- veterinarian
- reason for examination
- symptoms reported
- clinical findings
- measurements
- diagnosis
- severity
- notes

Make a clear semantic distinction between:

Symptoms = observed/reported signs or problems

Clinical findings = findings produced by professional examination or measurement

## Treatment Plan

Show:

- diagnosis
- treatment objective
- medication
- dosage
- frequency
- start date
- end date
- instructions
- veterinarian
- status

Statuses:

- Planned
- Active
- Completed
- Discontinued

## Treatment Schedule

Create a chronological schedule showing:

- date/time
- treatment
- medication
- dose
- responsible person
- completion state

Allow marking treatment as completed.

## Training restriction

A veterinarian must be able to restrict horse training.

When restricted:

- show the existing `TrainingLockBanner`
- clearly state reason
- veterinarian
- effective date
- review date

This restriction must visually propagate to relevant Training and Horse screens.

Reuse the existing training-lock pattern instead of creating another warning design.

---

# 5. GROOM / STABLE HAND TASK BOARD

Create a Stable Care operational screen.

This is not a generic project-management Kanban board.

It represents daily horse-care operations.

## Header

Title:
Stable Care

Description:
Daily care, feeding, stable maintenance and horse observations.

Filters:

- Date
- Stable
- Assigned staff
- Task type
- Status

## Daily task board

Group tasks logically by:

- horse
or
- time period

Choose whichever produces the clearest operational workflow.

Task types:

- Feeding
- Water
- Grooming
- Stall cleaning
- Exercise preparation
- Medication assistance
- Hoof inspection
- Health observation

Each task displays:

- task
- horse
- due time
- assigned groom
- status
- notes/exception

Statuses:

- Pending
- In progress
- Completed
- Issue reported

## Horse care checklist

Selecting a horse should reveal today's checklist.

Allow interactions to:

- mark complete
- add note
- report issue

## Report issue

Provide a compact workflow to report:

- horse
- issue category
- observation
- severity
- optional photo placeholder
- timestamp

Important issues should become visible to veterinarian/head trainer workflows.

---

# 6. HORSE PEDIGREE

Add a proper Pedigree tab to Horse Profile.

Do not display pedigree as only two text fields.

Create a pedigree visualization suitable for an equine management system.

## Horse identity

Show the selected horse at the root.

Include:

- registered name
- breed
- sex
- DOB
- microchip/registration identifier

## Pedigree tree

Support at least 3 generations visually:

Horse
→ Sire / Dam
→ Grandsire / Granddam

Clearly differentiate paternal and maternal branches through layout and labels, not through color alone.

Every ancestor card can show:

- name
- sex
- year of birth
- breed
- registration identifier
- origin/source when available

Allow selecting an ancestor for additional details.

## Registry information

Include an information panel for external pedigree/registry information.

Fields can include:

- registry source
- registry identifier
- verification state
- last synchronized date

Design this so a future Équidés/SIRE integration can map naturally into the UI, but do not pretend live API connectivity exists.

States:

- Verified
- Unverified
- Verification pending
- Registry unavailable

---

# 7. CANDIDATE HORSE

Create a Candidate Horse workflow separate from official managed horses.

A Candidate Horse represents a horse submitted for evaluation before being accepted into the club/system.

Do not treat candidates as active horses.

## Candidate list

Columns/cards should show:

- candidate name
- owner
- breed
- age
- pedigree verification
- health screening
- evaluation status
- submitted date

Statuses:

- Submitted
- Under review
- Additional information required
- Approved
- Rejected

## Candidate detail

Sections:

### Identity
- name
- DOB
- sex
- breed
- microchip/registration ID
- owner

### Pedigree verification
- sire
- dam
- registry
- registry ID
- verification state

### Health screening
- examination state
- major findings
- veterinarian
- screening date

### Performance information
- race history summary
- relevant performance metrics
- supporting records

### Evaluation

Show a review checklist such as:

- Identity verified
- Pedigree reviewed
- Health screening completed
- Documents complete
- Eligibility reviewed

Actions:

- Request information
- Approve candidate
- Reject candidate

Approval should conceptually convert/promote the Candidate Horse into an official Horse record.

Represent this through UI feedback; no backend is required.

---

# CROSS-MODULE BEHAVIOR

The application should feel like one connected system rather than unrelated mockups.

Examples:

If veterinarian locks Midnight Reign from training:

- Horse Profile displays TrainingLockBanner
- Training Dashboard marks the horse restricted
- Training Plan prevents normal session scheduling
- Stable Health shows the restriction

If a groom reports an injury observation:

- Stable Care records the issue
- Veterinary view shows it as an item requiring review

If a candidate is approved:

- confirmation feedback should indicate that the horse is now available under Horse Management

Use realistic mock state and client-side interactions to demonstrate these relationships.

---

# REUSE EXISTING COMPONENTS

Prefer extending the current components:

- AppShell
- TopNav
- PageHeader
- Button
- IconButton
- StatusBadge
- DataTable
- Select
- SearchInput
- Panel
- TrainingLockBanner
- Toast
- loading/empty state components
- HorseAvatar
- HorseHeader

Create new reusable primitives only when the domain genuinely requires them.

Reasonable additions might include:

- MetricCard
- Timeline
- ProgressBar
- AlertIndicator
- HorseMiniCard
- ScheduleItem

Do not create dozens of one-off UI primitives.

---

# MOCK DATA

Extend the existing horse dataset rather than replacing it.

Keep existing identities such as:

- Thunder Bolt
- Winter Solstice
- Midnight Reign

Add realistic linked mock records for:

- training plans
- training phases
- sessions
- results
- examinations
- diagnoses
- treatments
- treatment schedules
- stable-care tasks
- pedigree ancestors
- candidate horses

Relationships between records must be internally consistent.

---

# RESPONSIVE RULES

Desktop is the primary operating environment.

Maintain the same responsive philosophy as the existing Horse Management implementation.

Desktop:
dense operational layouts and master/detail views.

Tablet:
collapse secondary columns where necessary.

Mobile:
stack content and preserve essential actions.

Tables may horizontally scroll when appropriate rather than destroying information density.

---

# QUALITY REQUIREMENTS

Before considering the iteration complete:

1. Existing Horse Management functionality must still work.
2. No Prism styling should be replaced.
3. All seven requested workflows must be reachable through navigation.
4. Screens must use realistic RTMS information rather than lorem ipsum.
5. Important statuses must never rely on color alone.
6. Training restriction must appear consistently across modules.
7. Loading, empty and relevant exception states should exist.
8. Reuse DESIGN.md tokens and existing components.
9. Avoid oversized SaaS marketing cards.
10. Optimize for a professional racehorse operations application.
11. Do not generate a landing page.
12. Do not simplify domain workflows into generic dashboard cards.

Implement the screens and interactions directly in the existing application.
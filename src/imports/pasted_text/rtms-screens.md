Continue the existing RTMS application and generate the COMPLETE screen set for the system.

Do NOT redesign the visual language.
Do NOT replace the existing Prism-inspired theme.
Do NOT discard the current implementation.

The existing app already has a working Prism design system driven by `DESIGN.md`, `src/index.css`, and reusable components such as:
- AppShell
- TopNav
- PageHeader
- Button / IconButton
- StatusBadge
- DataTable
- SearchInput
- Select
- Panel
- Toast
- TrainingLockBanner
- HorseAvatar
- HorseHeader
and the existing horse-related patterns.

Treat the current implementation as the source of truth.
All new screens must reuse the same tokens, spacing, typography, badge patterns, form patterns, panel styling, table styling, empty/loading/error states, and responsive rules.

The goal now is to generate the FULL RTMS SCREEN SET across the full information architecture, while keeping the current implementation intact.

--------------------------------------------------
GLOBAL RULES
--------------------------------------------------

1. Keep the existing Prism visual language exactly consistent.
2. Do not generate a landing page or marketing website.
3. This is a professional operational application for racehorse training and management.
4. Prefer data-dense, workflow-oriented screens over decorative dashboards.
5. Important states must never rely on color alone.
6. All screens should feel like one connected system.
7. Cross-module state must remain consistent.
8. Extend existing components instead of inventing redundant new ones.
9. Use realistic mock data, not lorem ipsum.
10. Every screen must be reachable through navigation.
11. Include loading, empty, selected, locked, success, confirmation, and error states where relevant.
12. Desktop-first, but preserve responsive behavior for tablet/mobile.

--------------------------------------------------
APPLICATION NAVIGATION
--------------------------------------------------

Generate and wire the following main navigation structure:

- Overview
- Horses
- Training
- Veterinary
- Stable Care
- Racing
- Management

Within Horses, support a Horse Profile IA with tabs or sub-navigation:
- Overview
- Pedigree
- Health
- Training
- Race History
- Documents

--------------------------------------------------
GENERATE THE COMPLETE SCREEN SET
--------------------------------------------------

Create the following screens and make them all navigable inside the application.

==================================================
A. OVERVIEW MODULE
==================================================

1. Overview Dashboard
Purpose:
Operational system-wide overview for daily RTMS activity.

Include:
- Stable status metrics
- Health/restriction metrics
- Today’s training schedule
- Upcoming races
- Requires attention panel
- Open observations feed
- Recent cross-module activity

Use realistic operational summaries, not oversized SaaS cards.

==================================================
B. HORSES MODULE
==================================================

2. Horse Management Screen
Preserve existing implementation and keep it as the primary horse directory.

3. Register Horse Screen
A dedicated horse registration / onboarding screen for official horses.

Include:
- identity fields
- owner assignment
- trainer assignment
- stable/stall assignment
- basic pedigree fields
- status assignment
- initial readiness / training status
- save / cancel flows

4. Horse Profile - Overview Tab
Preserve and refine existing overview tab.

5. Horse Profile - Pedigree Tab
Preserve the existing 3-generation pedigree experience.

6. Horse Profile - Health Tab
Create a true health screen, not a placeholder.
Include:
- current health summary
- medical alerts
- latest examination
- vitals / metrics
- diagnosis summary
- treatment summary
- restriction state
- historical health records table

7. Horse Profile - Training Tab
Create a true training screen.
Include:
- active training plan summary
- phase progress
- upcoming sessions
- recent sessions
- training results summary
- readiness / recovery indicators
- restriction impact if applicable

8. Horse Profile - Race History Tab
Create a true race history screen.
Include:
- race event history
- date
- track / location
- position
- time
- performance notes
- filters and sorting

9. Horse Profile - Documents Tab
Create a document-oriented screen.
Include:
- registration documents
- medical documents
- ownership / contract documents
- upload placeholder interactions
- verification states
- status indicators

==================================================
C. TRAINING MODULE
==================================================

10. Training Dashboard
Head Trainer operational dashboard.

Include:
- horses in active training
- sessions today
- horses requiring attention
- average readiness
- training restricted horses
- today’s schedule
- readiness table
- active training plans

11. Training Plans List
A screen showing all training plans across horses.

Include:
- filters by horse, trainer, phase, status
- searchable list/table
- plan status
- date range
- progress
- quick actions

12. Training Plan Detail
Detailed plan page for a selected horse.

Hierarchy must be clear:
Training Plan → Phases → Sessions → Results

Include:
- horse identity
- trainer
- plan goal
- start/end date
- phases
- session table
- progress tracking
- plan status
- actions: edit plan, add phase, schedule session

13. Training Session Detail
Detailed view for one session.

Include:
- date/time
- session type
- distance
- surface
- load
- intensity
- scheduled staff
- status
- result metrics
- notes
- trainer assessment
- recovery summary

14. Training Schedule Screen
A schedule-centric screen.

Include:
- day / week view
- sessions grouped by time
- horse, phase, trainer, status
- quick filters
- delay / cancel / complete interactions

==================================================
D. VETERINARY MODULE
==================================================

15. Stable Health Screen
Operational veterinarian health map / stable board.

Include:
- counts for Fit / Monitor / Injured / Isolated / Training Restricted
- grouping by stable / barn / section
- horse health tiles
- alerts
- review queue
- selection opens detailed side panel

16. Medical Record Screen
Detailed medical record screen for a selected horse.

Include:
- history of examinations
- diagnoses
- medications
- findings
- symptoms
- attachments/doc placeholders
- record metadata
- vet responsible

17. Examination Screen
A structured examination workflow.

Include:
- examination date
- veterinarian
- reason
- symptoms reported
- clinical findings
- measurements
- diagnosis
- severity
- notes
- save / finalize interactions

Important:
Clearly distinguish symptoms from clinical findings.

18. Treatment Plan Screen
Detailed treatment management screen.

Include:
- diagnosis
- treatment objective
- medication
- dosage
- frequency
- instructions
- start/end dates
- assigned veterinarian
- treatment status

19. Treatment Schedule Screen
Timeline or schedule-oriented treatment execution screen.

Include:
- date/time
- treatment task
- medication
- dose
- responsible person
- completion status
- mark complete actions

20. Restriction Review Screen
A screen focused on training restrictions.

Include:
- current restrictions
- horse
- reason
- effective date
- review date
- veterinarian
- status
- actions to update / review / lift restriction

Use and preserve the existing `TrainingLockBanner` pattern.

==================================================
E. STABLE CARE MODULE
==================================================

21. Stable Care Dashboard / Task Board
Operational groom/stable-hand screen.

Include:
- daily tasks
- filters
- grouped views
- pending / in progress / completed / issue reported
- horse, due time, assigned staff, task type

22. Horse Care Checklist Screen
Detailed daily checklist per selected horse.

Include:
- feeding
- water
- grooming
- stall cleaning
- exercise preparation
- medication assistance
- hoof inspection
- health observation
- mark complete / note actions

23. Issue Report Screen
A compact workflow for issue reporting.

Include:
- horse
- issue category
- observation
- severity
- timestamp
- optional photo placeholder
- submit action

Issue reports must feed into Veterinary review and Overview/open observations.

==================================================
F. RACING MODULE
==================================================

24. Race Events Screen
List of race events.

Include:
- event name
- location
- date
- track type
- status
- search / filter / selection

25. Race Registration Screen
Operational race registration workflow.

Include:
- event details
- eligible horses
- readiness / restriction checks
- registration status
- assign / confirm flows

If a horse is restricted, the UI must show it clearly and prevent normal registration flow.

26. Race Event Detail / Result Screen
Detailed event screen.

Include:
- event information
- registered horses
- participation status
- results
- finishing positions
- recorded times
- notes

27. Horse Race History Screen
This may connect with Horse Profile → Race History, but should also support standalone module navigation.

==================================================
G. MANAGEMENT MODULE
==================================================

28. Candidate Horse Screen
Preserve and refine the current candidate workflow.

29. Candidate Horse Detail Screen
Keep the full evaluation pipeline:

- Identity
- Pedigree verification
- Health screening
- Performance information
- Evaluation checklist

Actions:
- Request information
- Approve candidate
- Reject candidate

30. Contracts Screen
Management view for owner-horse contracts.

Include:
- owner
- horse
- start/end date
- fee
- status
- filters
- detail panel

31. Contract Detail Screen
Include:
- owner info
- horse info
- contract terms
- fee
- duration
- status
- notes
- action area

32. Invoices / Billing Screen
Simple but realistic finance screen.

Include:
- owner
- amount
- due date
- status
- invoice state
- filters
- detail preview

33. Management Summary Screen
A management-facing overview.

Include:
- active horses
- pending candidates
- active contracts
- unpaid invoices
- operational alerts
- quick navigation to core actions

--------------------------------------------------
CROSS-MODULE BEHAVIOR
--------------------------------------------------

Demonstrate connected system behavior.

Examples:
1. If a veterinarian restricts Midnight Reign from training:
- Horse Profile shows TrainingLockBanner
- Training screens show restricted status
- Racing registration blocks or warns appropriately
- Overview reflects the restriction
- Veterinary screens show the active restriction

2. If a groom files an injury or health issue:
- It appears in Overview open observations
- It enters Veterinary review queue
- It can affect horse health state

3. If a candidate horse is approved:
- show confirmation feedback
- show that the horse is now available under Horse Management

4. If a treatment is active:
- health screens reflect it
- treatment schedule reflects upcoming tasks
- training screens surface caution when appropriate

--------------------------------------------------
MOCK DATA
--------------------------------------------------

Use internally consistent mock data across the application.

Preserve existing horses such as:
- Thunder Bolt
- Winter Solstice
- Midnight Reign

Extend the data model with realistic linked records for:
- training plans
- phases
- sessions
- results
- examinations
- diagnoses
- treatments
- treatment schedules
- stable care tasks
- observations
- race events
- race registrations
- race results
- pedigree ancestors
- candidate horses
- contracts
- invoices
- documents

All relationships must be logically consistent.

--------------------------------------------------
UI / UX QUALITY
--------------------------------------------------

Make sure:
- screens are not shallow placeholders
- each screen has purpose-specific information
- tabs contain real content
- tables and panels feel operational
- actions produce toasts / confirmations where appropriate
- selection patterns are consistent
- empty and loading states exist
- forms feel aligned with the current design system

--------------------------------------------------
FINAL REQUIREMENT
--------------------------------------------------

Generate the complete RTMS screen set inside the current project, preserving the existing Horse Management implementation and the Prism design system.

Do not restart from scratch.
Do not change the design language.
Do not simplify the app into generic dashboard cards.

This should result in a full multi-screen RTMS application prototype with complete navigation and realistic cross-module workflows.
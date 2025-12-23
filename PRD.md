# CheckChariot - Pre-Shift Forklift Inspection System

A professional daily pre-shift inspection application enabling forklift operators to perform rapid safety checks and supervisors to monitor fleet compliance and maintenance status.

**Experience Qualities**:
1. **Efficient** - Operators complete inspections in under 2 minutes with intuitive yes/no flows and minimal friction
2. **Trustworthy** - Clear visual hierarchy and professional industrial design inspire confidence in safety-critical workflows
3. **Transparent** - Real-time fleet status visibility gives supervisors instant awareness of equipment readiness

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused workflow application with distinct operator and supervisor modes, persistent inspection data, and straightforward CRUD operations without complex business logic or external integrations.

## Essential Features

### Equipment Selection
- **Functionality**: Operator selects forklift category (CACES 1, 3, or 5) and enters/selects unit ID before inspection
- **Purpose**: Ensures inspection data is properly attributed to specific equipment
- **Trigger**: App launch or "Start New Inspection" button
- **Progression**: Landing screen → Category selection (3 large cards) → Unit ID input/selection → Begin inspection
- **Success criteria**: Selected equipment type and ID are stored with inspection record; cannot proceed without both values

### Randomized Inspection Quiz
- **Functionality**: Presents 8-10 yes/no safety questions mixing universal checks with category-specific items
- **Purpose**: Maintains inspection variety to prevent checklist fatigue while ensuring critical components are checked
- **Trigger**: After equipment selection is confirmed
- **Progression**: Question display with large Yes/No buttons → Auto-advance on "Yes" → Comment field appears on "No" → Progress indicator → Final submission
- **Success criteria**: All questions answered; at least 3-4 category-specific questions included; no duplicate questions in single inspection

### Defect Reporting
- **Functionality**: When operator selects "No", comment field and severity selector appear for issue documentation
- **Purpose**: Captures actionable maintenance information and enables prioritization
- **Trigger**: "No" answer on any inspection question
- **Progression**: "No" tapped → Comment textarea slides in → Operator types description → Optional severity toggle (Minor/Critical) → Continue to next question
- **Success criteria**: All defects have text descriptions; severity defaults to "needs attention" if not explicitly marked critical

### Supervisor Dashboard
- **Functionality**: Overview showing today's inspection count, defect summary, equipment status grid, and filterable history
- **Purpose**: Enables supervisors to monitor compliance and identify equipment requiring maintenance
- **Trigger**: Supervisor mode toggle or dedicated route
- **Progression**: Dashboard loads → Summary cards (inspections today, defects, compliance %) → Fleet status grid (color-coded) → Inspection history table (filterable by date/equipment/status)
- **Success criteria**: Data updates after each submitted inspection; defects are prominently highlighted; can filter history by date range and equipment

### Fleet Status Visualization
- **Functionality**: Equipment grid showing each unit's current operational status with color coding
- **Purpose**: Instant visual awareness of which equipment is ready for operation
- **Trigger**: Displayed automatically in supervisor dashboard
- **Progression**: Grid layout → Equipment cards show ID, type, last inspection time, status → Click card to view inspection details and defect history
- **Success criteria**: Status accurately reflects latest inspection; green (all OK), orange (minor issues), red (critical defects); timestamp shows hours since last check

### Maintenance Action Tracking
- **Functionality**: Automatic creation of maintenance actions from inspection defects with status tracking (pending, in-progress, completed, cancelled)
- **Purpose**: Close the loop between defect identification and resolution; ensure all issues are tracked to completion
- **Trigger**: Created automatically when inspection contains defects; supervisors manage from dedicated Maintenance tab
- **Progression**: Defect reported → Maintenance action created (pending) → Supervisor assigns to technician and starts work (in-progress) → Technician completes with resolution notes (completed)
- **Success criteria**: Each defect generates a trackable action; supervisors can filter by status; resolution notes are required for completion; critical issues are visually prioritized

### Resolution Status Management
- **Functionality**: Supervisors and maintenance staff can update action status, assign work, and document resolutions
- **Purpose**: Enable accountability and tracking of maintenance work completion
- **Trigger**: Supervisor clicks on maintenance action in Maintenance tab
- **Progression**: View pending action → Assign to technician and start → Work in progress → Complete with resolution notes → Resolution logged with timestamp and user
- **Success criteria**: Status changes persist; resolution notes include what was done; completed actions show who resolved and when; can view resolution history

## Edge Case Handling

- **No Inspections Yet**: Dashboard shows empty state with helpful prompt to start first inspection
- **No Maintenance Actions**: Maintenance tab shows empty state when no defects have been reported
- **Incomplete Inspection**: "Save as Draft" option if operator needs to pause mid-inspection; draft accessible from landing page
- **Duplicate Inspection**: Warn if same equipment was already inspected today; allow override with reason
- **Missing Unit ID**: Validation prevents proceeding without valid equipment identifier
- **Network Issues**: Inspections save to local storage and sync when connection restored
- **Very Old Equipment**: Show warning if equipment hasn't been inspected in 48+ hours
- **Completing Without Resolution Notes**: Prevent completing maintenance actions without resolution description
- **Critical Items in Pending State**: Visually prioritize critical severity items in maintenance queue

## Design Direction

The design should evoke **industrial professionalism with safety-first clarity**. This is a tool used in active warehouses and loading docks—it must feel robust, authoritative, and purpose-built. Think control panels, construction sites, and professional-grade tools. High contrast for glanceability in various lighting conditions, generous touch targets for gloved hands, and zero ambiguity in status communication.

## Color Selection

A sophisticated dark industrial palette with high-contrast safety colors for status communication.

- **Primary Color**: Deep slate blue `oklch(0.35 0.04 250)` - Professional and authoritative without being harsh; used for primary actions and headers
- **Secondary Colors**: 
  - Warm charcoal `oklch(0.25 0.01 280)` for backgrounds and cards
  - Cool steel gray `oklch(0.45 0.02 260)` for secondary elements and borders
- **Accent Color**: Vibrant amber `oklch(0.75 0.15 75)` - High-visibility warning color for "needs attention" states and CTAs
- **Status Colors**:
  - Success green `oklch(0.65 0.18 145)` for operational/all clear
  - Alert orange `oklch(0.70 0.17 60)` for minor issues/attention needed
  - Critical red `oklch(0.60 0.22 25)` for out of service/critical defects
- **Foreground/Background Pairings**:
  - Primary slate `oklch(0.35 0.04 250)`: White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Background charcoal `oklch(0.25 0.01 280)`: Light gray text `oklch(0.85 0.01 260)` - Ratio 7.4:1 ✓
  - Accent amber `oklch(0.75 0.15 75)`: Dark text `oklch(0.20 0.02 280)` - Ratio 8.9:1 ✓
  - Success green `oklch(0.65 0.18 145)`: White text `oklch(0.98 0 0)` - Ratio 4.8:1 ✓
  - Critical red `oklch(0.60 0.22 25)`: White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓

## Font Selection

Typography should communicate industrial precision and high readability in active work environments with varying light conditions and viewing distances.

- **Primary Typeface**: Space Grotesk - Technical, geometric, and highly legible; perfect for industrial applications
- **Secondary Typeface**: JetBrains Mono - Used sparingly for equipment IDs and timestamps to create visual distinction

- **Typographic Hierarchy**:
  - H1 (Screen Titles): Space Grotesk Bold / 32px / -0.02em letter spacing / 1.2 line height
  - H2 (Section Headers): Space Grotesk SemiBold / 24px / -0.01em letter spacing / 1.3 line height
  - H3 (Card Titles): Space Grotesk Medium / 18px / normal letter spacing / 1.4 line height
  - Body (Questions/Content): Space Grotesk Regular / 16px / normal letter spacing / 1.6 line height
  - Small (Meta/Timestamps): Space Grotesk Regular / 14px / normal letter spacing / 1.5 line height
  - Equipment IDs: JetBrains Mono Medium / 15px / normal letter spacing / 1.4 line height

## Animations

Animations reinforce the app's purpose-built efficiency—quick, precise, and confidence-inspiring. No decoration, only function.

- **Question transitions**: Subtle 200ms slide with slight fade when advancing through inspection questions—maintains spatial awareness
- **Defect field reveal**: 250ms height expansion with ease-out when comment field appears—clear cause and effect
- **Status changes**: 150ms color transitions on equipment status badges—immediate feedback without jarring shifts
- **Button interactions**: 100ms scale (0.98) on press for tactile feedback—reinforces successful tap registration
- **Dashboard updates**: Gentle 300ms fade-in when inspection data refreshes—professional and unobtrusive

## Component Selection

- **Components**:
  - **Card**: Equipment type selection, status cards, defect summaries—with custom border treatments for status colors
  - **Button**: Primary actions (Yes/No, Submit, Start Inspection)—large variants (min 60px height) for easy tapping
  - **Textarea**: Defect comment input—with character count and auto-focus on reveal
  - **Badge**: Status indicators, category labels—color-coded with solid backgrounds for high contrast
  - **Progress**: Visual indicator during multi-question inspection—reinforces completion progress
  - **Tabs**: Switch between Operator/Supervisor/Maintenance modes—clear active state with accent underline
  - **Table**: Inspection history and maintenance actions—with sortable columns and row highlighting
  - **Select**: Equipment ID selection from existing fleet, maintenance status filters—with search/filter capability
  - **Separator**: Visual breaks between dashboard sections—subtle with low opacity
  - **Alert**: Warnings for duplicate inspections or old equipment—with appropriate status colors
  - **Dialog**: Maintenance action details, resolution entry, assignment dialogs—modal overlays for focused workflows
  - **Input**: Technician assignment, resolution notes—with proper focus states

- **Customizations**:
  - **Touch-optimized buttons**: Minimum 56px height with 12px vertical padding for gloved operation
  - **Status cards**: Custom gradient borders using status colors for immediate visual differentiation
  - **Question cards**: Large centered layout with oversized Yes/No buttons occupying 40% width each
  - **Equipment grid**: Responsive CSS Grid with auto-fit columns, min 200px cards with hover lift effect

- **States**:
  - **Buttons**: Default (solid primary), hover (brightness increase), active (scale 0.98), disabled (50% opacity with cursor-not-allowed)
  - **Inputs**: Default (subtle border), focus (accent color ring with 3px width), error (red border with shake animation), filled (border color intensifies)
  - **Equipment cards**: Default (neutral border), OK (green left border accent), Warning (orange left border), Critical (red left border with pulse)

- **Icon Selection**:
  - **Check** (circle check mark): Affirmative answers, successful inspections
  - **X** (X circle): Negative answers, defects
  - **Warning** (warning): Attention-needed states, alerts
  - **ClipboardText**: Inspection actions, reports
  - **Funnel**: Filter controls in dashboard
  - **Calendar**: Date range selectors
  - **Truck** (forklift representation): Equipment type indicators
  - **ListChecks**: Inspection checklists
  - **Eye**: View inspection details
  - **Wrench**: Maintenance actions and repairs
  - **Clock**: Pending maintenance status
  - **Play**: Start/in-progress maintenance work
  - **CheckCircle**: Completed maintenance actions

- **Spacing**:
  - Card padding: `p-6` (24px) for generous touch zones
  - Section gaps: `gap-8` (32px) for clear visual separation
  - Button spacing: `gap-4` (16px) between related actions
  - Form field gaps: `gap-6` (24px) for clear question separation
  - Grid gaps: `gap-6` (24px) in equipment grids

- **Mobile**:
  - Single-column layout for inspection flow with full-width buttons
  - Equipment selection cards stack vertically with 16px gaps
  - Supervisor dashboard: tabs become full-width, table becomes scrollable cards on mobile
  - Bottom-fixed action buttons for thumb-zone accessibility during inspections
  - Reduce font sizes by 2px on screens < 640px while maintaining 44px minimum touch targets

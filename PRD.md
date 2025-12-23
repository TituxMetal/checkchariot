# CheckChariot v2 - Product Requirements Document

CheckChariot v2 est une application d'inspection quotidienne avant prise de poste pour chariots élévateurs (CACES 1, 3, 5). Les opérateurs sélectionnent leur équipement et répondent à des questions de sécurité contextuelles avec des positions de boutons randomisées pour éviter le "mode pilote automatique".

**Experience Qualities**:
1. **Professionnel** - Interface sérieuse et claire qui inspire confiance pour des tâches de sécurité critiques
2. **Intuitif** - Navigation simple et directe, adaptée aux environnements industriels avec gants
3. **Vigilant** - Randomisation des réponses pour maintenir l'attention des opérateurs lors des inspections répétitives

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused safety inspection tool with equipment selection, randomized quiz flow, defect reporting, and supervisor dashboard. It manages inspection state and history but doesn't require complex multi-view navigation or advanced business logic.

## Essential Features

**Equipment Selection**
- Functionality: Display categorized list of forklifts (CACES 1/3/5) with unique ID and friendly name
- Purpose: Allow operators to quickly identify and select their assigned equipment
- Trigger: App launch or "New Inspection" action
- Progression: Launch → View categorized list → Tap equipment card → Confirm selection → Start inspection
- Success criteria: Equipment selected, inspection session initialized with correct category

**Randomized Inspection Quiz**
- Functionality: Present 6-8 safety questions in French with 2-4 contextual answers per question, buttons in random positions
- Purpose: Ensure thorough pre-shift safety checks while preventing autopilot behavior
- Trigger: After equipment selection
- Progression: Question 1 → Select answer from randomized positions → (If problem: add comment) → Next question → Repeat → Complete inspection
- Success criteria: All questions answered, defects properly logged, inspection recorded with timestamp

**Defect Reporting**
- Functionality: When problematic answer selected, show comment field for details
- Purpose: Capture specific defect information for maintenance action
- Trigger: Selection of non-OK answer
- Progression: Select problem answer → Comment field slides in → Type description → Continue to next question
- Success criteria: Defect comments saved with answer, supervisor/maintenance notified

**Supervisor Dashboard**
- Functionality: Overview of today's inspections, defect alerts, weekly/monthly trends, fleet status
- Purpose: Monitor fleet safety compliance and identify equipment issues
- Trigger: Supervisor mode tab selection
- Progression: Open supervisor view → See today's summary → Filter by equipment/date/status → Drill into specific inspection → View details
- Success criteria: All inspections visible, defects highlighted, historical data accessible

**Fleet Status Overview**
- Functionality: Visual status indicators (green/orange/red) for each piece of equipment
- Purpose: Quick identification of equipment availability and issues
- Trigger: Visible in supervisor dashboard
- Progression: View fleet grid → See color-coded status → Identify problematic equipment → Drill into details
- Success criteria: Status accurately reflects latest inspection, color coding clear and consistent

## Edge Case Handling

- **Duplicate Inspection**: If equipment already inspected today, show warning with previous inspection time and allow override
- **Incomplete Inspection**: If operator navigates away mid-inspection, show confirmation dialog to prevent data loss
- **No Equipment Available**: Display helpful message if equipment list is empty with supervisor contact info
- **Offline Mode**: Questions and equipment list work offline; sync inspections when connection restored
- **Missing Comment on Defect**: Require comment field for critical defects before allowing progression

## Design Direction

The design should evoke **industrial reliability** and **safety-first professionalism**. Think heavy machinery control panels - clear, high-contrast, purposeful. The interface must feel robust and trustworthy, appropriate for warehouse environments where operators may be wearing gloves or working in challenging lighting conditions. Dark theme reduces eye strain during early morning shifts.

## Color Selection

A professional industrial palette with clear safety color coding.

- **Primary Color**: Deep Slate Blue `oklch(0.35 0.04 250)` - Conveys professionalism and calm authority, used for primary actions and headers
- **Secondary Colors**: 
  - Medium Slate `oklch(0.45 0.02 260)` for secondary buttons and less prominent UI elements
  - Card backgrounds `oklch(0.30 0.015 275)` for content containers that feel substantial
- **Accent Color**: Bright Yellow-Green `oklch(0.75 0.15 75)` - High-visibility alert color for attention-grabbing CTAs and important information
- **Status Colors**:
  - Success/OK: Vibrant Green `oklch(0.65 0.18 145)` - Equipment cleared for operation
  - Warning: Warm Yellow `oklch(0.70 0.17 60)` - Minor issues, report to supervisor
  - Critical: Bold Red `oklch(0.60 0.22 25)` - Equipment out of service
- **Foreground/Background Pairings**:
  - Background Dark `oklch(0.25 0.01 280)`: Light Gray text `oklch(0.85 0.01 260)` - Ratio 11.2:1 ✓
  - Card `oklch(0.30 0.015 275)`: Light Gray text `oklch(0.85 0.01 260)` - Ratio 9.8:1 ✓
  - Accent Yellow `oklch(0.75 0.15 75)`: Dark text `oklch(0.20 0.02 280)` - Ratio 9.5:1 ✓
  - Success Green `oklch(0.65 0.18 145)`: White text `oklch(0.98 0 0)` - Ratio 5.2:1 ✓
  - Warning Yellow `oklch(0.70 0.17 60)`: Dark text `oklch(0.20 0.02 280)` - Ratio 10.1:1 ✓

## Font Selection

Typography should be highly legible in warehouse conditions with strong geometric clarity.

- **Primary Font**: Space Grotesk - Modern geometric sans with excellent legibility at all sizes, perfect for industrial applications
- **Monospace Font**: JetBrains Mono - Used for equipment IDs and technical data to create clear visual distinction

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 28px / tight tracking (-0.02em)
  - H2 (Section Headers): Space Grotesk Semibold / 22px / normal tracking
  - H3 (Equipment Names): Space Grotesk Medium / 18px / normal tracking
  - Body (Questions, Descriptions): Space Grotesk Regular / 16px / relaxed line-height (1.6)
  - Equipment IDs: JetBrains Mono Medium / 14px / monospace tracking
  - Small (Meta info): Space Grotesk Regular / 14px / normal tracking

## Animations

Animations should be purposeful and reinforce the sense of progression through the inspection process.

- **Answer selection**: Quick scale + color flash (150ms) to provide immediate tactile feedback
- **Question transitions**: Smooth slide transition (300ms) to show forward progress
- **Defect comment field**: Gentle slide-down expansion (250ms) when problem answer selected
- **Status indicators**: Subtle pulse on critical defects (2s loop) to draw attention
- **Page transitions**: Fade between operator/supervisor modes (200ms) for smooth context switching

## Component Selection

- **Components**:
  - Tabs: Mode switching between Operator/Supervisor/Maintenance views
  - Card: Equipment items, inspection summaries, dashboard widgets - elevated appearance with subtle borders
  - Button: Answer buttons with random positioning, primary/secondary actions - large touch targets (min 56px height)
  - Input + Textarea: Comment fields for defect reporting - clear focus states
  - Badge: Status indicators (OK/Warning/Critical), CACES category labels
  - Accordion: Collapsible inspection history details
  - Dialog: Confirmation dialogs for duplicate inspections
  - Progress: Visual indicator of quiz completion (question 3/8)
  - Toast: Success/error notifications using Sonner
  
- **Customizations**:
  - Answer button container: Custom flex layout with random flex-direction and order properties
  - Equipment cards: Large touch-friendly cards with CACES category color stripe
  - Dashboard stats cards: Custom metric displays with large numbers and trend indicators
  
- **States**:
  - Buttons: Hover (slight scale 1.02), Active (scale 0.98), Disabled (reduced opacity), Selected (bold border + background shift)
  - Inputs: Focus (accent ring + border color), Error (red ring), Success (green indicator)
  - Cards: Hover (subtle elevation increase), Selected (accent border)
  
- **Icon Selection**:
  - Navigation: Tabs, List, ChartBar for mode switching
  - Equipment: Forklift icon representation (custom or from Phosphor)
  - Actions: CheckCircle (OK), Warning (minor issue), XCircle (critical)
  - Add/Edit: Plus, Pencil, Trash
  - Status: Circle, CircleDashed, CircleNotch for loading
  
- **Spacing**:
  - Container padding: px-4 md:px-8 (consistent page margins)
  - Card padding: p-6 (generous internal spacing)
  - Stack gap: gap-4 for form elements, gap-6 for sections
  - Grid gap: gap-4 for equipment grid, gap-6 for dashboard widgets
  
- **Mobile**:
  - Equipment grid: Single column on mobile, 2-3 columns on tablet/desktop
  - Answer buttons: Always stack vertically on mobile for thumb-friendly interaction
  - Dashboard: Single column stat cards on mobile, grid layout on desktop
  - Navigation tabs: Full-width on mobile, compact on desktop
  - Question text: Larger font size on mobile (18px) for easy reading

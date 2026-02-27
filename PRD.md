# LaunchKit PRD

LaunchKit transforms raw business ideas into comprehensive, professionally designed business assets through AI-powered analysis and generation.

**Experience Qualities**:
1. **Intelligent** - The system understands context and maintains logical consistency across all generated materials, making smart connections between market data, financials, and strategy.
2. **Empowering** - Users feel like they have a strategic partner that transforms their rough ideas into polished, investor-ready materials with confidence-building professionalism.
3. **Efficient** - What traditionally takes weeks of consultant work happens in minutes, with a streamlined wizard that guides users without overwhelming them.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
LaunchKit is a sophisticated multi-stage application that requires state management across a wizard interface, AI processing coordination, dynamic content generation, and multiple output formats. It orchestrates multiple interdependent features (intake, analysis, generation, preview) with persistent data and contextual intelligence.

## Essential Features

### Idea Intake Wizard
- **Functionality**: Multi-step form that collects essential business information through guided questions
- **Purpose**: Captures the raw material needed for AI analysis while making the process approachable
- **Trigger**: User clicks "Start New Project" on landing page
- **Progression**: Landing → Wizard Step 1 (Basic Info) → Step 2 (Problem/Solution) → Step 3 (Market) → Step 4 (Revenue) → Step 5 (Vibe Selection) → Processing → Dashboard
- **Success criteria**: All required fields completed, data persisted, user can navigate back/forward through steps

### AI-Powered Document Import
- **Functionality**: Users paste text from README, business plan, or notes; AI extracts structured data to pre-fill wizard
- **Purpose**: Eliminates manual data entry for users who already have documentation
- **Trigger**: User clicks "Import from Document" button on wizard start
- **Progression**: Wizard Start → Import Modal → Paste Text → AI Processing → Wizard Pre-filled → User Reviews/Edits
- **Success criteria**: Extracted data correctly populates appropriate wizard fields, user can override any field

### Business Asset Generation
- **Functionality**: Generates comprehensive business deliverables (brand identity, market analysis, financials, pitch deck, marketing plan)
- **Purpose**: Provides users with professional materials they need to launch and pitch their business
- **Trigger**: User completes wizard and clicks "Generate Assets"
- **Progression**: Wizard Complete → Generation Queue → Progress Indicators → Dashboard with Generated Assets
- **Success criteria**: All asset categories generated with consistent branding and logical coherence across documents

### Asset Dashboard & Export
- **Functionality**: Central hub displaying all generated assets organized by category with preview and export options
- **Purpose**: Makes generated materials easily accessible and actionable
- **Trigger**: Generation completes automatically, or user navigates to existing project
- **Progression**: Generation Complete → Dashboard View → Select Asset Category → Preview Asset → Export/Download
- **Success criteria**: Assets are organized, searchable, previewable, and exportable in appropriate formats

### Brand Vibe System
- **Functionality**: User selects from 5 curated brand aesthetics (Minimal, Bold, Luxury, Tech, Rebel) that determine visual styling
- **Purpose**: Ensures cohesive, professional branding without requiring design expertise
- **Trigger**: Step 5 of wizard presents vibe options with visual examples
- **Progression**: Vibe Selection → Preview Examples → Confirm Choice → Applied to All Assets
- **Success criteria**: Selected vibe consistently reflected in colors, typography, and layout across all deliverables

## Edge Case Handling

- **Incomplete Wizard Data**: System highlights required fields and prevents progression, with helpful prompts explaining why each field matters
- **AI Extraction Failures**: Falls back to empty wizard with friendly message suggesting manual entry if document parsing fails
- **Generation Timeout**: Shows progress indicators for long-running tasks; allows user to navigate away and return later to completed assets
- **Duplicate Projects**: Auto-saves drafts with timestamps; allows users to clone previous projects as starting points
- **Unsupported Content**: Gracefully handles edge cases like non-English text or highly technical jargon with clarification requests

## Design Direction

LaunchKit should feel like a powerful, sophisticated tool that makes users feel competent and professional. The design should evoke trust, intelligence, and forward momentum - like having a strategic consulting firm in your pocket. It should balance complexity with clarity, using confident design choices that signal premium quality while remaining approachable. The interface should feel like a command center for launching ventures, with data-driven intelligence and polished execution.

## Color Selection

The color scheme balances professional credibility with energetic ambition - a fusion of venture capital sophistication and startup dynamism.

- **Primary Color**: Deep Electric Indigo `oklch(0.45 0.15 270)` - Represents intelligence, strategy, and premium positioning. Used for primary CTAs and key interface elements to convey authority and innovation.
- **Secondary Colors**: 
  - Slate Foundation `oklch(0.25 0.01 260)` - Anchors the interface with stability and professionalism for backgrounds and structural elements
  - Warm Graphite `oklch(0.35 0.02 265)` - Secondary buttons and cards, providing depth without competing with primary
- **Accent Color**: Vibrant Cyan `oklch(0.70 0.15 195)` - Energetic highlight for progress indicators, success states, and interactive moments that demand attention
- **Foreground/Background Pairings**: 
  - Primary Indigo `oklch(0.45 0.15 270)`: White text `oklch(0.98 0 0)` - Ratio 7.2:1 ✓
  - Slate Foundation `oklch(0.25 0.01 260)`: Light Gray text `oklch(0.92 0.01 260)` - Ratio 12.5:1 ✓
  - Warm Graphite `oklch(0.35 0.02 265)`: White text `oklch(0.98 0 0)` - Ratio 9.8:1 ✓
  - Accent Cyan `oklch(0.70 0.15 195)`: Dark text `oklch(0.20 0.02 260)` - Ratio 8.1:1 ✓
  - Background `oklch(0.97 0.005 260)`: Foreground `oklch(0.20 0.02 260)` - Ratio 14.2:1 ✓

## Font Selection

Typography should project strategic intelligence and contemporary sophistication - fonts that feel both analytical and aspirational, suitable for a tool that bridges creative vision with business execution.

- **Primary Font**: Space Grotesk - A geometric sans-serif with technical precision and modern confidence, perfect for headers and key interface elements
- **Secondary Font**: Inter - A highly legible workhorse font for body text, forms, and data-dense interfaces
- **Accent Font**: JetBrains Mono - Used sparingly for data points, metrics, and technical elements to add analytical credibility

**Typographic Hierarchy**:
- H1 (Project Name): Space Grotesk Bold / 36px / -0.02em letter spacing / 1.1 line height
- H2 (Section Headers): Space Grotesk SemiBold / 28px / -0.01em / 1.2
- H3 (Subsections): Space Grotesk Medium / 20px / 0em / 1.3
- Body (Form Labels, Content): Inter Regular / 15px / 0.01em / 1.6
- Body Large (Key Instructions): Inter Medium / 17px / 0em / 1.5
- Caption (Helper Text): Inter Regular / 13px / 0.02em / 1.4
- Metric/Data: JetBrains Mono Medium / 16px / 0em / 1.3

## Animations

Animations should reinforce the sense of intelligent processing and forward progress, with purposeful motion that feels both efficient and sophisticated. Use animations to guide attention through complex workflows and celebrate milestone achievements. Balance smooth, confident transitions (300-400ms) with occasional moments of delight during generation completion. Progress indicators should pulse with life, form steps should slide smoothly, and asset cards should cascade into view with staggered timing to create rhythm. Avoid frivolous motion - every animation serves to orient, inform, or reward.

## Component Selection

- **Components**: 
  - Wizard: Custom multi-step form using Tabs component for progress visualization with custom styling for active/complete states
  - Cards: Heavy use of Card component for asset displays, wizard steps, and vibe selection with hover states and shadows
  - Dialog: For document import modal and asset previews with full-screen option
  - Buttons: Primary (filled), Secondary (outlined), Ghost variants with consistent sizing and Phosphor icons
  - Progress: Custom circular progress for generation status with percentage display
  - Textarea: For idea input and document import with auto-resize
  - Input: For structured data collection with inline validation
  - Badge: For asset categories and status indicators
  - Tabs: For dashboard asset organization
  - ScrollArea: For long content within modals and previews
  - Separator: For visual hierarchy in dense information displays
  
- **Customizations**: 
  - Custom wizard stepper component with branching logic visualization
  - Animated generation queue with cascading asset cards
  - Vibe selector with large preview cards showing color swatches and typography samples
  - Asset preview component with split view (navigation + content)
  
- **States**: 
  - Buttons: Default → Hover (scale 1.02, shadow increase) → Active (scale 0.98) → Loading (spinner) → Success (checkmark pulse)
  - Form Inputs: Rest → Focus (border color change + glow) → Filled (checkmark indicator) → Error (shake + red border)
  - Cards: Rest → Hover (lift with shadow) → Selected (border + glow)
  - Progress: Indeterminate spin → Determinate fill → Complete (checkmark + color shift)
  
- **Icon Selection**: 
  - Navigation: ArrowRight, ArrowLeft, House
  - Actions: Plus, Upload, Download, Copy, Check, X
  - Categories: Palette (brand), ChartBar (market), Users (competition), FileText (plan), CurrencyDollar (financials), Megaphone (marketing), Presentation (pitch), Scale (legal)
  - States: Spinner, CheckCircle, Warning, Info
  
- **Spacing**: 
  - Section padding: p-8 to p-12 based on hierarchy
  - Card spacing: p-6 with gap-6 for internal elements
  - Form field spacing: gap-4 for field groups, mb-6 between sections
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary
  - Grid gaps: gap-6 for asset cards, gap-8 for major sections
  
- **Mobile**: 
  - Wizard transitions from horizontal step indicator to vertical compact progress
  - Asset dashboard shifts from 3-column grid → 2-column → 1-column
  - Full-screen modals on mobile for document import and previews
  - Bottom-sheet style navigation for asset categories
  - Larger touch targets (min 44px) for all interactive elements
  - Collapsible sections for long forms with sticky CTAs

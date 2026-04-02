# 🚀 LaunchKit

### From Shower Idea to Investor Ready in Minutes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-purple)](https://vitejs.dev/)

LaunchKit is an AI-powered strategic partner that transforms raw ideas, messy notes, or technical documents into a comprehensive suite of professional business assets. We don't just generate text—we generate the **identity and operational structure** needed to launch a real company.

---

## 🎯 What is LaunchKit?

LaunchKit is a systemized business cognition engine that takes your business concept from ideation to execution-ready in a matter of minutes. Whether you're starting with a napkin sketch or a technical README, LaunchKit analyzes your input and generates everything you need to launch:

- 🎨 **Brand Identity** - Logo concepts, color palettes, typography, social assets
- 📊 **Market Intelligence** - TAM/SAM/SOM analysis, personas, demand signals
- 🔍 **Competition Analysis** - Competitor research, pricing matrix, SWOT positioning
- 📝 **Business Plan** - 15-page executive plan with operations and milestones
- 💰 **Financial Projections** - Startup costs, break-even, P&L, CAC/LTV
- 📣 **Marketing Strategy** - 30-day launch calendar, SEO keywords, ad copy
- 🎤 **Pitch Deck** - Investor-ready slides with speaker notes
- 📄 **Legal Templates** - Privacy Policy, Terms of Service, compliance docs

---

## ✨ Key Features

### 🧠 AI-Powered Document Import

Upload PDFs, paste READMEs, or drop in business notes—LaunchKit's AI extracts the essential information and auto-fills your business profile.

**How it works:**
- Upload a PDF or paste any text content
- AI analyzes and extracts key business elements
- Wizard auto-populates with extracted data
- Review and refine before generation

### 🎨 Brand Vibe System

Choose from 5 carefully curated brand aesthetics that define your company's visual identity:

- **Minimal** - Clean, timeless elegance
- **Bold** - Striking, high-contrast energy  
- **Luxury** - Sophisticated premium appeal
- **Tech** - Modern, innovative edge
- **Rebel** - Unconventional, disruptive attitude

Every generated asset inherits your chosen vibe's colors, typography, and design language.

### 🔬 AI Research Engine

Generate deep market insights and competitive intelligence without leaving the platform:

- **Market Research**: Trends, opportunities, threats, and demand signals
- **Competition Analysis**: Detailed competitor profiles with strengths, weaknesses, pricing
- Real-world data grounding for accurate insights
- SWOT positioning and strategic recommendations

### 📤 Export & Share

Make your assets actionable with powerful export and collaboration features:

- **Export as Markdown** - Human-readable documents with all content
- **Export as JSON** - Structured data for backup or programmatic access
- **Shareable Links** - Generate public links for view-only project access
- **Privacy Controls** - Toggle projects between public and private

### 💾 Persistent State Management

Your work is automatically saved as you go:

- Projects persist across browser sessions
- Generated assets stored securely
- Research data cached for quick access
- No accounts or sign-up required

---

## 🛠️ Technology Stack

LaunchKit is built with modern, production-ready web technologies:

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling with custom theme
- **shadcn/ui v4** - Beautiful, accessible component library

### UI & Design
- **Framer Motion** - Smooth, purposeful animations
- **Phosphor Icons** - Consistent, modern iconography
- **Space Grotesk + Inter** - Professional typography pairing
- **Custom Color System** - OKLCH-based color palette for perceptual uniformity

### AI Integration
- **Spark Runtime SDK** - Built-in LLM capabilities
- **GPT-4 & GPT-4o-mini** - Flexible model selection
- **JSON Mode** - Structured outputs for data extraction
- **Prompt Engineering** - Carefully crafted prompts for consistency

### State & Storage
- **useKV Hook** - Reactive persistent storage
- **Spark KV API** - Client-side key-value persistence
- **React Hooks** - Modern state management patterns

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/launchkit.git
   cd launchkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📖 How to Use LaunchKit

### Step 1: Start a New Project

Click **"Start New Project"** on the landing page to enter the creation wizard.

### Step 2: Provide Your Business Information

You have two options:

**Option A: Use the Wizard**
Fill out the 5-step guided form:
1. **Basic Info** - Company name and tagline
2. **Problem & Solution** - What you solve and how
3. **Market** - Target audience and market size
4. **Revenue** - Business model and pricing
5. **Brand Vibe** - Visual identity selection

**Option B: Import from Document**
1. Click "Import from Document" on the first step
2. Upload a PDF or paste text (README, business plan, notes)
3. AI extracts information and pre-fills the wizard
4. Review and refine the extracted data

### Step 3: Generate Your Assets

Click **"Generate Assets"** and watch as LaunchKit creates:
- Brand identity and design system
- Market intelligence reports
- Competition analysis
- Complete business plan
- Financial projections
- Marketing strategy
- Pitch deck content
- Legal templates

Generation typically takes 2-3 minutes.

### Step 4: Explore Your Dashboard

Access all your generated assets organized by category:
- View each deliverable in detail
- Run AI-powered research for deeper insights
- Export assets as Markdown or JSON
- Generate shareable links for stakeholders

### Step 5: Research & Refine

Use the **AI Research** panel to:
- Conduct market research with trend analysis
- Analyze competition with detailed profiles
- Get strategic recommendations
- Discover opportunities and threats

### Step 6: Export & Share

**Export Options:**
- **Markdown** - Complete project documentation in readable format
- **JSON** - Structured data for backup or integration

**Sharing Options:**
- Toggle project to public
- Generate a unique shareable link
- Copy and distribute to team members or advisors
- Recipients get view-only access (no editing)

---

## 🎨 Project Structure

```
launchkit/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn component library
│   │   ├── LandingPage.tsx        # Marketing landing page
│   │   ├── MainApp.tsx            # Wizard and dashboard
│   │   ├── ResearchPanel.tsx      # AI research interface
│   │   └── ExportSharePanel.tsx   # Export/share controls
│   ├── lib/
│   │   ├── ai-helpers.ts          # AI integration utilities
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── constants.ts           # Configuration & content
│   │   └── utils.ts               # Helper functions
│   ├── hooks/
│   │   └── use-mobile.ts          # Responsive design hook
│   ├── styles/
│   │   └── theme.css              # Design tokens
│   ├── App.tsx                    # Root component
│   ├── index.css                  # Global styles & theme
│   └── main.tsx                   # Application entry
├── index.html                     # HTML template
├── PRD.md                         # Product requirements
├── vite.config.ts                 # Vite configuration
└── package.json                   # Dependencies
```

---

## 🧩 Core Architecture

### Component Hierarchy

```
App
├── LandingPage (entry point)
│   └── Feature cards & CTA
└── MainApp (core application)
    ├── Wizard (multi-step form)
    │   ├── Step 1: Basic Info
    │   ├── Step 2: Problem/Solution
    │   ├── Step 3: Market
    │   ├── Step 4: Revenue
    │   └── Step 5: Brand Vibe
    ├── Generation View (progress)
    └── Dashboard (results)
        ├── Asset Sidebar
        ├── Asset Viewer
        ├── ResearchPanel
        └── ExportSharePanel
```

### Data Flow

1. **Input Collection** - Wizard or document import gathers data
2. **AI Extraction** - LLM parses and structures information
3. **Asset Generation** - Creates deliverables by category
4. **Persistent Storage** - Saves to client-side KV store
5. **Research Enhancement** - Optional AI-powered deep dives
6. **Export/Share** - Multiple output formats

### State Management

LaunchKit uses a hybrid approach:

- **useKV** - Persistent data (projects, assets, research)
- **useState** - Transient UI state (wizard step, loading states)
- **Functional Updates** - Prevents stale closure bugs

```typescript
// ✅ CORRECT - Using functional update
setProject((current) => ({ ...current, status: 'complete' }))

// ❌ WRONG - Stale closure reference
setProject({ ...project, status: 'complete' })
```

---

## 🔌 API & Integration

### Spark Runtime SDK

LaunchKit leverages the built-in Spark runtime for AI and storage:

**LLM Calls:**
```typescript
const prompt = spark.llmPrompt`Generate a tagline for ${companyName}`
const result = await spark.llm(prompt, 'gpt-4o')
```

**Persistent Storage:**
```typescript
// React Hook (preferred)
const [data, setData, deleteData] = useKV('key', defaultValue)

// Direct API
await spark.kv.set('key', value)
const value = await spark.kv.get('key')
await spark.kv.delete('key')
```

**User Info:**
```typescript
const user = await spark.user()
// { avatarUrl, email, id, isOwner, login }
```

---

## 🎯 Use Cases

### For Entrepreneurs
- Validate and refine your startup idea
- Generate investor-ready materials quickly
- Understand your market and competition
- Build a professional brand identity

### For Product Managers
- Document new product initiatives
- Create stakeholder presentations
- Analyze market opportunities
- Develop go-to-market strategies

### For Consultants
- Accelerate client discovery processes
- Generate initial strategy frameworks
- Create professional deliverables faster
- Focus on high-value strategic work

### For Educators
- Teach business planning concepts
- Demonstrate market analysis techniques
- Create case study materials
- Simulate startup scenarios

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Asset Categories

1. Define the category in `src/lib/types.ts`:
   ```typescript
   export type AssetCategory = 
     | 'brand' 
     | 'market' 
     | 'your-new-category'
   ```

2. Add category metadata in `src/lib/constants.ts`:
   ```typescript
   export const ASSET_CATEGORIES = {
     'your-new-category': {
       name: 'Display Name',
       description: 'What this generates',
       icon: 'IconName'
     }
   }
   ```

3. Implement generation logic in `src/lib/ai-helpers.ts`:
   ```typescript
   case 'your-new-category':
     return await generateYourCategory(project)
   ```

### Customizing Brand Vibes

Edit `src/lib/constants.ts` to add or modify vibes:

```typescript
export const VIBE_OPTIONS: VibeOption[] = [
  {
    id: 'your-vibe',
    name: 'Your Vibe',
    description: 'Describe the aesthetic',
    colors: {
      primary: 'oklch(0.45 0.15 270)',
      secondary: 'oklch(0.35 0.02 265)',
      accent: 'oklch(0.70 0.15 195)'
    }
  }
]
```

---

## 🎨 Design System

### Color Philosophy

LaunchKit uses **OKLCH** color space for perceptual uniformity:

```css
:root {
  --primary: oklch(0.45 0.15 270);      /* Purple - main actions */
  --secondary: oklch(0.35 0.02 265);    /* Dark gray - secondary */
  --accent: oklch(0.70 0.15 195);       /* Cyan - highlights */
  --background: oklch(0.97 0.005 260);  /* Soft white */
  --foreground: oklch(0.20 0.02 260);   /* Near black */
}
```

### Typography

- **Headings** - Space Grotesk (distinctive, technical character)
- **Body** - Inter (clean, readable, professional)
- **Code** - JetBrains Mono (monospaced for technical content)

### Spacing & Layout

- **Tailwind Spacing Scale** - Consistent rhythm (4px base)
- **Container Max Width** - 1280px for content areas
- **Card Padding** - Generous whitespace (24px)
- **Grid Gaps** - 24px standard, 16px compact

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep components focused and single-purpose
- Use functional components with hooks

### Commit Messages

Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting, styling
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🐛 Known Issues & Limitations

- **PDF Extraction** - Complex layouts may not extract perfectly
- **AI Consistency** - Generated content quality varies by input detail
- **Browser Storage** - Large projects may hit storage limits
- **Shareable Links** - Links are client-side only (no server validation)
- **Export Formats** - Currently limited to Markdown and JSON

---

## 🗺️ Roadmap

### Short Term (Next Release)
- [ ] PDF export with branded templates
- [ ] More brand vibe options
- [ ] Custom color picker
- [ ] Asset regeneration for individual items
- [ ] Project templates for common industries

### Medium Term
- [ ] Collaboration features (real-time editing)
- [ ] Version history and rollback
- [ ] Integration with external tools (Figma, Google Docs)
- [ ] Advanced financial modeling
- [ ] Multi-language support

### Long Term
- [ ] Self-hosted open-source version
- [ ] Plugin system for custom asset types
- [ ] AI model selection and fine-tuning
- [ ] Team workspaces
- [ ] API for programmatic access

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Phosphor Icons** - Comprehensive icon set
- **Tailwind CSS** - Utility-first styling
- **Vite** - Next-generation build tool
- **React Team** - Revolutionary UI framework
- **OpenAI** - GPT models powering the AI features

---

## 💬 Support & Community

- **Issues** - [GitHub Issues](https://github.com/yourusername/launchkit/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/launchkit/discussions)
- **Email** - support@launchkit.app

---

## 📊 Project Stats

- **Components**: 40+ shadcn/ui components
- **Type Safety**: 100% TypeScript coverage
- **Asset Categories**: 8 comprehensive deliverables
- **Brand Vibes**: 5 curated aesthetic options
- **Lines of Code**: ~3,000+ (excluding dependencies)

---

## 🌟 Why LaunchKit?

**Traditional Approach:**
- Weeks of consultant work → **Thousands of dollars**
- Manual document creation → **Hours of tedious work**
- Scattered information → **Inconsistent messaging**
- Generic templates → **Forgettable branding**

**LaunchKit Approach:**
- AI-powered generation → **Minutes of your time**
- Automated creation → **Instant results**
- Cohesive intelligence → **Logical consistency**
- Custom branding → **Memorable identity**

---

<div align="center">

**Built with ❤️ by entrepreneurs, for entrepreneurs**

[Get Started](#-getting-started) • [View Demo](#) • [Report Bug](https://github.com/yourusername/launchkit/issues)

</div>

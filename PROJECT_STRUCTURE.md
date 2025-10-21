# 📁 Project Structure

Complete overview of the BTP Growth Solutions website file structure.

```
btpgrowthweb/
│
├── 📂 components/                    # Reusable React components
│   ├── 📂 layout/                   # Layout components
│   │   ├── Navbar.tsx               # Top navigation bar (responsive)
│   │   ├── Footer.tsx               # Footer with links and social media
│   │   └── Layout.tsx               # Main layout wrapper
│   │
│   ├── 📂 sections/                 # Page sections
│   │   ├── Hero.tsx                 # Hero banner for homepage
│   │   ├── ServicesPreview.tsx      # Services overview grid
│   │   ├── ClientLogos.tsx          # Client logo showcase
│   │   └── CTA.tsx                  # Call-to-action section
│   │
│   └── 📂 ui/                       # Shadcn UI components
│       ├── button.tsx               # Button component
│       ├── card.tsx                 # Card component
│       ├── input.tsx                # Form input
│       ├── textarea.tsx             # Form textarea
│       └── label.tsx                # Form label
│
├── 📂 lib/                          # Utility functions
│   └── utils.ts                     # Helper functions (cn for classNames)
│
├── 📂 pages/                        # Next.js pages (routing)
│   ├── _app.tsx                     # App wrapper with global SEO
│   ├── _document.tsx                # HTML document structure
│   ├── index.tsx                    # Homepage (/)
│   ├── about.tsx                    # About page (/about)
│   ├── services.tsx                 # Services page (/services)
│   ├── projects.tsx                 # Projects/Portfolio (/projects)
│   └── contact.tsx                  # Contact page (/contact)
│
├── 📂 public/                       # Static files
│   ├── .gitkeep                     # Keeps directory in git
│   ├── favicon.ico                  # (Add your favicon)
│   └── 📂 images/                   # (Create and add images)
│       ├── logo.png
│       ├── og-image.jpg
│       ├── hero-image.jpg
│       └── ...
│
├── 📂 styles/                       # Global styles
│   └── globals.css                  # Tailwind CSS and custom styles
│
├── 📄 .eslintrc.json               # ESLint configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 next.config.js               # Next.js configuration
├── 📄 next-env.d.ts                # Next.js TypeScript declarations
├── 📄 package.json                 # Dependencies and scripts
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
│
├── 📄 README.md                    # Main documentation
├── 📄 CUSTOMIZATION.md             # Customization guide
├── 📄 DEPLOYMENT.md                # Deployment instructions
├── 📄 PROJECT_STRUCTURE.md         # This file
│
└── 📄 .env.local.example           # Environment variables template
    (Create .env.local from this)
```

---

## 📄 File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `tailwind.config.ts` | Tailwind CSS theme and plugin configuration |
| `next.config.js` | Next.js build and runtime configuration |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `.eslintrc.json` | Code linting rules |
| `.gitignore` | Files excluded from git |

### Pages (Routes)

| File | Route | Description |
|------|-------|-------------|
| `index.tsx` | `/` | Homepage with hero, services, clients, CTA |
| `about.tsx` | `/about` | Company information, mission, team |
| `services.tsx` | `/services` | Detailed service offerings |
| `projects.tsx` | `/projects` | Portfolio/case studies |
| `contact.tsx` | `/contact` | Contact form and information |
| `_app.tsx` | N/A | Global app wrapper and SEO |
| `_document.tsx` | N/A | HTML document structure |

### Components

#### Layout Components

- **Navbar.tsx**: Responsive navigation with mobile menu
  - Fixed position
  - Smooth scroll effect
  - Mobile hamburger menu
  - Active link highlighting

- **Footer.tsx**: Site footer
  - Company info and logo
  - Link columns
  - Social media icons
  - Contact information

- **Layout.tsx**: Page wrapper
  - Combines Navbar + Content + Footer
  - Manages min-height layout

#### Section Components

- **Hero.tsx**: Homepage hero section
  - Large headline
  - Feature highlights
  - CTA buttons
  - Background animations

- **ServicesPreview.tsx**: Services grid
  - Icon-based cards
  - 6 service items
  - Animations on scroll

- **ClientLogos.tsx**: Client showcase
  - Logo grid
  - Responsive layout
  - Fade-in animations

- **CTA.tsx**: Call-to-action banner
  - Gradient background
  - Centered content
  - Button CTAs

#### UI Components (Shadcn)

All UI components follow Shadcn UI patterns:
- Consistent styling
- Accessibility built-in
- Customizable variants
- TypeScript typed

---

## 🎨 Styling Architecture

### Tailwind CSS Setup

1. **globals.css**: 
   - Tailwind directives
   - CSS custom properties (design tokens)
   - Global resets
   - Custom scrollbar styles

2. **tailwind.config.ts**:
   - Color palette (primary, secondary, etc.)
   - Typography (fonts, sizes)
   - Spacing and breakpoints
   - Custom animations
   - Plugin configurations

3. **Component Styling**:
   - Utility-first approach
   - Responsive classes (sm:, md:, lg:)
   - State variants (hover:, focus:)
   - Dark mode support (prepared)

---

## 🔧 Utility Functions

### lib/utils.ts

```typescript
cn() // Merges Tailwind classes intelligently
```

Used for conditional class names and preventing conflicts.

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Size | Usage |
|------------|------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach

All components are designed mobile-first with responsive breakpoints:
- Single column on mobile
- 2-3 columns on tablets
- Full layouts on desktop

---

## 🎭 Animation Strategy

### Framer Motion Usage

1. **Page Load Animations**:
   - Fade in + slide up
   - Staggered children
   - Initial/Animate patterns

2. **Scroll Animations**:
   - `whileInView` trigger
   - `viewport={{ once: true }}`
   - Progressive reveals

3. **Interactive Animations**:
   - Hover effects
   - Button transitions
   - Menu open/close

---

## 🔍 SEO Structure

### Meta Tags Hierarchy

1. **Global** (_app.tsx):
   - Default title
   - Default description
   - OG image
   - Twitter card

2. **Per-Page** (each page):
   - Specific title
   - Specific description
   - Custom OG data

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic tags (header, nav, main, section, footer)
- Alt texts on images
- ARIA labels where needed

---

## 📦 Dependencies Overview

### Core Dependencies

- **next**: React framework
- **react** & **react-dom**: UI library
- **typescript**: Type safety

### Styling

- **tailwindcss**: Utility CSS framework
- **tailwindcss-animate**: Animation utilities
- **postcss** & **autoprefixer**: CSS processing

### UI Components

- **@radix-ui/***: Headless UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Component variants
- **clsx** & **tailwind-merge**: Class management

### Animations & SEO

- **framer-motion**: Animation library
- **next-seo**: SEO management

---

## 🚀 Build Process

### Development
```bash
npm run dev
```
- Fast refresh
- Type checking
- Live reload

### Production Build
```bash
npm run build
npm start
```
- Optimized bundles
- Code splitting
- Image optimization

### Static Export
```bash
# Set output: 'export' in next.config.js
npm run build
```
- Generates static HTML
- CDN ready
- No server required

---

## 📝 Adding New Features

### Add a New Page

1. Create `pages/newpage.tsx`
2. Add route to `Navbar.tsx`
3. Add SEO with `<NextSeo />`
4. Update sitemap (if using)

### Add a New Component

1. Create in `components/` (appropriate subfolder)
2. Export from component file
3. Import where needed
4. Follow TypeScript typing

### Add a New UI Component

1. Create in `components/ui/`
2. Follow Shadcn UI patterns
3. Use `cn()` for class merging
4. Add TypeScript interfaces

---

## 🔐 Environment Variables

Required variables (create `.env.local`):

```env
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_CONTACT_PHONE
NEXT_PUBLIC_CONTACT_ADDRESS
NEXT_PUBLIC_FACEBOOK_URL
NEXT_PUBLIC_INSTAGRAM_URL
NEXT_PUBLIC_LINKEDIN_URL
```

All `NEXT_PUBLIC_*` variables are exposed to the browser.

---

## 📚 Documentation Files

- **README.md**: Quick start and overview
- **CUSTOMIZATION.md**: Detailed customization guide
- **DEPLOYMENT.md**: Deployment instructions
- **PROJECT_STRUCTURE.md**: This file

---

## 🎯 Best Practices Implemented

✅ TypeScript for type safety  
✅ Component-based architecture  
✅ Responsive design (mobile-first)  
✅ SEO optimization  
✅ Accessibility standards  
✅ Performance optimization  
✅ Clean code structure  
✅ Comprehensive documentation  

---

**Last Updated**: 2025


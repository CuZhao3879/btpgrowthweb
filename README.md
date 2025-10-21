# BTP Growth Solutions - Corporate Website

A modern, responsive corporate website built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

## 🚀 Features

- ✨ Modern, clean design with smooth animations (Framer Motion)
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Built with Next.js 14 for optimal performance
- 🎨 Styled with Tailwind CSS
- 🧩 Reusable components from Shadcn UI
- 🔍 SEO optimized with next-seo
- 📝 TypeScript for type safety
- 🎯 Professional landing pages for services, projects, and contact

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository (or you're already in it):
```bash
cd btpgrowthweb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=BTP Growth Solutions
NEXT_PUBLIC_CONTACT_EMAIL=info@btpgrowth.com
# ... etc
```

## 🚀 Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗️ Build

Create a production build:

```bash
npm run build
# or
yarn build
```

## 🌐 Production Deployment

### Option 1: Node.js Server (DigitalOcean Droplet)

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

3. Use PM2 for process management:
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "btpgrowth" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### Option 2: Static Export

For static hosting (Netlify, Vercel, etc.):

1. Update `next.config.js`:
```javascript
// Uncomment the output line
output: 'export',
```

2. Build and export:
```bash
npm run build
```

The static files will be in the `out` directory.

### Option 3: GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to server
        # Add your deployment steps here
```

## 📁 Project Structure

```
btpgrowthweb/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── ClientLogos.tsx
│   │   └── CTA.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── label.tsx
├── lib/
│   └── utils.ts
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── services.tsx
│   ├── projects.tsx
│   └── contact.tsx
├── public/
│   └── (static assets)
├── styles/
│   └── globals.css
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Customization Guide

### 1. Update Brand Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Change these values
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  }
}
```

### 2. Replace Placeholder Content

Search for comments like:
- `// Replace with actual image`
- `// Placeholder for...`
- `Hero Image Placeholder`

### 3. Update Contact Information

Edit `.env.local` file with your actual contact details.

### 4. Add Real Images

Place images in the `public/` directory:
```
public/
├── images/
│   ├── logo.png
│   ├── hero-image.jpg
│   ├── team/
│   └── projects/
└── favicon.ico
```

### 5. Configure Social Media

Update the social media links in:
- `.env.local` (environment variables)
- `components/layout/Footer.tsx` (for additional platforms)

### 6. Update SEO

Edit SEO configuration in `pages/_app.tsx` and individual page components.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Build and export static site

## 🔧 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animation**: Framer Motion
- **SEO**: next-seo
- **Icons**: Lucide React

## 📱 Pages Included

1. **Home** (`/`) - Hero section, services preview, client logos, CTA
2. **About** (`/about`) - Company info, values, team
3. **Services** (`/services`) - Detailed service offerings
4. **Projects** (`/projects`) - Portfolio/case studies
5. **Contact** (`/contact`) - Contact form and information

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For questions or issues, please contact:
- Email: info@btpgrowth.com
- Website: https://btpgrowth.com

## 📄 License

© 2025 BTP Growth Solutions. All rights reserved.

---

**Note**: Remember to replace all placeholder content, images, and contact information before deploying to production!


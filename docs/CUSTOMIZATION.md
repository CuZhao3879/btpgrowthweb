# 🎨 Customization Guide

This guide will help you customize the BTP Growth Solutions website to match your brand and business needs.

## 📝 Table of Contents

1. [Brand Information](#brand-information)
2. [Colors and Styling](#colors-and-styling)
3. [Content Updates](#content-updates)
4. [Images and Media](#images-and-media)
5. [Contact Information](#contact-information)
6. [Navigation and Pages](#navigation-and-pages)
7. [SEO Configuration](#seo-configuration)

---

## 🏢 Brand Information

### Company Name

Search and replace "BTP Growth Solutions" with your company name in:
- `README.md`
- `package.json` (name and description)
- `.env.local` (NEXT_PUBLIC_SITE_NAME)
- All page files in `pages/`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`

### Tagline and Descriptions

Update your brand's tagline and descriptions in:
- **Home Page**: `pages/index.tsx` - Hero section
- **About Page**: `pages/about.tsx` - Mission section
- **SEO Descriptions**: Each page component's `NextSeo` configuration

---

## 🎨 Colors and Styling

### Primary Brand Colors

Edit `tailwind.config.ts`:

```typescript
primary: {
  50: '#eff6ff',    // Lightest
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',   // Main brand color
  600: '#2563eb',   // Hover states
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',   // Darkest
},
```

**Color Generation Tools:**
- [Tailwind Color Palette Generator](https://uicolors.app/create)
- [Coolors](https://coolors.co/)

### Typography

Edit `tailwind.config.ts` to change fonts:

```typescript
fontFamily: {
  sans: ['Inter', 'sans-serif'],      // Body text
  heading: ['Poppins', 'sans-serif'], // Headings
},
```

To use different fonts:
1. Add Google Fonts link in `pages/_document.tsx`
2. Update the `fontFamily` configuration above

### Spacing and Layout

Adjust container padding and max-width in `tailwind.config.ts`:

```typescript
container: {
  center: true,
  padding: "2rem",  // Change padding
  screens: {
    "2xl": "1400px", // Change max-width
  },
},
```

---

## ✍️ Content Updates

### Homepage Content

**File**: `pages/index.tsx`

1. **Hero Section** - `components/sections/Hero.tsx`:
   - Update main headline
   - Change subheadline
   - Modify feature badges
   - Update CTA button text

2. **Services Preview** - `components/sections/ServicesPreview.tsx`:
   - Add/remove services
   - Update service descriptions
   - Change icons (from `lucide-react`)

3. **Client Logos** - `components/sections/ClientLogos.tsx`:
   - Replace placeholder text with actual client names
   - Add client logo images

### About Page Content

**File**: `pages/about.tsx`

1. **Mission Section**:
```typescript
// Update mission statement
<p className="text-lg text-gray-600 mb-4">
  Your mission statement here...
</p>
```

2. **Team Members**:
```typescript
const team = [
  {
    name: 'Your Name',
    role: 'Your Role',
    bio: 'Your bio...',
  },
  // Add more team members
]
```

3. **Core Values**:
```typescript
const values = [
  {
    icon: Target,  // Choose from lucide-react
    title: 'Your Value',
    description: 'Description...',
  },
  // Add more values
]
```

### Services Page Content

**File**: `pages/services.tsx`

Update the services array:

```typescript
const services = [
  {
    icon: YourIcon,           // From lucide-react
    title: 'Service Name',
    shortDesc: 'Brief description',
    fullDesc: 'Detailed description',
    features: [
      'Feature 1',
      'Feature 2',
      // Add more features
    ],
    color: 'text-blue-600',   // Icon color
    bgColor: 'bg-blue-100',   // Background color
  },
  // Add more services
]
```

### Projects/Portfolio Content

**File**: `pages/projects.tsx`

Update the projects array:

```typescript
const projects = [
  {
    title: 'Project Name',
    client: 'Client Name',
    category: 'Category',
    description: 'Project description...',
    results: [
      'Result 1',
      'Result 2',
      'Result 3',
    ],
    image: '/images/project-1.jpg',  // Add actual image
  },
  // Add more projects
]
```

---

## 🖼️ Images and Media

### Directory Structure

Create these folders in `public/`:

```
public/
├── images/
│   ├── logo.png
│   ├── logo-white.png
│   ├── hero-image.jpg
│   ├── og-image.jpg (1200x630px for social sharing)
│   ├── about/
│   │   ├── mission.jpg
│   │   └── team/
│   │       ├── member-1.jpg
│   │       └── member-2.jpg
│   └── projects/
│       ├── project-1.jpg
│       ├── project-2.jpg
│       └── ...
└── favicon.ico
```

### Replace Placeholder Images

Search for these comments in the code:
- `Placeholder for hero image`
- `Photo Placeholder`
- `Project Image`
- `Map Placeholder`

Example replacement in `components/sections/Hero.tsx`:

```typescript
// Before (placeholder)
<div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl">
  ...
</div>

// After (real image)
<Image
  src="/images/hero-image.jpg"
  alt="BTP Growth Solutions"
  fill
  className="object-cover rounded-2xl"
  priority
/>
```

### Image Optimization Tips

- Use WebP format for better compression
- Recommended sizes:
  - Hero images: 1920x1080px
  - Team photos: 400x400px
  - Project images: 800x600px
  - OG image: 1200x630px
- Tools: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)

---

## 📞 Contact Information

### Environment Variables

Create/edit `.env.local`:

```env
# Your actual information
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Company Name
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourcompany.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 123-4567
NEXT_PUBLIC_CONTACT_ADDRESS=123 Your Street, City, State 12345

# Social media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourpage
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourhandle
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/yourcompany
NEXT_PUBLIC_XIAOHONGSHU_URL=https://xiaohongshu.com/yourpage
```

### Contact Form Setup

The contact form in `pages/contact.tsx` currently uses a placeholder submission.

**Option 1: Use Formspree** (Easiest)

1. Sign up at [Formspree](https://formspree.io/)
2. Get your form endpoint
3. Update contact form:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const response = await fetch('YOUR_FORMSPREE_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // Handle response
}
```

**Option 2: Custom API Route**

Create `pages/api/contact.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Your email sending logic here
    // Use nodemailer, SendGrid, etc.
    res.status(200).json({ success: true })
  }
}
```

---

## 🧭 Navigation and Pages

### Update Navigation Links

**File**: `components/layout/Navbar.tsx`

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Portfolio' },  // Changed label
  { href: '/blog', label: 'Blog' },           // Added new page
  { href: '/contact', label: 'Contact' },
]
```

### Add New Pages

To add a new page (e.g., blog):

1. Create `pages/blog.tsx`:

```typescript
import { NextSeo } from 'next-seo'

export default function Blog() {
  return (
    <>
      <NextSeo
        title="Blog | Your Company"
        description="Latest insights and articles"
      />
      
      <div className="container mx-auto px-4 py-20">
        {/* Your content */}
      </div>
    </>
  )
}
```

2. Add to navigation (see above)
3. Add to footer if needed

### Remove Pages

To remove a page:
1. Delete the page file from `pages/`
2. Remove from navigation in `Navbar.tsx`
3. Remove from footer in `Footer.tsx`

---

## 🔍 SEO Configuration

### Global SEO Settings

**File**: `pages/_app.tsx`

```typescript
const defaultSEO = {
  title: 'Your Company Name | Tagline',
  description: 'Your compelling meta description (150-160 characters)',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Your Company Name',
    images: [
      {
        url: 'https://yourdomain.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Company Name',
      },
    ],
  },
  twitter: {
    handle: '@yourhandle',
    cardType: 'summary_large_image',
  },
}
```

### Per-Page SEO

Each page has its own `NextSeo` component:

```typescript
<NextSeo
  title="Page Title | Your Company"
  description="Specific page description"
  openGraph={{
    title: 'Page Title',
    description: 'Specific page description',
    images: [{ url: '/images/page-specific-og.jpg' }],
  }}
/>
```

### Analytics Integration

Add Google Analytics in `pages/_document.tsx`:

```typescript
<Head>
  {/* Google Analytics */}
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      `,
    }}
  />
</Head>
```

---

## 🎯 Quick Checklist

Before launching, make sure you've updated:

- [ ] Company name throughout the site
- [ ] Brand colors in Tailwind config
- [ ] Logo images in public/ folder
- [ ] All environment variables in .env.local
- [ ] Hero section content and images
- [ ] About page team members and photos
- [ ] Services descriptions
- [ ] Project/portfolio items
- [ ] Contact form integration
- [ ] Social media links
- [ ] SEO meta descriptions
- [ ] Favicon and OG images
- [ ] Google Analytics ID
- [ ] Footer copyright year and info

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

Need help? Check the main README.md or contact support!


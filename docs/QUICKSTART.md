# ⚡ Quick Start Guide

Get your BTP Growth Solutions website up and running in minutes!

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

Check your versions:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 8.0.0 or higher
```

---

## 🚀 Installation (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Shadcn UI components
- And more...

**Wait for installation to complete** (may take 2-3 minutes)

---

### Step 2: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit with your information
notepad .env.local  # Windows
# or
nano .env.local     # Mac/Linux
```

**Minimum required variables:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=BTP Growth Solutions
NEXT_PUBLIC_CONTACT_EMAIL=info@btpgrowth.com
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

**You should see:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

### Step 4: Open in Browser

Visit: **http://localhost:3000**

You should see the homepage with:
- ✅ Hero section
- ✅ Client logos
- ✅ Services preview
- ✅ CTA section

---

## 🎨 Immediate Customizations (10 Minutes)

### 1. Update Site Name

**File**: `.env.local`
```env
NEXT_PUBLIC_SITE_NAME=Your Company Name
```

**File**: `components/layout/Navbar.tsx` (Line ~45)
```tsx
<span className="font-heading font-bold text-xl text-gray-900">
  Your Company Name
</span>
```

### 2. Change Primary Color

**File**: `tailwind.config.ts` (Line ~20)
```typescript
primary: {
  500: '#YOUR_COLOR',  // Main brand color
  600: '#YOUR_COLOR',  // Darker shade for hover
}
```

**Color Picker**: https://uicolors.app/create

### 3. Update Homepage Hero

**File**: `components/sections/Hero.tsx` (Line ~28)
```tsx
<h1>
  Your Headline
  <span className="text-primary-600"> Here</span>
</h1>
```

### 4. Update Contact Info

**File**: `.env.local`
```env
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 123-4567
```

---

## 📱 Test Responsive Design

### Desktop
- Open: http://localhost:3000
- Resize browser window

### Mobile Simulation
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar

### Test Navigation
- Click hamburger menu (mobile)
- Navigate to all pages
- Test contact form

---

## 🏗️ Build for Production (2 Minutes)

```bash
# Create production build
npm run build

# Start production server
npm start
```

**Production URL**: http://localhost:3000

---

## 🎯 Next Steps

### Phase 1: Content (1-2 hours)
- [ ] Update all text content
- [ ] Replace placeholder descriptions
- [ ] Add your services details
- [ ] Write about page content

### Phase 2: Images (30 mins - 1 hour)
- [ ] Add company logo
- [ ] Add hero image
- [ ] Add team photos
- [ ] Add project screenshots

### Phase 3: Styling (30 mins)
- [ ] Customize colors
- [ ] Update fonts (optional)
- [ ] Adjust spacing (optional)

### Phase 4: Features (1-2 hours)
- [ ] Setup contact form submission
- [ ] Add Google Analytics
- [ ] Configure SEO metadata
- [ ] Add social media links

### Phase 5: Deploy (30 mins - 1 hour)
- [ ] Choose hosting platform
- [ ] Setup domain
- [ ] Deploy application
- [ ] Test production site

---

## 🔧 Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue: TypeScript errors

**Solution:**
```bash
# Delete .next folder and rebuild
rm -rf .next
npm run dev
```

### Issue: Tailwind styles not working

**Solution:**
1. Check `tailwind.config.ts` content paths
2. Restart dev server
3. Clear browser cache (Ctrl+F5)

---

## 📚 Learning Resources

### Next.js
- [Next.js Tutorial](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

### Tailwind CSS
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs)
- [Tailwind Play (Online Editor)](https://play.tailwindcss.com/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)

---

## 🎓 Project Structure Quick Reference

```
btpgrowthweb/
├── components/     # React components
│   ├── layout/     # Navbar, Footer, Layout
│   ├── sections/   # Hero, CTA, etc.
│   └── ui/         # Button, Card, etc.
├── pages/          # Website pages (routes)
├── public/         # Images and static files
├── styles/         # CSS files
└── lib/            # Utility functions
```

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Development server runs without errors
- [ ] All pages load correctly
  - [ ] Home (/)
  - [ ] About (/about)
  - [ ] Services (/services)
  - [ ] Projects (/projects)
  - [ ] Contact (/contact)
- [ ] Navigation works (desktop & mobile)
- [ ] Mobile menu opens/closes
- [ ] Responsive design works
- [ ] No console errors in browser
- [ ] Forms display correctly

---

## 🆘 Need Help?

### Documentation
1. **README.md** - Main documentation
2. **CUSTOMIZATION.md** - Detailed customization guide
3. **DEPLOYMENT.md** - Production deployment
4. **PROJECT_STRUCTURE.md** - File structure overview

### Community Resources
- [Next.js Discord](https://discord.gg/nextjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

### Common Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Maintenance
npm install          # Install dependencies
npm run lint         # Check code quality

# Deployment
npm run export       # Build static export
```

---

## 🎉 You're Ready!

Your development environment is set up and running!

**Current Status**: ✅ Development Ready

**Next**: Start customizing your content in `CUSTOMIZATION.md`

---

**Quick Links:**
- [Customization Guide](./CUSTOMIZATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

Happy coding! 🚀


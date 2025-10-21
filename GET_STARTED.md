# 🚀 Getting Started with BTP Growth Solutions Website

Welcome! This guide will help you get your website running in under 10 minutes.

## ⚡ Quick Install (3 Steps)

### Step 1️⃣: Install Dependencies (2 minutes)

Open terminal in this directory and run:

```bash
npm install
```

**What's happening?** 
Installing Next.js, React, Tailwind CSS, and all required packages.

---

### Step 2️⃣: Create Environment File (30 seconds)

**Windows:**
```bash
copy .env.local.example .env.local
```

**Mac/Linux:**
```bash
cp .env.local.example .env.local
```

**Optional**: Edit `.env.local` with your information (you can do this later).

---

### Step 3️⃣: Start Development Server (30 seconds)

```bash
npm run dev
```

**Success!** Open your browser to: **http://localhost:3000**

---

## ✅ What You'll See

Your website is now running with:

1. **Homepage** - Hero banner, services, client logos
2. **About Page** - Company info and team
3. **Services** - Your service offerings
4. **Projects** - Portfolio/case studies
5. **Contact** - Contact form and info

---

## 🎨 Next: Customize Your Site (30 minutes)

### Priority 1: Update Basic Info

**Edit `.env.local`:**
```env
NEXT_PUBLIC_SITE_NAME=Your Company Name
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 123-4567
```

Restart the server to see changes:
```bash
# Press Ctrl+C to stop
npm run dev  # Start again
```

### Priority 2: Change Brand Color

**Edit `tailwind.config.ts`** (around line 30):

```typescript
primary: {
  500: '#3b82f6',  // ← Change this to your brand color
  600: '#2563eb',  // ← And this (slightly darker)
}
```

**Get your brand color:**
1. Go to https://uicolors.app/create
2. Enter your brand color
3. Copy the palette
4. Replace the primary colors

### Priority 3: Update Homepage Text

**Edit `components/sections/Hero.tsx`** (around line 45):

```tsx
<h1 className="...">
  Your Headline Here
  <span className="text-primary-600"> Your Highlight</span>
</h1>

<p className="...">
  Your company description here...
</p>
```

---

## 📁 Project Structure (Know Where Everything Is)

```
btpgrowthweb/
│
├── 📂 pages/              ← Your website pages
│   ├── index.tsx          ← Homepage
│   ├── about.tsx          ← About page
│   ├── services.tsx       ← Services page
│   ├── projects.tsx       ← Projects page
│   └── contact.tsx        ← Contact page
│
├── 📂 components/         ← Reusable components
│   ├── layout/            ← Navbar, Footer
│   ├── sections/          ← Hero, CTA, etc.
│   └── ui/                ← Buttons, Cards, etc.
│
├── 📂 public/             ← Images and files
│   └── images/            ← Put your images here
│
├── 📂 styles/             ← CSS files
│   └── globals.css        ← Main stylesheet
│
└── 📄 .env.local          ← Your settings
```

---

## 🖼️ Adding Images (10 minutes)

### 1. Add Your Logo

Put your logo in: `public/images/logo.png`

**Update Navbar** (`components/layout/Navbar.tsx`, line ~38):

```tsx
<Image
  src="/images/logo.png"
  alt="Your Company"
  width={120}
  height={40}
/>
```

### 2. Add Hero Image

Put hero image in: `public/images/hero-image.jpg`

**Update Hero** (`components/sections/Hero.tsx`, line ~90):

```tsx
<Image
  src="/images/hero-image.jpg"
  alt="Your Company"
  fill
  className="object-cover rounded-2xl"
/>
```

### 3. Add Team Photos

Put photos in: `public/images/team/`

**Update About Page** (`pages/about.tsx`, line ~160):

```tsx
<Image
  src="/images/team/member-1.jpg"
  alt="Team Member"
  width={200}
  height={200}
  className="rounded-full"
/>
```

---

## 📝 Updating Content (Your Priority List)

### Week 1: Essential Content

- [ ] Company name and tagline
- [ ] Contact information
- [ ] About us description
- [ ] Service descriptions
- [ ] Basic images (logo, hero)

### Week 2: Enhanced Content

- [ ] Team member profiles
- [ ] Project case studies
- [ ] Client testimonials
- [ ] All images and photos

### Week 3: Polish

- [ ] SEO descriptions
- [ ] Social media links
- [ ] Blog posts (if needed)
- [ ] Final design tweaks

---

## 🚀 When You're Ready to Deploy

### Option 1: Quick Deploy to Vercel (5 minutes)

1. Create account at https://vercel.com
2. Import your project
3. Deploy! ✨

### Option 2: Deploy to Your Server

See detailed instructions in: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📚 Helpful Guides

- **[README.md](./README.md)** - Complete documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Detailed quick start
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Full customization guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File organization

---

## 🆘 Troubleshooting

### "npm install" is slow
**Normal!** First install takes 2-3 minutes. Grab coffee ☕

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Changes not showing
```bash
# Hard refresh browser
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### TypeScript errors
```bash
# Delete cache and restart
rm -rf .next
npm run dev
```

---

## ✨ Features Included

✅ Fully responsive design  
✅ Mobile navigation menu  
✅ Smooth animations  
✅ SEO optimized  
✅ Contact form  
✅ Modern UI components  
✅ TypeScript  
✅ Production ready  

---

## 🎯 Your Path Forward

```
Today:
└─ Get site running ✓
└─ Update basic info
└─ Change colors

This Week:
└─ Add content
└─ Add images
└─ Customize pages

Next Week:
└─ Final polish
└─ Test everything
└─ Deploy!
```

---

## 💡 Pro Tips

1. **Start Simple**: Update text first, then images, then styling
2. **Test Mobile**: Always check on phone (Chrome DevTools: Ctrl+Shift+M)
3. **Git Commits**: Save your work regularly
4. **Backup**: Keep original files before major changes
5. **Ask for Help**: Check documentation or online communities

---

## 🎊 You're All Set!

Your website is running and ready to customize!

**Current Status**: ✅ Development Server Running

**Next Step**: Start editing content (see Priority 1 above)

---

**Questions?** Check the documentation files or the inline code comments.

**Happy building!** 🚀

---

Made with ❤️ for BTP Growth Solutions


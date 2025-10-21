# Public Assets Directory

This directory contains all static assets for the website.

## 📁 Recommended Structure

```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── manifest.json
│
├── images/
│   ├── logo.png
│   ├── logo-white.png
│   ├── og-image.jpg (1200x630px)
│   │
│   ├── hero/
│   │   └── hero-main.jpg
│   │
│   ├── about/
│   │   ├── office.jpg
│   │   └── team/
│   │       ├── member-1.jpg
│   │       ├── member-2.jpg
│   │       └── ...
│   │
│   ├── services/
│   │   └── service-icons/
│   │
│   ├── projects/
│   │   ├── project-1.jpg
│   │   ├── project-2.jpg
│   │   └── ...
│   │
│   └── clients/
│       ├── client-logo-1.png
│       ├── client-logo-2.png
│       └── ...
│
└── downloads/
    └── company-brochure.pdf
```

## 🎨 Image Guidelines

### Favicon
- **Format**: .ico, .png
- **Sizes**: 16x16, 32x32, 180x180 (Apple)
- **Generator**: https://realfavicongenerator.net/

### Logo
- **Formats**: PNG with transparency, SVG (preferred)
- **Sizes**: 
  - Regular: 200x60px (approx)
  - Large: 400x120px (approx)
- **Variants**: Regular + White version for dark backgrounds

### Open Graph Image
- **Size**: 1200x630px (required)
- **Format**: JPG or PNG
- **Purpose**: Social media sharing
- **Location**: `/public/images/og-image.jpg`

### Hero Images
- **Size**: 1920x1080px (or larger)
- **Format**: JPG (compressed)
- **Optimization**: Use TinyPNG or Squoosh
- **Max file size**: 300KB

### Team Photos
- **Size**: 400x400px (square)
- **Format**: JPG
- **Style**: Professional headshots
- **Background**: Neutral or removed

### Project Images
- **Size**: 800x600px or 1200x800px
- **Format**: JPG
- **Content**: Screenshots, mockups, or photos

### Client Logos
- **Size**: 200x100px (max)
- **Format**: PNG with transparency
- **Style**: Grayscale or color
- **Background**: Transparent

## 🛠️ Image Optimization Tools

### Online Tools
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Squoosh](https://squoosh.app/) - Advanced image compression
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization
- [Favicon Generator](https://realfavicongenerator.net/) - Favicon creation

### Command Line Tools
```bash
# Install imageoptim (Mac)
brew install imageoptim-cli

# Install sharp (Node.js)
npm install -g sharp-cli

# Optimize image
sharp input.jpg -o output.jpg --quality 80
```

## 📋 robots.txt

Create `public/robots.txt`:

```txt
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://yourdomain.com/sitemap.xml
```

## 🗺️ sitemap.xml

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

## 📱 manifest.json (PWA)

Create `public/manifest.json`:

```json
{
  "name": "BTP Growth Solutions",
  "short_name": "BTP Growth",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

## ✅ Asset Checklist

Before launch, ensure you have:

### Required
- [ ] Favicon (16x16, 32x32)
- [ ] Apple touch icon (180x180)
- [ ] Company logo (PNG/SVG)
- [ ] OG image (1200x630)
- [ ] robots.txt
- [ ] sitemap.xml

### Recommended
- [ ] Hero images
- [ ] Team photos
- [ ] Project screenshots
- [ ] Client logos
- [ ] Service icons/images
- [ ] manifest.json (PWA)

### Optional
- [ ] Company brochure (PDF)
- [ ] Brand assets
- [ ] Video files
- [ ] Custom fonts (if self-hosted)

## 🔒 Image Rights

Ensure all images:
- Are owned by your company
- Have proper licenses
- Have model releases (for people)
- Don't infringe copyright
- Are optimized for web

## 📏 Performance Tips

1. **Compress Images**: Use WebP format when possible
2. **Responsive Images**: Provide multiple sizes
3. **Lazy Loading**: Built-in with Next.js Image component
4. **CDN**: Consider using Cloudflare or similar
5. **Cache Headers**: Configure in server/CDN

## 🎯 Quick Setup

```bash
# Create directory structure
cd public
mkdir -p images/{hero,about/team,services,projects,clients}
mkdir downloads

# Download placeholder favicon
# Add your actual favicon.ico file here

# Add your images to appropriate folders
```

## 📚 Resources

- [Next.js Static Files](https://nextjs.org/docs/basic-features/static-file-serving)
- [Image Optimization Guide](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Image Guide](https://web.dev/fast/#optimize-your-images)
- [Favicon Best Practices](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

---

**Note**: All files in this directory are publicly accessible at `yourdomain.com/filename.ext`


# Blog Content Directory

This directory contains all blog posts in Markdown format.

## File Format

Each blog post should be a `.md` file with the following frontmatter:

```markdown
---
title: "Your Blog Post Title"
date: "2025-01-20"
description: "A brief SEO-friendly description"
category: "Category Name"
image: "/images/blog/your-image.jpg"
---

Your content here...
```

## Frontmatter Fields

- **title**: The post title (required)
- **date**: Publication date in YYYY-MM-DD format (required)
- **description**: Brief summary for SEO and post previews (required)
- **category**: Category for grouping posts (required)
- **image**: Featured image path (optional, defaults to placeholder)

## Categories

Current categories:
- Digital Marketing
- SEO
- Social Media
- Web Development
- Software Development
- Brand Development
- Technology
- Business Growth

## Images

Place blog images in `/public/images/blog/` directory.

Recommended image specs:
- **Featured Images**: 1200x630px (16:9 ratio)
- **In-content Images**: Max width 1000px
- **Format**: JPG or WebP for photos, PNG for graphics
- **Size**: Optimize to under 200KB

## Writing Tips

1. **Use Clear Headings**: Help readers scan content
2. **Add Images**: Break up text, improve engagement
3. **Include Code Blocks**: For technical content
4. **Link Internally**: Link to relevant pages/posts
5. **Call-to-Action**: End with next step for readers

## Example Post Structure

```markdown
---
title: "Your Title"
date: "2025-01-20"
description: "Description here"
category: "Category"
image: "/images/blog/image.jpg"
---

# Main Title

Introduction paragraph...

## Section 1

Content...

### Subsection

More content...

## Section 2

Content...

## Conclusion

Wrap up...

[Call to Action](/contact)
```

## Markdown Support

Supports standard Markdown including:
- Headings (H1-H6)
- Lists (ordered and unordered)
- Links
- Images
- Code blocks
- Blockquotes
- Bold and italic text
- Tables

## Publishing Workflow

1. Create new `.md` file in this directory
2. Add frontmatter with all required fields
3. Write content in Markdown
4. Add images to `/public/images/blog/`
5. Test locally: `npm run dev`
6. Build: `npm run build`
7. Deploy

## SEO Best Practices

- Use descriptive, keyword-rich titles
- Write compelling descriptions (150-160 characters)
- Use proper heading hierarchy (H1, H2, H3)
- Add alt text to images
- Include internal and external links
- Keep URLs clean (filename becomes slug)

---

Need help? Check the main README.md or contact the development team.


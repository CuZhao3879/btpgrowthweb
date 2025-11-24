# 📸 图片放置指南

## 概览

本网站有两个主要的图片区域需要您放置自定义图片。

---

## 1️⃣ Technology Logos (技术Logo)

### 📍 显示位置
- **Home 页面**: "The Technologies That Power Our Growth" 部分
- **About Us 页面**: "The Technologies That Power Our Growth" 部分

### 📐 图片规格
- **格式**: JPG
- **尺寸**: 400 x 200 像素 (宽度 400px, 高度 200px)
- **宽高比**: 2:1
- **建议**: 高质量Logo，白色或透明背景

### 📂 文件路径
```
public/images/tech-logos/
```

### 📝 文件命名
您需要准备以下10张图片：

| 文件名 | 技术名称 |
|--------|---------|
| `nextjs.jpg` | Next.js |
| `react.jpg` | React |
| `typescript.jpg` | TypeScript |
| `tailwind.jpg` | Tailwind CSS |
| `nodejs.jpg` | Node.js |
| `python.jpg` | Python |
| `aws.jpg` | AWS |
| `gcloud.jpg` | Google Cloud |
| `meta.jpg` | Meta Ads |
| `analytics.jpg` | Google Analytics |

### 🔄 如何添加更多Logo

如果您想添加或替换Logo，请编辑：
```typescript
// 文件: components/sections/ClientLogos.tsx
const technologies = [
  { name: 'Next.js', image: '/images/tech-logos/nextjs.jpg' },
  { name: 'React', image: '/images/tech-logos/react.jpg' },
  // ... 添加更多
  { name: 'Your Tech', image: '/images/tech-logos/yourtech.jpg' },
]
```

---

## 2️⃣ Service Images (服务图片)

### 📍 显示位置
- **Home 页面**: "Our Services" 部分 (使用 PNG)
- **Services 页面**: 所有服务卡片 (使用 JPG)

### 📐 图片规格

#### Home 页面 (Our Services)
- **格式**: PNG
- **尺寸**: 1080 x 1080 像素 (正方形)
- **建议**: PNG格式可支持透明背景

#### Services 页面
- **格式**: JPG
- **尺寸**: 1080 x 1080 像素 (正方形)
- **建议**: 高质量图片，优化后的JPG

### 📂 文件路径
```
public/images/services/
```

### 📝 文件命名

您需要准备以下文件：

#### Home 页面需要 (PNG格式):
| 文件名 | 服务名称 |
|--------|---------|
| `meta-ads.png` | Meta Ads Solutions |
| `brand-development.png` | Brand Development |
| `social-media.png` | Social Media Marketing |
| `web-development.png` | Web Development |
| `software-development.png` | Software Development |
| `seo-optimization.png` | SEO Optimization |

#### Services 页面需要 (JPG格式):
| 文件名 | 服务名称 |
|--------|---------|
| `meta-ads.jpg` | Meta Ads Solutions |
| `brand-development.jpg` | Brand Development |
| `social-media.jpg` | Social Media Marketing |
| `web-development.jpg` | Web Development |
| `software-development.jpg` | Software Development |
| `seo-optimization.jpg` | SEO Optimization |

---

## 📋 快速检查清单

### Technology Logos
- [ ] 10张 400x200px JPG 图片
- [ ] 放置在 `public/images/tech-logos/` 文件夹
- [ ] 文件命名正确

### Service Images (Home)
- [ ] 6张 1080x1080px PNG 图片
- [ ] 放置在 `public/images/services/` 文件夹
- [ ] 文件命名为 `.png` 结尾

### Service Images (Services Page)
- [ ] 6张 1080x1080px JPG 图片
- [ ] 放置在 `public/images/services/` 文件夹
- [ ] 文件命名为 `.jpg` 结尾

---

## 🎨 图片设计建议

### Technology Logos
- 使用官方Logo或高质量版本
- 确保Logo清晰可见
- 白色或浅色背景效果最佳
- 如果Logo太小，考虑添加品牌名称文字

### Service Images
- 使用与服务相关的专业图片
- 保持视觉风格统一
- 图片主体居中
- 避免过多文字
- 颜色与品牌色调协调

---

## ⚠️ 重要提示

### 图片优化
在放置图片前，建议：
1. **压缩图片**: 使用 TinyPNG 或 ImageOptim
2. **保持质量**: 压缩的同时保持清晰度
3. **命名规范**: 使用小写字母和连字符
4. **检查尺寸**: 确保像素尺寸完全匹配

### 后备显示
如果图片未找到或加载失败：
- **Technology Logos**: 会显示技术名称文字
- **Service Images**: 会显示蓝色占位符

---

## 🔧 测试您的图片

1. 将图片放入相应文件夹
2. 启动开发服务器: `npm run dev`
3. 访问 http://localhost:3000
4. 检查图片是否正确显示
5. 在不同设备上测试 (桌面、平板、手机)

---

## 📞 需要帮助？

如果您在放置图片时遇到问题：
1. 检查文件路径是否正确
2. 检查文件命名是否完全匹配
3. 检查图片尺寸是否正确
4. 清除浏览器缓存并刷新页面
5. 查看浏览器控制台是否有错误信息

---

## 示例文件结构

```
public/
└── images/
    ├── tech-logos/
    │   ├── README.md
    │   ├── nextjs.jpg          (400x200px)
    │   ├── react.jpg           (400x200px)
    │   ├── typescript.jpg      (400x200px)
    │   └── ... (7 more files)
    │
    └── services/
        ├── README.md
        ├── meta-ads.png        (1080x1080px)
        ├── meta-ads.jpg        (1080x1080px)
        ├── brand-development.png  (1080x1080px)
        ├── brand-development.jpg  (1080x1080px)
        └── ... (8 more files)
```

---

完成图片放置后，您的网站就完全就绪了！🎉


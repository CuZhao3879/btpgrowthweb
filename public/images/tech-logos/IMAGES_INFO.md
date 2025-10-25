# Tech Logos 图片信息

## 📋 当前 Logo 列表（按顺序）

1. **meta.jpg** - Meta
2. **cursor.jpg** - Cursor
3. **adobe.jpg** - Adobe
4. **github.jpg** - GitHub
5. **digitalocean.jpg** - DigitalOcean
6. **googleanalytics.jpg** - Google Analytics
7. **react.jpg** - React
8. **nodejs.jpg** - Node.js

## 📐 图片规格

- **格式**: JPG
- **推荐尺寸**: 400 x 200 像素（宽高比 2:1）
- **显示尺寸**: 256 x 128 像素（自动缩放）
- **背景**: 建议使用白色或透明背景

## 📍 显示位置

这些 Logo 会显示在以下页面：
1. ✅ **Home 页面** - "The Technologies That Power Our Growth" 部分
2. ✅ **About Us 页面** - "The Technologies That Power Our Growth" 部分

## 🔄 如何添加新的 Logo

1. 准备 JPG 格式图片（400x200px）
2. 命名为合适的文件名（如 `yourtech.jpg`）
3. 放入 `public/images/tech-logos/` 文件夹
4. 更新 `components/sections/ClientLogos.tsx` 中的 `technologies` 数组：

```typescript
const technologies = [
  // ... 现有的 logos
  { name: 'Your Tech', image: '/images/tech-logos/yourtech.jpg' },
]
```

## 🎨 设计建议

- Logo 应该清晰可辨
- 使用官方 Logo 或高质量版本
- 保持视觉风格统一
- 确保在白色背景下可见

## ✨ 当前效果

Logo 会以横向滚动方式无限循环显示，创造流畅的动画效果。


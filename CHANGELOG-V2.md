# 📝 更新日志 - Version 2.0

## 🎉 主要更新 (2024)

### 🎨 视觉设计优化

#### Hero Banner 背景美化
- **新增**: 渐变背景色 (蓝色 → 靛蓝 → 紫色)
- **新增**: 3个动态浮动彩色球体效果
- **效果**: 优雅的动态背景动画 (7秒循环)

### 🖼️ 图片系统重构

#### Technology Logos (技术Logo)
- **更新**: 从文字改为图片显示
- **规格**: 400x200px JPG
- **位置**: Home 页面 + About Us 页面
- **路径**: `public/images/tech-logos/`
- **数量**: 10个技术Logo

#### Service Images (服务图片)
- **更新**: 从图标改为图片显示
- **Home 页面**: 1080x1080px PNG
- **Services 页面**: 1080x1080px JPG
- **路径**: `public/images/services/`
- **数量**: 6个服务图片

### 🔄 服务顺序调整
- **调换**: Brand Development ⇄ SEO Optimization
- **影响页面**: Home 页面 + Services 页面
- **新顺序**:
  1. Meta Ads Solutions
  2. **Brand Development** ⬅️ 新位置
  3. Social Media Marketing
  4. Web Development
  5. Software Development
  6. **SEO Optimization** ⬅️ 新位置

### 🌐 国际化 (i18n) 功能

#### 中英文切换
- **新增**: 完整的中英文双语支持
- **位置**: Navbar 右侧地球图标
- **持久化**: 自动保存用户语言偏好
- **覆盖**: 所有页面、组件、内容

#### 技术实现
- **框架**: React Context API
- **Hook**: `useLanguage()`
- **翻译文件**: 
  - `locales/en.json` (英文)
  - `locales/zh.json` (中文)

#### 已翻译内容
- ✅ 导航栏 (Navbar)
- ✅ 首页横幅 (Hero)
- ✅ 服务板块 (Services)
- ✅ 技术部分 (Technologies)
- ✅ 行动号召 (CTA)
- ✅ 页脚 (Footer)
- ✅ 关于我们 (About)
- ✅ 服务页面 (Services Page)
- ✅ 博客 (Blog)
- ✅ 联系页面 (Contact)

---

## 📦 新增依赖

```json
{
  "@radix-ui/react-dropdown-menu": "^2.x"
}
```

---

## 📁 新增文件

### 组件
- `components/LanguageSwitcher.tsx` - 语言切换器
- `components/ui/dropdown-menu.tsx` - 下拉菜单组件

### 上下文
- `contexts/LanguageContext.tsx` - 语言管理上下文

### 翻译文件
- `locales/en.json` - 英文翻译
- `locales/zh.json` - 中文翻译

### 文档
- `网站更新总结-2.md` - 更新总结
- `IMAGE_PLACEMENT_GUIDE.md` - 图片放置指南
- `CHANGELOG-V2.md` - 本文件

### 图片文件夹
- `public/images/services/` - 服务图片
- `public/images/tech-logos/` - 技术Logo

---

## 🔧 修改文件

### 页面
- `pages/_app.tsx` - 添加 LanguageProvider
- `pages/services.tsx` - 更新为图片显示 + 服务顺序调整

### 组件
- `components/layout/Navbar.tsx` - 添加语言切换 + 翻译
- `components/sections/Hero.tsx` - 新背景效果
- `components/sections/ClientLogos.tsx` - 改为图片显示
- `components/sections/ServicesPreview.tsx` - 改为图片显示 + 顺序调整

### 配置
- `tailwind.config.ts` - 添加 blob 动画

---

## 🚀 升级步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 准备图片

#### Technology Logos (10张)
放置在 `public/images/tech-logos/`
- 尺寸: 400x200px
- 格式: JPG

#### Service Images (12张)
放置在 `public/images/services/`
- Home 页面: 6张 1080x1080px PNG
- Services 页面: 6张 1080x1080px JPG

### 3. 启动项目
```bash
npm run dev
```

### 4. 测试语言切换
1. 访问 http://localhost:3000
2. 点击 Navbar 右侧的地球图标 🌐
3. 切换中英文
4. 刷新页面确认语言保持

---

## 💡 使用指南

### 切换语言
```typescript
import { useLanguage } from '@/contexts/LanguageContext'

function MyComponent() {
  const { language, setLanguage, t } = useLanguage()
  
  // 获取翻译
  const title = t('hero.title')
  
  // 切换语言
  setLanguage('zh') // or 'en'
  
  return <h1>{title}</h1>
}
```

### 添加新翻译
```json
// locales/en.json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}

// locales/zh.json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}
```

### 更新图片
直接替换 `public/images/` 下的对应文件即可。

---

## ⚠️ 破坏性变更

### 无破坏性变更
本次更新完全向后兼容，不影响现有功能。

---

## 🐛 已知问题

无已知问题。

---

## 📈 性能优化

- 语言翻译文件按需加载
- 图片支持错误回退显示
- 动画使用 GPU 加速

---

## 🔮 未来计划

1. **图片优化**
   - 使用 Next.js Image 组件
   - 添加懒加载
   - 添加占位符

2. **更多语言**
   - 马来语 (Malay)
   - 日语 (Japanese)
   - 韩语 (Korean)

3. **SEO 多语言**
   - hreflang 标签
   - 语言特定的 meta tags
   - URL 国际化

4. **CMS 集成**
   - 翻译管理后台
   - 图片管理系统

---

## 👥 贡献者

- Claude (AI Assistant) - 全栈开发

---

## 📄 许可证

© 2024 BTP Growth Solutions. All rights reserved.

---

**版本**: 2.0.0  
**发布日期**: 2024  
**状态**: ✅ 生产就绪


# 部署环境 API 路由问题排查指南

## 问题症状

错误信息：`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

这表示 API 路由返回了 HTML（通常是错误页面）而不是 JSON 响应。

## 可能原因

### 1. API 路由在生产环境未正确部署

**检查清单：**
- ✅ 确认部署平台支持 Next.js API Routes（Vercel、Netlify、Railway 等都支持）
- ✅ 确认没有启用静态导出（`next.config.js` 中 `output: 'export'` 应该是注释掉的）
- ✅ 确认 `pages/api/contact.ts` 文件已提交到 Git 并部署

### 2. 环境变量未配置

**必需的环境变量：**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gmail API
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=marketing@btpgrowth.com
```

**检查步骤：**
1. 登录部署平台（Vercel/Netlify 等）
2. 进入项目设置 → Environment Variables
3. 确认所有变量都已添加
4. **重要**：重新部署应用（环境变量更改后必须重新部署）

### 3. 部署平台配置问题

#### Vercel
- API 路由默认支持，无需额外配置
- 如果使用自定义域名，确保域名已正确配置

#### Netlify
- 需要配置 `netlify.toml` 以确保 API 路由正常工作：
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 其他平台
- 确保平台支持 Node.js Serverless Functions
- 确保平台支持 Next.js API Routes

### 4. CORS 问题

如果遇到 CORS 错误，代码中已添加 CORS headers，但某些平台可能需要额外配置。

## 快速诊断步骤

### 步骤 1: 测试 API 端点

在浏览器控制台（F12）运行：

```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(async res => {
  const contentType = res.headers.get('content-type')
  console.log('Status:', res.status)
  console.log('Content-Type:', contentType)
  
  if (contentType && contentType.includes('application/json')) {
    return res.json().then(data => console.log('JSON Response:', data))
  } else {
    const text = await res.text()
    console.error('HTML Response (first 500 chars):', text.substring(0, 500))
  }
})
.catch(err => console.error('Error:', err))
```

### 步骤 2: 检查网络请求

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 提交表单
4. 查看 `/api/contact` 请求：
   - **Status Code**: 应该是 200 或 4xx/5xx，不应该是 404
   - **Response**: 应该是 JSON，不应该是 HTML
   - **Response Headers**: 查看 `content-type` 应该是 `application/json`

### 步骤 3: 检查服务器日志

在部署平台查看函数日志：
- **Vercel**: Dashboard → Your Project → Functions → Logs
- **Netlify**: Site settings → Functions → View Logs
- **Railway**: Deployments → View Logs

查找：
- `API error:` 或 `Supabase error:` 等错误信息
- 环境变量相关的错误

### 步骤 4: 验证 API 路由文件

确认以下文件存在且已部署：
- ✅ `pages/api/contact.ts`
- ✅ 文件包含 `export default async function handler(...)`

## 常见解决方案

### 方案 1: 重新部署应用

1. 确认所有环境变量已配置
2. 在部署平台触发重新部署
3. 等待部署完成
4. 清除浏览器缓存并测试

### 方案 2: 检查路由路径

确保表单提交的路径是正确的：
- ✅ 使用相对路径：`/api/contact`（当前代码已正确）
- ❌ 不要使用绝对路径：`https://yourdomain.com/api/contact`（可能导致 CORS 问题）

### 方案 3: 验证 Next.js 版本

确保使用兼容的 Next.js 版本（当前：14.2.0），API Routes 功能在 Next.js 13+ 中稳定支持。

### 方案 4: 检查构建日志

查看部署构建日志，确认：
- ✅ API 路由文件被正确识别
- ✅ 没有构建错误
- ✅ 函数成功部署

## 如果问题仍然存在

1. **提供以下信息：**
   - 部署平台（Vercel/Netlify/其他）
   - 浏览器控制台的完整错误信息
   - Network 标签中 `/api/contact` 请求的详细信息（Status, Response, Headers）
   - 服务器日志中的相关错误

2. **临时解决方案：**
   - 如果急需接收表单数据，可以暂时使用 Supabase Dashboard 手动查看提交的消息
   - API 路由修复后，Gmail 通知功能会自动恢复

## 预防措施

- 在部署前，先在本地环境测试 API 路由：`npm run dev` 然后访问 `http://localhost:3000/api/contact`（应该返回 405 Method not allowed，但不应返回 404）
- 使用环境变量管理工具确保所有变量正确配置
- 在部署后立即测试关键功能


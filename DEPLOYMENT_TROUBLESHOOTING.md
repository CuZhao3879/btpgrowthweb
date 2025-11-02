# 生产环境部署问题排查指南

## 联系表单提交失败问题

### 可能的原因

1. **环境变量未配置**
2. **Supabase 配置问题**
3. **Gmail API 配置问题**
4. **API 路由访问问题**

---

## 检查清单

### 1. 环境变量配置（最重要）

在你的部署平台（Vercel/Netlify/AWS 等）的环境变量设置中，确保以下变量都已配置：

#### Supabase 配置
```
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
```

#### Gmail API 配置
```
GMAIL_CLIENT_ID=你的_Client_ID
GMAIL_CLIENT_SECRET=你的_Client_Secret
GMAIL_REFRESH_TOKEN=你的_Refresh_Token
GMAIL_USER=marketing@btpgrowth.com
NEXT_PUBLIC_CONTACT_EMAIL=marketing@btpgrowth.com
```

### 2. Google Cloud Console 配置

✅ **已授权的 JavaScript 来源**
- `http://localhost:3000`（开发环境）
- `https://btpgrowth.com`（生产环境）

✅ **已授权的重定向 URI**
- `http://localhost:3000/api/auth/callback`（开发环境）
- `https://btpgrowth.com/api/auth/callback`（生产环境）

### 3. 检查错误信息

提交表单后，错误信息会显示在页面上。常见错误：

#### "Missing Supabase environment variables"
- **原因**: Supabase 环境变量未配置
- **解决**: 在部署平台添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`

#### "Failed to save message" 或 Supabase 错误
- **原因**: Supabase 配置错误或 RLS 策略问题
- **解决**: 检查 Supabase 数据库表 `contact_messages` 是否存在，RLS 策略是否正确

#### "Gmail OAuth2 not configured" 或 Gmail API 错误
- **原因**: Gmail API 环境变量未配置或 Refresh Token 过期
- **解决**: 
  - 检查 Gmail API 环境变量是否配置
  - 如 Refresh Token 过期，需要重新获取

#### "Internal server error"
- **原因**: 服务器端错误
- **解决**: 检查部署平台的日志，查看具体错误信息

### 4. 测试步骤

#### 步骤 1: 测试 API 端点

在浏览器控制台（F12）运行：

```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

#### 步骤 2: 检查网络请求

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 提交表单
4. 查看 `/api/contact` 请求的响应
5. 查看 Response 和 Status Code

#### 步骤 3: 检查服务器日志

在部署平台查看服务器日志，查找错误信息：
- Vercel: Dashboard → Your Project → Functions → View Logs
- Netlify: Site settings → Functions → View Logs

### 5. 常见问题解决方案

#### 问题 1: 环境变量在部署后不生效

**解决方法**:
1. 确认在部署平台的环境变量设置中已添加所有变量
2. 重新部署应用（重要！）
3. 某些平台需要重启应用才能加载新的环境变量

#### 问题 2: Supabase RLS 策略阻止插入

**解决方法**:
确保 `contact_messages` 表的 RLS 策略允许 service role 插入：

```sql
-- 允许 service role 插入（已在初始化时设置）
-- 但请确认策略仍然存在
```

#### 问题 3: Gmail Refresh Token 过期

**解决方法**:
1. 重新运行授权流程获取新的 Refresh Token
2. 更新部署平台的环境变量 `GMAIL_REFRESH_TOKEN`
3. 重新部署应用

#### 问题 4: CORS 错误

**解决方法**:
Next.js API 路由默认允许同源请求。如果使用自定义域名，确保：
- API 路由使用相对路径 `/api/contact`（当前代码已正确）
- 部署平台正确配置了域名

### 6. 验证配置

运行以下命令检查环境变量（需要在部署平台的终端或本地）：

```bash
# 检查 Supabase 配置
echo "Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL:0:20}..."
echo "Has Service Key: ${SUPABASE_SERVICE_ROLE_KEY:+yes}"

# 检查 Gmail 配置
echo "Has Gmail Client ID: ${GMAIL_CLIENT_ID:+yes}"
echo "Has Gmail Refresh Token: ${GMAIL_REFRESH_TOKEN:+yes}"
```

---

## 快速诊断步骤

1. ✅ 检查环境变量是否都已配置
2. ✅ 确认已重新部署应用（添加环境变量后必须重新部署）
3. ✅ 查看浏览器控制台的错误信息
4. ✅ 查看网络请求的响应
5. ✅ 查看部署平台的服务器日志
6. ✅ 测试 API 端点是否可访问

---

## 需要帮助？

如果问题仍未解决，请提供：
1. 浏览器控制台的完整错误信息
2. 网络请求的响应内容
3. 服务器日志的错误信息
4. 环境变量配置截图（隐藏敏感信息）


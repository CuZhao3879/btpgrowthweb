# Gmail OAuth2 故障排除指南

## 当前错误
```
Invalid login: 535-5.7.8 Username and Password not accepted. BadCredentials
```

这个错误通常表示：
1. **Refresh Token 过期或无效** ⚠️（最常见）
2. **OAuth2 权限范围不正确**
3. **Gmail API 未启用**
4. **使用了错误的 Google 账户授权**

## 🔧 解决方案

### 步骤 1: 验证 Gmail API 已启用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 确保选中了你的项目
3. 进入 **"API 和服务"** > **"已启用的 API"**
4. 搜索 **"Gmail API"**
5. 如果没有启用，点击 **"启用 API"**

### 步骤 2: 检查 OAuth2 凭据

1. 进入 **"API 和服务"** > **"凭据"**
2. 确认你的 OAuth 2.0 客户端 ID 存在
3. 点击编辑，检查：
   - **已授权的重定向 URI** 包含：`http://localhost:3000/api/auth/callback`
   - **应用类型** 是 **"Web 应用"**

### 步骤 3: 重新获取 Refresh Token

最可能的原因是 refresh token 有问题。让我们重新获取：

1. **确保 `.env.local` 中有 Client ID 和 Secret**：
   ```env
   GMAIL_CLIENT_ID=你的客户端ID
   GMAIL_CLIENT_SECRET=你的客户端密钥
   GMAIL_USER=marketing@btpgrowth.com
   ```

2. **运行获取授权 URL 的脚本**：
   ```bash
   node scripts/get-oauth-url.js
   ```

3. **在浏览器中打开显示的 URL**

4. **重要**：确保使用 **marketing@btpgrowth.com** 账户登录并授权

5. **复制新的 refresh_token**

6. **更新 `.env.local`**：
   ```env
   GMAIL_REFRESH_TOKEN=新的refresh_token
   ```

7. **重启服务器**：
   ```bash
   npm run dev:restart
   ```

8. **测试**：
   - 访问：`http://localhost:3000/api/test-email`
   - 或者在 Contact 页面提交表单

### 步骤 4: 检查 OAuth 同意屏幕

1. 进入 **"API 和服务"** > **"OAuth 同意屏幕"**
2. 确保：
   - **应用名称** 已填写
   - **用户支持电子邮件** 是 `marketing@btpgrowth.com`
   - **应用状态** 可以是 "测试中"（开发阶段）
   - **测试用户**（如果应用是测试模式）：添加 `marketing@btpgrowth.com`

### 步骤 5: 验证权限范围

确保授权时请求的权限范围是：
- `https://www.googleapis.com/auth/gmail.send`

这已经在 `scripts/get-oauth-url.js` 中配置好了。

## 🔍 诊断工具

运行测试端点查看详细错误：
```
访问：http://localhost:3000/api/test-email
```

或查看服务器终端日志中的详细错误信息。

## 💡 常见问题

### Q: Refresh token 会过期吗？
A: Refresh token 通常不会过期，除非：
- 用户撤销了应用访问权限
- 6个月未使用（Google 可能会撤销）
- OAuth2 客户端被删除或重置

### Q: 为什么需要重新授权？
A: 如果 refresh token 无效或过期，需要重新运行授权流程获取新的 refresh token。

### Q: 可以使用其他邮箱吗？
A: 可以，但需要确保：
- 该邮箱是 Google Workspace 或 Gmail 账户
- 授权时使用该邮箱登录
- `.env.local` 中的 `GMAIL_USER` 设置为该邮箱


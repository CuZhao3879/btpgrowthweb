# Gmail OAuth2 设置指南

使用 OAuth2 是最安全的方式，不需要应用专用密码，只需要一次授权就可以持续使用。

## 📋 步骤 1: 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击顶部项目下拉菜单，然后点击 **"新建项目"**
3. 输入项目名称：`BTP Growth Website`
4. 点击 **"创建"**
5. 等待项目创建完成（几秒钟）

## 📋 步骤 2: 启用 Gmail API

1. 在 Google Cloud Console 中，确保选中了刚创建的项目
2. 点击左侧菜单 **"API 和服务"** > **"库"**
3. 搜索 **"Gmail API"**
4. 点击 **"Gmail API"**
5. 点击 **"启用"** 按钮
6. 等待启用完成

## 📋 步骤 3: 创建 OAuth 2.0 凭据

1. 在 Google Cloud Console，点击 **"API 和服务"** > **"凭据"**
2. 点击 **"+ 创建凭据"** > **"OAuth 客户端 ID"**
3. 如果是第一次创建，会要求配置 OAuth 同意屏幕：
   - **用户类型**：选择 **"外部"**，点击 **"创建"**
   - **应用名称**：`BTP Growth Website`
   - **用户支持电子邮件**：选择你的邮箱（marketing@btpgrowth.com）
   - **开发者联系信息**：输入你的邮箱
   - 点击 **"保存并继续"** 直到完成
4. 创建 OAuth 客户端 ID：
   - **应用类型**：选择 **"Web 应用"**
   - **名称**：`BTP Website Email Sender`
   - **已授权的 JavaScript 源**：`http://localhost:3000`（开发环境）
   - **已授权的重定向 URI**：
     - `http://localhost:3000/api/auth/callback`（开发环境）
     - 如果部署了，也添加生产环境的 URL
   - 点击 **"创建"**
5. **复制以下信息**（会显示一次）：
   - **客户端 ID**（Client ID）
   - **客户端密钥**（Client Secret）

## 📋 步骤 4: 配置初始环境变量

在获取 refresh token 之前，先在 `.env.local` 文件中添加你刚才复制的 Client ID 和 Secret：

```env
# Gmail OAuth2 Configuration (先添加这两个)
GMAIL_CLIENT_ID=你的客户端ID
GMAIL_CLIENT_SECRET=你的客户端密钥
GMAIL_USER=marketing@btpgrowth.com
```

## 📋 步骤 5: 获取 Refresh Token

1. **确保开发服务器正在运行**（如果没有，运行 `npm run dev`）

2. 运行授权 URL 生成脚本：
   ```bash
   node scripts/get-oauth-url.js
   ```

3. 脚本会显示一个授权 URL，**复制并在浏览器中打开**

4. 使用你的 Google 账户登录（推荐使用 `marketing@btpgrowth.com`）

5. 点击 **"允许"** 授权访问 Gmail 发送权限

6. 授权成功后会自动跳转到成功页面，显示 **refresh_token**

7. **复制显示的 refresh_token**

## 📋 步骤 6: 完成环境变量配置

在 `.env.local` 文件中添加：

```env
# Gmail OAuth2 Configuration
GMAIL_CLIENT_ID=你的客户端ID
GMAIL_CLIENT_SECRET=你的客户端密钥
GMAIL_REFRESH_TOKEN=你的refresh_token
GMAIL_USER=marketing@btpgrowth.com
```

将复制的 refresh_token 添加到 `.env.local` 文件：

```env
GMAIL_REFRESH_TOKEN=你的refresh_token
```

## 📋 步骤 7: 重启服务器

```bash
npm run dev
```

## ✅ 测试

1. 访问 `http://localhost:3000/contact`
2. 填写表单并提交
3. 检查 `marketing@btpgrowth.com` 邮箱
4. 你应该能收到邮件！

## 🔒 安全提示

- **不要**将这些凭据提交到 Git
- `.env.local` 文件已经在 `.gitignore` 中
- Refresh token 一旦获取，可以长期使用（除非撤销）
- 如果 token 过期，可以重新运行获取脚本

## 🎉 完成！

现在你的网站会：
1. ✅ 将消息保存到 Supabase 数据库
2. ✅ 通过 Gmail OAuth2 发送邮件通知到 `marketing@btpgrowth.com`


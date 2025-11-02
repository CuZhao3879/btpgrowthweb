# 使用 Gmail API 发送邮件（直接方式）

## 📋 方案说明

这个方案使用 **Google 官方的 `googleapis` 库**（已经在你的项目中）直接调用 Gmail API 发送邮件，**不需要 nodemailer 或其他第三方邮件库**。

## ✅ 优势

- ✅ 使用 Google 官方库，更可靠
- ✅ 不需要 nodemailer
- ✅ 不需要 SMTP 配置
- ✅ 直接使用 REST API，更高效
- ✅ 你已经有了 `googleapis` 库和 OAuth2 凭据

## 🔧 实现步骤

### 1. 确认环境变量

确保 `.env.local` 中有以下变量（应该已经有了）：

```env
GMAIL_CLIENT_ID=你的客户端ID
GMAIL_CLIENT_SECRET=你的客户端密钥
GMAIL_REFRESH_TOKEN=你的refresh_token
GMAIL_USER=marketing@btpgrowth.com
```

### 2. 确认 Gmail API 已启用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 进入 **"API 和服务"** > **"已启用的 API"**
3. 确认 **"Gmail API"** 已启用
4. 如果未启用，点击 **"启用 API"**

### 3. 代码实现

我会在 `pages/api/contact.ts` 中添加使用 Gmail API 发送邮件的功能。

## 📝 工作原理

1. 使用 `googleapis` 创建 OAuth2 客户端
2. 使用 refresh token 获取 access token
3. 创建 Gmail API 客户端
4. 构建符合 RFC 2822 格式的邮件内容
5. 使用 Base64 编码邮件内容
6. 调用 `gmail.users.messages.send` 发送邮件

## 🚀 开始实现

如果你同意这个方案，我会：
1. 在 `pages/api/contact.ts` 中添加 Gmail API 发送邮件功能
2. 保持代码简洁，只使用 Google 官方库
3. 添加详细的错误处理和日志

**你是否同意使用这个方案？**


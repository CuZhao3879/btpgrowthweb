# Gmail SMTP 直接发送邮件设置指南

现在代码已经改为直接通过 Gmail SMTP 发送邮件，无需第三方服务。

## 🔐 获取 Gmail 应用专用密码

由于你的 Google Workspace 账户不支持应用专用密码，我们需要通过其他方式。

### 方案 1: 联系管理员启用应用专用密码（推荐）

如果你的账户是公司管理的 Google Workspace：

1. **联系 IT 管理员**或 **Google Workspace 管理员**
2. 要求他们为 `marketing@btpgrowth.com` 账户启用：
   - **"允许不太安全的应用"**（已弃用，但可能仍需要）
   - 或者启用 **"应用专用密码"** 功能
3. 管理员需要在 Google Admin Console 中设置

### 方案 2: 使用 OAuth2（高级，但最安全）

如果无法获取应用专用密码，我们可以使用 OAuth2。这需要：
1. 在 Google Cloud Console 创建项目
2. 配置 OAuth 凭据
3. 获取 refresh token

**这个方案比较复杂，但更安全可靠。**

### 方案 3: 使用"不太安全的应用"选项（临时方案）

如果管理员可以启用这个选项：

1. 使用你的普通 Gmail 密码（不是应用专用密码）
2. 管理员需要在 Google Workspace 中启用"允许不太安全的应用"

⚠️ **注意**：这个选项安全性较低，不推荐长期使用。

## 📋 配置步骤（如果获取到密码后）

一旦你获得了应用专用密码或普通密码，在 `.env.local` 文件中添加：

```env
# Gmail SMTP Configuration
GMAIL_USER=marketing@btpgrowth.com
GMAIL_PASSWORD=你的应用专用密码或Gmail密码
```

然后重启服务器即可。

## 🤔 你希望使用哪种方案？

1. **方案 1**：联系管理员启用应用专用密码（最简单）
2. **方案 2**：使用 OAuth2（最安全，但需要一些配置）
3. **方案 3**：使用不太安全的应用（临时方案）

告诉我你的选择，我可以帮你配置！


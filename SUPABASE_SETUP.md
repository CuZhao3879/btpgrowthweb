# Supabase 设置指南

本指南将帮助你设置 Supabase 数据库来接收网站联系表单的消息。

## 📋 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 注册/登录账户
3. 点击 "New Project"
4. 填写项目信息：
   - **Name**: BTP Growth Solutions (或你喜欢的名称)
   - **Database Password**: 创建一个强密码（保存好！）
   - **Region**: 选择离你最近的区域（如 Southeast Asia）
5. 点击 "Create new project" 并等待创建完成（约 2 分钟）

## 📋 步骤 2: 创建数据库表

1. 在 Supabase 项目中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 复制并粘贴以下 SQL 代码：

```sql
-- 创建联系消息表
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);

-- 启用 Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户插入数据
CREATE POLICY "Allow anonymous inserts" ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 创建策略：只有通过服务角色密钥才能读取（用于管理员查看）
CREATE POLICY "Service role can read all" ON contact_messages
  FOR SELECT
  TO service_role
  USING (true);

-- 创建策略：只有通过服务角色密钥才能更新（用于标记已读）
CREATE POLICY "Service role can update all" ON contact_messages
  FOR UPDATE
  TO service_role
  USING (true);
```

4. 点击 **Run** 执行 SQL
5. 确认表创建成功（应该看到 "Success. No rows returned"）

## 📋 步骤 3: 获取 API 密钥

1. 在 Supabase 项目中，点击左侧菜单的 **Settings** (⚙️)
2. 点击 **API**
3. 复制以下信息：
   - **Project URL** (在 "Project URL" 部分)
   - **anon/public key** (在 "Project API keys" 部分，选择 "anon public")
   - **service_role key** (在 "Project API keys" 部分，选择 "service_role" - **这个要保密！**)

## 📋 步骤 4: 配置环境变量

1. 在项目根目录找到或创建 `.env.local` 文件
2. 添加以下环境变量：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
```

**示例：**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **重要提示：**
- `SUPABASE_SERVICE_ROLE_KEY` 有管理员权限，**不要**提交到 Git
- 确保 `.env.local` 在 `.gitignore` 中（通常已经包含）
- 在生产环境部署时，需要在部署平台（Vercel/Netlify等）的设置中添加这些环境变量

## 📋 步骤 5: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## ✅ 验证设置

1. 访问网站的 Contact 页面
2. 填写表单并提交
3. 在 Supabase 项目中：
   - 点击左侧菜单的 **Table Editor**
   - 选择 `contact_messages` 表
   - 你应该能看到刚才提交的消息！

## 📊 查看消息

### 方法 1: 通过 Supabase Dashboard
1. 登录 Supabase
2. 进入项目
3. 点击 **Table Editor** > `contact_messages`
4. 查看所有提交的消息

### 方法 2: 通过 SQL 查询
在 SQL Editor 中运行：
```sql
SELECT * FROM contact_messages 
ORDER BY created_at DESC;
```

### 方法 3: 创建管理面板（可选）
可以创建一个管理员页面来查看和管理消息（未来可以扩展）

## 🔒 安全注意事项

1. **不要**在客户端代码中使用 `SUPABASE_SERVICE_ROLE_KEY`
2. **不要**将 `.env.local` 提交到 Git
3. Row Level Security (RLS) 已经启用，匿名用户只能插入数据，不能读取或修改
4. 定期检查 Supabase 的访问日志

## 🆘 故障排除

### 问题：消息没有保存到数据库
- 检查环境变量是否正确设置
- 检查 Supabase 项目是否正常运行
- 查看浏览器控制台和服务器日志中的错误信息

### 问题：CORS 错误
- 在 Supabase Dashboard > Settings > API 中检查 CORS 设置
- 确保你的域名已添加到允许列表中（如果需要）

### 问题：权限错误
- 检查 RLS 策略是否正确设置
- 确认使用的是正确的 API 密钥

## 📝 数据库表结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGSERIAL | 主键，自动递增 |
| name | VARCHAR(255) | 姓名（必填） |
| email | VARCHAR(255) | 邮箱（必填） |
| phone | VARCHAR(50) | 电话号码（可选） |
| message | TEXT | 消息内容（必填） |
| created_at | TIMESTAMPTZ | 创建时间（自动） |
| read | BOOLEAN | 是否已读（默认 false） |

## 🎉 完成！

现在你的网站可以接收并存储联系表单的消息了。所有提交的消息都会保存在 Supabase 数据库中，你可以随时查看和管理。


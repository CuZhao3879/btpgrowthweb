# 开发服务器管理脚本

## 🎯 用途

这些脚本用于安全地管理 Next.js 开发服务器，**不会影响 MCP 服务器或其他 Node.js 进程**。

## ⚠️ 问题说明

之前的重启命令 `Get-Process -Name node | Stop-Process -Force` 会杀死**所有** Node.js 进程，包括：
- ❌ Next.js 开发服务器
- ❌ **MCP 服务器（Seedream 4.0）**
- ❌ 其他 Node.js 进程

这导致 MCP 连接断开。

## ✅ 解决方案

新的脚本通过以下方式识别和停止进程：
1. **检查端口**：只查找监听端口 3000 的进程
2. **验证进程**：确认是 Next.js 进程（检查命令行参数）
3. **精确停止**：只停止确认的 Next.js 进程

这样 MCP 服务器和其他 Node.js 进程不会受影响。

## 📝 使用方法

### 方法 1：使用 npm 脚本（推荐）

```powershell
# 安全重启开发服务器（停止 + 启动）
npm run dev:restart

# 只停止开发服务器
npm run dev:stop
```

### 方法 2：直接运行脚本

```powershell
# 重启
powershell -ExecutionPolicy Bypass -File ./scripts/restart-dev.ps1

# 停止
powershell -ExecutionPolicy Bypass -File ./scripts/stop-dev.ps1
```

### 方法 3：手动启动（传统方式）

```powershell
# 启动
npm run dev

# 停止：在运行 dev 的终端按 Ctrl+C
```

## 🔍 验证 MCP 连接

重启后，可以测试 MCP 连接是否正常：

1. 在 Cursor 中使用 `mcp_seedream_generate-image` 工具
2. 或询问 AI 助手生成图片，如果成功则连接正常

## 📋 脚本说明

### `restart-dev.ps1`
- 查找并停止监听端口 3000 的 Next.js 进程
- 验证进程确实是 Next.js（通过命令行检查）
- 自动启动新的开发服务器

### `stop-dev.ps1`
- 只停止开发服务器，不启动新服务器
- 用于完全停止开发服务器

## ⚡ 快速参考

| 操作 | 命令 | 说明 |
|------|------|------|
| 启动 | `npm run dev` | 启动开发服务器 |
| 安全重启 | `npm run dev:restart` | 重启开发服务器（不影响 MCP） |
| 安全停止 | `npm run dev:stop` | 停止开发服务器（不影响 MCP） |
| 传统停止 | `Ctrl+C` | 在运行 dev 的终端中按 Ctrl+C |

## 🛡️ 保护机制

脚本包含以下保护机制：
- ✅ 只处理监听端口 3000 的进程
- ✅ 验证进程命令行包含 "next"
- ✅ 显示进程信息，避免误杀
- ✅ 如果检测到非 Next.js 进程，会跳过并警告



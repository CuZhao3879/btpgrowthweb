# 🔧 MCP 服务器断开问题修复

## ❌ 问题描述

在使用 `Get-Process -Name node | Stop-Process -Force` 重启 Next.js 开发服务器时，**MCP 服务器（Seedream 4.0）会断开连接**。

### 问题原因

`Stop-Process -Name node -Force` 会杀死**所有**名为 `node` 的进程，包括：
- Next.js 开发服务器 ✅（目标）
- **MCP 服务器** ❌（意外被杀死）
- 其他 Node.js 进程 ❌（可能被误杀）

## ✅ 解决方案

已创建安全的脚本，**只停止监听端口 3000 的 Next.js 进程**，不会影响其他 Node.js 进程。

## 📦 新增文件

1. **`scripts/restart-dev.ps1`** - 安全重启开发服务器
2. **`scripts/stop-dev.ps1`** - 安全停止开发服务器
3. **`scripts/README.md`** - 详细使用说明

## 🚀 使用方法

### 推荐方式（使用 npm 脚本）

```powershell
# 安全重启开发服务器
npm run dev:restart

# 只停止开发服务器
npm run dev:stop
```

### 传统方式（仍然可用）

```powershell
# 启动
npm run dev

# 停止：在运行 dev 的终端按 Ctrl+C
```

## 🛡️ 工作原理

新脚本的工作流程：

1. **查找端口 3000** - 使用 `Get-NetTCPConnection` 找到监听该端口的进程
2. **验证进程** - 检查进程命令行是否包含 "next"
3. **精确停止** - 只停止确认的 Next.js 进程
4. **保护其他进程** - 如果不是 Next.js 进程，会跳过并警告

## ✅ 验证修复

重启后，可以通过以下方式验证 MCP 连接正常：

1. 在 Cursor 中使用 MCP 工具（如生成图片）
2. 询问 AI 助手生成图片，如果成功则连接正常

## 📋 注意事项

- ✅ **推荐使用** `npm run dev:restart` 来重启开发服务器
- ❌ **避免使用** `Get-Process -Name node | Stop-Process -Force`
- ✅ **传统方式** `npm run dev` + `Ctrl+C` 仍然安全可用

## 🎯 总结

现在你可以安全地重启开发服务器，**MCP 服务器连接会保持正常**！



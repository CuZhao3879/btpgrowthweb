# 网站自动化测试

本目录包含使用 Playwright 编写的网站健康检查自动化测试脚本。

## 测试内容

测试脚本会自动检查以下内容：

1. **页面加载测试** - 检查主要页面（/, /about, /services, /contact, /blog）是否能成功加载
2. **图片加载测试** - 验证所有图片是否返回 200 状态码
3. **导航链接测试** - 检查导航栏中的所有链接是否正常工作
4. **按钮和链接交互** - 验证按钮和链接是否可点击且不会报错
5. **联系表单测试** - 测试联系表单是否能正确提交
6. **博客链接检查** - 验证博客文章链接是否可访问
7. **404 页面处理** - 检查不存在的页面是否正确处理

## 安装依赖

```bash
npm install
npx playwright install chromium
```

## 运行测试

### 基本运行（无头模式）
```bash
npm test
```

### UI 模式（推荐，可视化测试过程）
```bash
npm run test:ui
```

### 有头模式（可以看到浏览器窗口）
```bash
npm run test:headed
```

### 查看测试报告
```bash
npm run test:report
```

## 测试报告

测试完成后，会在以下位置生成报告：

- **JSON 报告**: `test-results/test-report-{timestamp}.json`
- **文本报告**: `test-results/test-report-{timestamp}.txt`
- **HTML 报告**: `playwright-report/index.html` (运行 `npm run test:report` 查看)

## 环境变量

可以通过环境变量配置测试：

```bash
# 设置测试的基础URL（默认: http://localhost:3000）
BASE_URL=http://localhost:3000 npm test
```

## 注意事项

1. 运行测试前确保开发服务器正在运行（`npm run dev`）
2. 如果联系表单 API 未配置，表单提交测试可能会被跳过
3. 测试会自动启动服务器（如果未运行），但建议手动启动以获得更好的控制

## 测试结果解读

- ✅ **通过**: 测试项正常工作
- ❌ **失败**: 发现问题，需要修复
- ⏭️ **跳过**: 测试被跳过（通常是因为前置条件不满足）

报告会列出所有发现的问题，包括：
- 页面加载失败
- 图片加载失败
- 404 死链
- 表单提交错误
- 其他交互问题


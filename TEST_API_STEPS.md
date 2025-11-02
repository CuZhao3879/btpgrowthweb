# 在浏览器中测试 API 的步骤

## 方法 1: 使用浏览器控制台（Console）测试

### 步骤：

1. **打开你的网站**
   - 访问 `https://btpgrowth.com/contact` 或你的域名

2. **打开开发者工具**
   - 按 `F12` 键
   - 或者右键点击页面 → "检查" / "Inspect"
   - 或者按 `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)

3. **切换到 Console 标签**
   - 点击开发者工具顶部的 "Console" 标签
   - 这里可以输入和运行 JavaScript 代码

4. **粘贴测试代码并运行**
   - 复制下面的代码
   - 粘贴到 Console 中
   - 按 `Enter` 键运行

```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '测试用户',
    email: 'test@example.com',
    message: '这是一条测试消息'
  })
})
.then(async res => {
  const contentType = res.headers.get('content-type')
  console.log('✅ Status Code:', res.status)
  console.log('✅ Content-Type:', contentType)
  
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json()
    console.log('✅ Success! Response:', data)
    return data
  } else {
    const text = await res.text()
    console.error('❌ Error - API returned HTML instead of JSON')
    console.error('Response (first 500 characters):', text.substring(0, 500))
    alert('API 返回了错误响应，请查看控制台获取详细信息')
  }
})
.catch(err => {
  console.error('❌ Network Error:', err)
  alert('网络错误：' + err.message)
})
```

5. **查看结果**
   - 成功的话会显示绿色 ✅ 和响应数据
   - 失败的话会显示红色 ❌ 和错误信息

---

## 方法 2: 直接提交表单并查看 Network 标签（更真实）

### 步骤：

1. **打开你的网站**
   - 访问 `https://btpgrowth.com/contact`

2. **打开开发者工具**
   - 按 `F12` 键
   - 切换到 **"Network"** 标签（网络标签）

3. **确保 Network 标签正在录制**
   - 确认左上角的红色圆点是亮着的（如果没亮，点击一下）

4. **填写并提交表单**
   - 在 Contact 页面填写表单
   - 点击 "Send Message" 按钮

5. **查看网络请求**
   - 在 Network 标签中找到 `/api/contact` 请求
   - 点击它查看详情
   - 查看以下信息：
     - **Status**: 状态码（应该是 200 表示成功，或 4xx/5xx 表示错误）
     - **Response**: 响应内容（应该是 JSON 格式）
     - **Headers**: 响应头（`content-type` 应该是 `application/json`）

6. **如果看到 HTML 响应**
   - Response 标签中显示的是 `<html>...` 或 `<!DOCTYPE...`
   - 说明 API 路由没有正确部署

---

## 常见问题

### Q: 代码放在哪里？
**A**: 放在浏览器开发者工具的 **Console** 标签中，不是地址栏。

### Q: 需要在空白页面测试吗？
**A**: 不需要。在 `https://btpgrowth.com/contact` 页面上打开控制台即可。

### Q: 控制台在哪里？
**A**: 
- 按 `F12` 打开开发者工具
- 点击顶部标签中的 "Console" / "控制台"

### Q: 看不到结果？
**A**: 
- 确保代码完整复制了
- 确保按了 `Enter` 键运行
- 查看控制台是否有红色错误信息

### Q: 如何复制控制台输出？
**A**: 
- 右键点击控制台输出 → "Copy" / "复制"
- 或者选中文本后 `Ctrl + C`

---

## 如果测试失败，请提供以下信息：

1. **Status Code**: 显示的数字（如 200, 404, 500）
2. **Content-Type**: 显示的类型（应该是 `application/json`）
3. **Response**: 显示的完整响应内容（截图或复制文本）
4. **错误信息**: 控制台中的任何红色错误信息


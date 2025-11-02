/**
 * Gmail OAuth2 Token 获取脚本
 * 
 * 使用方法：
 * 1. 确保已配置 GMAIL_CLIENT_ID 和 GMAIL_CLIENT_SECRET 在 .env.local
 * 2. 运行: node scripts/get-gmail-token.js
 * 3. 在浏览器中打开显示的 URL
 * 4. 授权后复制返回的 code
 * 5. 粘贴到终端
 * 6. 复制输出的 refresh_token 到 .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const readline = require('readline');
const http = require('http');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback';
const GMAIL_USER = process.env.GMAIL_USER || 'marketing@btpgrowth.com';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ 错误：请在 .env.local 中配置 GMAIL_CLIENT_ID 和 GMAIL_CLIENT_SECRET');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// 设置访问权限范围
const scopes = [
  'https://www.googleapis.com/auth/gmail.send'
];

// 生成授权 URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent', // 强制显示同意屏幕以获取 refresh token
});

console.log('\n📧 Gmail OAuth2 Token 获取工具\n');
console.log('请按照以下步骤操作：\n');
console.log('1. 在浏览器中打开以下 URL：');
console.log('\n' + authUrl + '\n');
console.log('2. 使用你的 Google 账户登录（推荐使用 marketing@btpgrowth.com）');
console.log('3. 点击"允许"授权访问');
console.log('4. 复制浏览器地址栏中的完整 URL（包含 code=... 的 URL）\n');

// 创建临时 HTTP 服务器来接收回调
const server = http.createServer((req, res) => {
  if (req.url.indexOf('/api/auth/callback') > -1) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get('code');
    
    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>授权成功</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 500px;
              }
              h1 { color: #4CAF50; margin-top: 0; }
              p { color: #666; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ 授权成功！</h1>
              <p>你现在可以关闭这个窗口，然后回到终端查看结果。</p>
            </div>
          </body>
        </html>
      `);
      
      // 使用 code 获取 token
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('❌ 获取 token 失败:', err.message);
          server.close();
          process.exit(1);
        }
        
        console.log('\n✅ 成功获取 token！\n');
        console.log('请将以下 refresh_token 复制到 .env.local 文件：\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`GMAIL_REFRESH_TOKEN=${token.refresh_token}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('✅ 配置完成！现在可以重启服务器测试邮件发送了。\n');
        
        server.close();
        process.exit(0);
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('授权失败：未找到授权码');
      server.close();
      process.exit(1);
    }
  }
});

server.listen(3000, () => {
  console.log('\n⏳ 等待授权回调...\n');
});

// 30 秒超时
setTimeout(() => {
  console.log('\n❌ 超时：请在 30 秒内完成授权');
  server.close();
  process.exit(1);
}, 30000);


/**
 * 生成 Gmail OAuth2 授权 URL
 * 
 * 使用方法：
 * 1. 确保已配置 GMAIL_CLIENT_ID 和 GMAIL_CLIENT_SECRET 在 .env.local
 * 2. 运行: node scripts/get-oauth-url.js
 * 3. 在浏览器中打开显示的 URL
 * 4. 授权后会自动跳转并显示 refresh_token
 */

require('dotenv').config({ path: '.env.local' });

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ 错误：请在 .env.local 中配置：');
  console.error('   GMAIL_CLIENT_ID=你的客户端ID');
  console.error('   GMAIL_CLIENT_SECRET=你的客户端密钥\n');
  process.exit(1);
}

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.send'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent', // 强制显示同意屏幕以获取 refresh token
});

console.log('\n📧 Gmail OAuth2 授权工具\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('请按照以下步骤操作：\n');
console.log('1. 在浏览器中打开以下 URL：\n');
console.log(authUrl);
console.log('\n2. 使用你的 Google 账户登录（推荐使用 marketing@btpgrowth.com）');
console.log('3. 点击"允许"授权访问 Gmail 发送权限');
console.log('4. 授权成功后会自动跳转并显示 refresh_token');
console.log('5. 复制 refresh_token 到 .env.local 文件\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');


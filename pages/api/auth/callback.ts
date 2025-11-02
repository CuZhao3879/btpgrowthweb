import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query

  if (!code || typeof code !== 'string') {
    return res.status(400).send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>授权失败</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
            }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">❌ 授权失败</h1>
            <p>未找到授权码，请重试。</p>
          </div>
        </body>
      </html>
    `)
  }

  const CLIENT_ID = process.env.GMAIL_CLIENT_ID
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
  const REDIRECT_URI = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/auth/callback`

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>配置错误</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
            }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">❌ 配置错误</h1>
            <p>请在 .env.local 中配置 GMAIL_CLIENT_ID 和 GMAIL_CLIENT_SECRET</p>
          </div>
        </body>
      </html>
    `)
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    )

    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.refresh_token) {
      return res.status(400).send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>授权失败</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 600px;
              }
              .error { color: #dc2626; }
              .token {
                background: #f3f4f6;
                padding: 15px;
                border-radius: 5px;
                word-break: break-all;
                font-family: monospace;
                margin: 20px 0;
                border: 2px solid #e5e7eb;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="error">⚠️ 未获取到 Refresh Token</h1>
              <p>请确保在授权时选择了所有权限，并重新授权。</p>
            </div>
          </body>
        </html>
      `)
    }

    return res.send(`
      <!DOCTYPE html>
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
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 700px;
              margin: 20px;
            }
            h1 {
              color: #4CAF50;
              margin-top: 0;
            }
            .token-container {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid #e5e7eb;
            }
            .token {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              word-break: break-all;
              color: #1f2937;
              background: white;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #d1d5db;
            }
            .copy-btn {
              background: #2563eb;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            }
            .copy-btn:hover {
              background: #1d4ed8;
            }
            .instructions {
              text-align: left;
              background: #eff6ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
              margin-top: 20px;
            }
            .instructions ol {
              margin: 10px 0;
              padding-left: 20px;
            }
            .instructions li {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ 授权成功！</h1>
            <p>请将以下 Refresh Token 复制到你的 .env.local 文件中：</p>
            
            <div class="token-container">
              <div class="token" id="token">${tokens.refresh_token}</div>
              <button class="copy-btn" onclick="copyToken()">📋 复制 Token</button>
            </div>

            <div class="instructions">
              <strong>📝 下一步操作：</strong>
              <ol>
                <li>点击上面的"复制 Token"按钮</li>
                <li>打开项目根目录的 <code>.env.local</code> 文件</li>
                <li>添加或更新以下行：<br>
                  <code style="background: #f9fafb; padding: 5px; border-radius: 3px;">GMAIL_REFRESH_TOKEN=粘贴你的token</code>
                </li>
                <li>保存文件</li>
                <li>重启开发服务器</li>
              </ol>
            </div>
          </div>

          <script>
            function copyToken() {
              const token = document.getElementById('token').textContent;
              navigator.clipboard.writeText(token).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ 已复制！';
                btn.style.background = '#4CAF50';
                setTimeout(() => {
                  btn.textContent = originalText;
                  btn.style.background = '#2563eb';
                }, 2000);
              });
            }
          </script>
        </body>
      </html>
    `)
  } catch (error) {
    console.error('OAuth2 token exchange error:', error)
    return res.status(500).send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>授权失败</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
            }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">❌ 授权失败</h1>
            <p>${error instanceof Error ? error.message : '未知错误'}</p>
          </div>
        </body>
      </html>
    `)
  }
}


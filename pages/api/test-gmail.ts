import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow both GET and POST for testing
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Gmail OAuth2 configuration
    const gmailClientId = process.env.GMAIL_CLIENT_ID
    const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET
    const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN
    const gmailUser = process.env.GMAIL_USER || 'marketing@btpgrowth.com'
    const recipientEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      configuration: {
        hasClientId: !!gmailClientId,
        hasClientSecret: !!gmailClientSecret,
        hasRefreshToken: !!gmailRefreshToken,
        gmailUser,
        recipientEmail,
      },
      steps: [],
    }

    // Step 1: Validate configuration
    if (!gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
      diagnostics.error = 'Missing Gmail OAuth2 configuration'
      diagnostics.missing = {
        clientId: !gmailClientId,
        clientSecret: !gmailClientSecret,
        refreshToken: !gmailRefreshToken,
      }
      return res.status(500).json(diagnostics)
    }

    diagnostics.steps.push({ step: 1, status: 'ok', message: 'Configuration validated' })

    // Step 2: Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      gmailClientId,
      gmailClientSecret,
      'urn:ietf:wg:oauth:2.0:oob'
    )

    diagnostics.steps.push({ step: 2, status: 'ok', message: 'OAuth2 client created' })

    // Step 3: Set credentials and get access token
    oauth2Client.setCredentials({
      refresh_token: gmailRefreshToken,
    })

    diagnostics.steps.push({ step: 3, status: 'ok', message: 'Credentials set' })

    // Step 4: Get access token
    let accessToken
    try {
      const tokenResponse = await oauth2Client.getAccessToken()
      accessToken = tokenResponse.token
      if (!accessToken) {
        throw new Error('Access token is null or undefined')
      }
      diagnostics.steps.push({
        step: 4,
        status: 'ok',
        message: 'Access token obtained',
        tokenPreview: accessToken.substring(0, 20) + '...',
      })
    } catch (tokenError) {
      diagnostics.error = 'Failed to get access token'
      diagnostics.tokenError = {
        message: tokenError instanceof Error ? tokenError.message : 'Unknown error',
        details: tokenError,
      }
      diagnostics.steps.push({
        step: 4,
        status: 'error',
        message: 'Failed to get access token',
        error: tokenError instanceof Error ? tokenError.message : 'Unknown error',
      })
      return res.status(500).json(diagnostics)
    }

    // Step 5: Set access token and create Gmail client
    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    diagnostics.steps.push({ step: 5, status: 'ok', message: 'Gmail API client created' })

    // Step 6: Build test email
    const emailSubject = 'Test Email from BTP Growth Website - ' + new Date().toISOString()
    const emailBody = `This is a test email to verify Gmail API configuration.
    
Timestamp: ${new Date().toISOString()}
From: ${gmailUser}
To: ${recipientEmail}

If you receive this email, the Gmail API is working correctly!`

    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
      .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
      .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>✅ Test Email - Gmail API Working!</h2>
      </div>
      <div class="content">
        <p>This is a test email to verify Gmail API configuration.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${gmailUser}</p>
        <p><strong>To:</strong> ${recipientEmail}</p>
        <p>If you receive this email, the Gmail API is working correctly! 🎉</p>
      </div>
    </div>
  </body>
</html>
    `.trim()

    // Build RFC 2822 formatted email
    const rawEmail = [
      `From: "BTP Growth Website" <${gmailUser}>`,
      `To: ${recipientEmail}`,
      `Subject: ${emailSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="boundary123"`,
      ``,
      `--boundary123`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      emailBody,
      ``,
      `--boundary123`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      emailHtml,
      ``,
      `--boundary123--`,
    ].join('\n')

    // Base64 encode the email (URL-safe base64 encoding)
    const encodedEmail = Buffer.from(rawEmail)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    diagnostics.steps.push({ step: 6, status: 'ok', message: 'Email content built and encoded' })

    // Step 7: Send email via Gmail API
    try {
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      })

      diagnostics.success = true
      diagnostics.steps.push({
        step: 7,
        status: 'ok',
        message: 'Email sent successfully via Gmail API',
        messageId: response.data.id,
        threadId: response.data.threadId,
      })

      diagnostics.result = {
        messageId: response.data.id,
        threadId: response.data.threadId,
        to: recipientEmail,
        from: gmailUser,
        subject: emailSubject,
      }

      return res.status(200).json(diagnostics)
    } catch (sendError: any) {
      diagnostics.error = 'Failed to send email via Gmail API'
      diagnostics.sendError = {
        message: sendError instanceof Error ? sendError.message : 'Unknown error',
        code: sendError?.code,
        response: sendError?.response?.data,
        status: sendError?.response?.status,
      }
      diagnostics.steps.push({
        step: 7,
        status: 'error',
        message: 'Failed to send email',
        error: sendError instanceof Error ? sendError.message : 'Unknown error',
        details: sendError?.response?.data,
      })
      return res.status(500).json(diagnostics)
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}


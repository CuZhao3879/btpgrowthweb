/**
 * Shared email utility for BTP Growth
 * Reuses the existing Gmail API OAuth2 setup from contact.ts
 */

let google: any = null

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const gmailClientId = process.env.GMAIL_CLIENT_ID
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET
  const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN
  const gmailUser = process.env.GMAIL_USER || 'marketing@btpgrowth.com'

  if (!gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
    console.warn('Gmail OAuth2 not configured, cannot send OTP email')
    return false
  }

  // Lazy load googleapis
  if (!google) {
    try {
      google = require('googleapis').google
    } catch (error) {
      console.error('Failed to load googleapis:', error)
      return false
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    gmailClientId,
    gmailClientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  )

  oauth2Client.setCredentials({ refresh_token: gmailRefreshToken })

  let accessToken
  try {
    const tokenResponse = await oauth2Client.getAccessToken()
    accessToken = tokenResponse.token
    if (!accessToken) throw new Error('No access token')
  } catch (err) {
    console.error('OAuth2 token error:', err)
    return false
  }

  oauth2Client.setCredentials({ access_token: accessToken })
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  const formattedOtp = otpCode.slice(0, 3) + ' ' + otpCode.slice(3)

  const emailHtml = `
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 420px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
      <div style="background: #0f172a; padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">BTP Growth</h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Affiliate Program</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="color: #334155; font-size: 15px; margin: 0 0 24px;">Your password reset verification code:</p>
        <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
          <p style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; margin: 0; font-family: monospace;">${formattedOtp}</p>
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 0;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  </body>
</html>`.trim()

  const rawEmail = [
    `From: "BTP Growth" <${gmailUser}>`,
    `To: ${toEmail}`,
    `Subject: Your BTP Growth verification code: ${formattedOtp}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    emailHtml,
  ].join('\n')

  const encodedEmail = Buffer.from(rawEmail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedEmail },
    })
    console.log(`✅ OTP email sent to ${toEmail}`)
    return true
  } catch (err) {
    console.error('Failed to send OTP email:', err)
    return false
  }
}

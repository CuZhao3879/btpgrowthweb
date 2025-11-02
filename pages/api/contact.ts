import type { NextApiRequest, NextApiResponse } from 'next'

// Lazy load dependencies to avoid import errors
let supabaseAdmin: any = null
let google: any = null

// Initialize Supabase client only if env vars are available
function getSupabaseClient() {
  if (supabaseAdmin) return supabaseAdmin
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    return supabaseAdmin
  } catch (error) {
    throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Wrap entire handler in try-catch to ensure JSON responses
  try {
    const { name, email, phone, message }: ContactFormData = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, and message are required' 
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Initialize Supabase client (will throw if env vars missing)
    let supabaseClient
    try {
      supabaseClient = getSupabaseClient()
    } catch (initError) {
      console.error('Supabase initialization error:', initError)
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: initError instanceof Error ? initError.message : 'Failed to initialize database connection'
      })
    }

    // Insert into Supabase
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to save message',
        details: error.message 
      })
    }

    // Send email notification using Gmail API (don't fail if email fails)
    let emailStatus = null
    try {
      emailStatus = await sendEmailViaGmailAPI({ name, email, phone, message })
      console.log('✅ Email notification sent successfully via Gmail API:', emailStatus)
    } catch (err) {
      console.error('❌ Email sending failed (non-critical):', err)
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      })
      // Continue even if email fails - message is already saved to Supabase
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully',
      data 
    })
  } catch (error) {
    console.error('API error:', error)
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Check environment variables for debugging
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasGmailClientId: !!process.env.GMAIL_CLIENT_ID,
      hasGmailClientSecret: !!process.env.GMAIL_CLIENT_SECRET,
      hasGmailRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
    }
    
    console.error('Error details:', {
      message: errorDetails,
      stack: errorStack,
      envCheck,
    })
    
    // Always return JSON, never HTML
    return res.status(500).json({ 
      error: 'Internal server error',
      details: errorDetails,
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {})
    })
  }
}

// Send email using Gmail API directly (no nodemailer needed)
async function sendEmailViaGmailAPI({
  name,
  email,
  phone,
  message,
}: ContactFormData) {
  // Gmail OAuth2 configuration
  const gmailClientId = process.env.GMAIL_CLIENT_ID
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET
  const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN
  const gmailUser = process.env.GMAIL_USER || 'marketing@btpgrowth.com'
  const recipientEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'

  if (!gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
    console.warn('Gmail OAuth2 not configured, skipping email notification')
    return null
  }

  // Lazy load googleapis
  if (!google) {
    try {
      google = require('googleapis').google
    } catch (error) {
      console.error('Failed to load googleapis:', error)
      throw new Error('Gmail API library not available')
    }
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    gmailClientId,
    gmailClientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  )

  // Set credentials
  oauth2Client.setCredentials({
    refresh_token: gmailRefreshToken,
  })

  // Get access token
  let accessToken
  try {
    const tokenResponse = await oauth2Client.getAccessToken()
    accessToken = tokenResponse.token
    if (!accessToken) {
      throw new Error('Failed to get access token')
    }
    console.log('✅ Access token obtained successfully')
  } catch (tokenError) {
    console.error('❌ Failed to get access token:', tokenError)
    throw new Error(`OAuth2 token error: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`)
  }

  // Set the access token for the OAuth2 client
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  // Create Gmail API client
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  // Build email content in RFC 2822 format
  const emailSubject = `New Contact Form Message from ${name}`
  const emailBody = `
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
This message was sent from your website contact form and has been saved to your Supabase database.
  `.trim()

  const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .header {
        background-color: #2563eb;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        margin: -20px -20px 20px -20px;
      }
      .content {
        background-color: #f9fafb;
        padding: 20px;
        border-radius: 0 0 8px 8px;
      }
      .field {
        margin-bottom: 15px;
      }
      .label {
        font-weight: bold;
        color: #2563eb;
        display: block;
        margin-bottom: 5px;
      }
      .value {
        padding: 10px;
        background-color: white;
        border-left: 3px solid #2563eb;
        border-radius: 4px;
      }
      .message-box {
        padding: 15px;
        background-color: white;
        border-left: 3px solid #2563eb;
        border-radius: 4px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Contact Form Message</h2>
        <p style="margin: 0; opacity: 0.9;">You have received a new message from your website contact form</p>
      </div>
      <div class="content">
        <div class="field">
          <span class="label">Name:</span>
          <div class="value">${name}</div>
        </div>
        
        <div class="field">
          <span class="label">Email:</span>
          <div class="value"><a href="mailto:${email}">${email}</a></div>
        </div>
        
        ${phone ? `
        <div class="field">
          <span class="label">Phone:</span>
          <div class="value"><a href="tel:${phone}">${phone}</a></div>
        </div>
        ` : ''}
        
        <div class="field">
          <span class="label">Message:</span>
          <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #666; font-size: 12px; margin: 0;">
          This message was sent from your website contact form and has been saved to your Supabase database.
        </p>
      </div>
    </div>
  </body>
</html>
  `.trim()

  // Build RFC 2822 formatted email
  const rawEmail = [
    `From: "BTP Growth Website" <${gmailUser}>`,
    `To: ${recipientEmail}`,
    `Reply-To: ${email}`,
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

  // Send email via Gmail API
  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    })

    console.log('✅ Email sent successfully via Gmail API')
    console.log('📧 Email details:', {
      to: recipientEmail,
      from: gmailUser,
      subject: emailSubject,
      messageId: response.data.id,
      threadId: response.data.threadId,
    })

    return {
      success: true,
      messageId: response.data.id,
      threadId: response.data.threadId,
      to: recipientEmail,
      from: gmailUser,
    }
  } catch (sendError) {
    console.error('❌ Failed to send email via Gmail API:', sendError)
    console.error('Error details:', {
      message: sendError instanceof Error ? sendError.message : 'Unknown error',
      stack: sendError instanceof Error ? sendError.stack : undefined,
      response: (sendError as any)?.response?.data,
    })
    throw sendError
  }
}


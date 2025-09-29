import { Ticket, User, Building, Phone, Mail, MessageSquare } from 'lucide-react'
import React from 'react'
import resend from '@/lib/resend'

const PartnersTicketEmail = async ({ formData }: { formData: Record<string, string> }) => {

  const emailToUse = "rmcdeem.m@gmail.com"

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Partnership Inquiry - Digital Revolution</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z"></path>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">New Partnership Inquiry</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Digital Revolution Partnership Request</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Contact Information -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #7c3aed;">
            <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" style="margin-right: 10px;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Contact Information
            </h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: center; padding: 12px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="margin-right: 12px;">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div>
                  <div style="color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Name</div>
                  <div style="color: #1e293b; font-weight: 600;">${formData.firstName} ${formData.lastName}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 12px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="margin-right: 12px;">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <div style="color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email</div>
                  <div style="color: #1e293b; font-weight: 600;">${formData.email}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 12px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="margin-right: 12px;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <div style="color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Phone</div>
                  <div style="color: #1e293b; font-weight: 600;">${formData.phoneNumber}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 12px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="margin-right: 12px;">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l8-4v18"></path>
                  <path d="M19 21V11l-6-4"></path>
                </svg>
                <div>
                  <div style="color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Organization</div>
                  <div style="color: #1e293b; font-weight: 600;">${formData.organization}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 30px; border-left: 4px solid #10b981;">
            <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin-right: 10px;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Partnership Message
            </h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="color: #1e293b; margin: 0; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
            </div>
          </div>

          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin-top: 30px; border: 1px solid #f59e0b;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="margin-right: 10px;">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <h3 style="color: #92400e; margin: 0; font-size: 16px; font-weight: 600;">Action Required</h3>
            </div>
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              Please review this partnership inquiry and respond within 24-48 hours. You can contact them directly at 
              <strong>${formData.email}</strong> or <strong>${formData.phoneNumber}</strong>.
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 30px; text-align: center; border-top: 1px solid #334155;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">
            This email was sent from the Digital Revolution partnership form.
          </p>
          <p style="color: #64748b; margin: 10px 0 0; font-size: 12px;">
            Digital Revolution • Partnership Inquiry System
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `Digital Revolution <${process.env.RESEND_FROM}>`,
    to: emailToUse,
    subject: `New Partnership Inquiry from ${formData.firstName} ${formData.lastName} - ${formData.organization}`,
    html: emailHtml
  })

  if (error) {
    console.error('Failed to send partners ticket email:', error)
    throw error
  }

  return { success: true }

}

export default PartnersTicketEmail
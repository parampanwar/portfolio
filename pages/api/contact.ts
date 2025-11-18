import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Simple HTML-escape to keep emails safe and markup intact
  function escapeHtml(unsafe: string) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  try {
    // single transporter (iCloud custom domain uses STARTTLS on port 587)
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: false, // STARTTLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // OPTIONAL: uncomment to verify SMTP connection during debugging
    // await transporter.verify();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br/>");

    // ---------------------------
    // ADMIN EMAIL (you receive this)
    // ---------------------------
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        <tr>
          <td align="center" style="background:linear-gradient(90deg,#4f46e5,#06b6d4);padding:30px;">
            <h1 style="color:white;margin:0;font-size:22px;">📩 New Contact Form Submission</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:30px 40px;color:#333;font-size:15px;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>

            <p style="margin-bottom:6px;"><strong>Message:</strong></p>
            <div style="background:#f8f8fa;padding:15px;border-radius:8px;">
              ${safeMessageHtml}
            </div>

            <br/>
            <p style="font-size:13px;color:#555;">— Automatically received from your portfolio contact form.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ---------------------------
    // USER EMAIL (auto-reply to visitor)
    // ---------------------------
    const userHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:white; border-radius:16px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <tr>
            <td align="center" style="background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 40px 20px;">
              <img src="https://res.cloudinary.com/diu5lvqpf/image/upload/f_png/Portfolio_viazmk.svg" alt="Portfolio Logo" style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.2); padding: 4px; display: block; margin-bottom: 15px;">
              <h1 style="font-size: 24px; color: white; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Thank you for contacting</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 40px 30px 40px; color: #374151;">
              <p style="font-size: 16px; margin: 0 0 20px 0;">Hi <strong>${safeName}</strong>,</p>

              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #4b5563;">
                Thank you for reaching out. I have received your message and will get back to you shortly.
              </p>

              <p style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 10px; letter-spacing: 0.5px;">Your Message:</p>
              <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 4px 8px 8px 4px; font-size: 15px; line-height: 1.6; color: #1f2937;">
                ${safeMessageHtml}
              </div>

              <!-- <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
                <a href="https://parampanwar.com" style="background-color: #4f46e5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">
                  Return to Portfolio
                </a>
              </div> -->
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px 40px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #3b3d41; margin: 0 0 5px 0; font-weight: 500;">Regards,</p>  
              <p style="font-size: 14px; color: #000000; margin: 0 0 5px 0; font-weight: 600;">Param Panwar</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0; font-style: italic;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
        
        <table role="presentation">
            <tr><td height="40"></td></tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

    // send admin email
    await transporter.sendMail({
      from: `"Param Panwar" <contact@parampanwar.com>`,
      to: process.env.MAIL_TO,
      subject: `New Portfolio Message — ${safeSubject}`,
      html: adminHtml,
    });

    // send auto-reply to user
    await transporter.sendMail({
      from: `"Param Panwar" <contact@parampanwar.com>`,
      to: email,
      subject: "Thank you for contacting me!",
      html: userHtml,
    });

    return res.status(200).json({ success: true, message: "Emails sent" });
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}

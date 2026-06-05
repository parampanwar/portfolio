import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import path from "path";
import { social } from "@/data/portfolio";

type ApiResponse = { success: boolean; message: string };

function escapeHtml(unsafe: unknown): string {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const REQUIRED_FIELDS = ["name", "email", "subject", "message"] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const body = req.body ?? {};

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === "") {
      return res.status(400).json({ success: false, message: `${field} is required` });
    }
  }

  const { name, email, subject, message, recaptchaToken } = body as Record<string, string>;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address" });
  }

  // Google reCAPTCHA Verification (if secret key is defined)
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: "reCAPTCHA verification token is missing" });
    }

    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
      const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
      const recaptchaData = await recaptchaRes.json();

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Submission identified as potential spam.",
        });
      }
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return res.status(500).json({ success: false, message: "Spam verification failed. Please try again later." });
    }
  } else {
    console.warn("RECAPTCHA_SECRET_KEY is not defined in environment variables. Skipping spam check.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br/>");

  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Message From Portfolio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #050508;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f0f0fc;
      -webkit-font-smoothing: antialiased;
    }
    
    .btn-action:hover {
      background-color: #f8ff9c !important;
      box-shadow: 0 12px 40px rgba(232, 255, 71, 0.4) !important;
      transform: translateY(-2px) !important;
    }
    
    .social-link:hover {
      background: rgba(232, 255, 71, 0.15) !important;
      border-color: #e8ff47 !important;
      color: #e8ff47 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050508; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #0c0c12; border: 1px solid #1f1f2e; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #e8ff47 0%, #a3ff1a 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
              <a href="https://parampanwar.xyz" target="_blank" style="text-decoration: none;">
                <img src="cid:logo" alt="Param Panwar Logo" height="38" style="height: 38px; width: auto; max-height: 38px; display: block; border: 0; outline: none; margin: 0 auto;" />
              </a>
            </td>
          </tr>
          
          <!-- Message Body -->
          <tr>
            <td style="padding: 40px 40px 32px;">
              <span style="display: inline-block; padding: 4px 12px; background: rgba(232, 255, 71, 0.08); border: 1px solid rgba(232, 255, 71, 0.25); border-radius: 100px; color: #e8ff47; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px;">New Inbound Transmission</span>
              <h1 style="font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; line-height: 1.25; color: #f0f0fc; margin: 0 0 20px;">${safeSubject}</h1>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #12121a; border: 1px solid #1f1f2e; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td style="padding-bottom: 10px; font-size: 14px; color: #7e7e9a;">
                    <span style="color: #e8ff47; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block; width: 90px;">From:</span>
                    <strong style="color: #f0f0fc; font-weight: 600;">${safeName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #7e7e9a;">
                    <span style="color: #e8ff47; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block; width: 90px;">Email:</span>
                    <a href="mailto:${safeEmail}" style="color: #f0f0fc; text-decoration: underline; font-weight: 500;">${safeEmail}</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #7e7e9a;">Message Content</p>
              <div style="background-color: #12121a; border-left: 3px solid #e8ff47; border-radius: 0 12px 12px 0; padding: 24px; margin-bottom: 8px;">
                <p style="color: #e2e2f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap; margin: 0;">${safeMessageHtml}</p>
              </div>
            </td>
          </tr>
          
          <!-- CTA Action -->
          <tr>
            <td align="center" style="padding: 8px 40px 48px;">
              <a href="https://parampanwar.xyz/admin" class="btn-action" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #e8ff47; color: #050508; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 100px; letter-spacing: 0.05em; box-shadow: 0 8px 30px rgba(232, 255, 71, 0.25); text-align: center; transition: all 0.2s ease;">Review Submission ↗</a>
            </td>
          </tr>
          
          <!-- Footer Panel -->
          <tr>
            <td style="background-color: #12121a; border-top: 1px solid #1f1f2e; padding: 32px 40px; text-align: center;">
              <p style="font-size: 12px; color: #7e7e9a; line-height: 1.6; margin: 0 0 16px; font-family: 'DM Sans', sans-serif;">
                © ${new Date().getFullYear()} <a href="https://parampanwar.xyz" target="_blank" style="color: #f0f0fc; text-decoration: none; font-weight: 600;">parampanwar.xyz</a>. All rights reserved.
              </p>
              <div style="margin-top: 16px;">
                <a href="${social.github}" class="social-link" target="_blank" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e8ff47; text-decoration: none; margin: 0 8px; padding: 4px 12px; background: rgba(232, 255, 71, 0.05); border: 1px solid rgba(232, 255, 71, 0.15); border-radius: 6px; transition: all 0.2s ease;">GitHub</a>
                <a href="${social.linkedin}" class="social-link" target="_blank" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e8ff47; text-decoration: none; margin: 0 8px; padding: 4px 12px; background: rgba(232, 255, 71, 0.05); border: 1px solid rgba(232, 255, 71, 0.15); border-radius: 6px; transition: all 0.2s ease;">LinkedIn</a>
              </div>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; font-size: 11px; color: #55556d; text-align: center; letter-spacing: 0.02em; font-family: 'JetBrains Mono', monospace;">
          [ PORTFOLIO CONSOLE — AUTHENTICATED ACCESS ONLY ]
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const userHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Thanks for reaching out!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #050508;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f0f0fc;
      -webkit-font-smoothing: antialiased;
    }
    
    .btn-action:hover {
      background-color: #f8ff9c !important;
      box-shadow: 0 12px 40px rgba(232, 255, 71, 0.4) !important;
      transform: translateY(-2px) !important;
    }
    
    .social-link:hover {
      background: rgba(232, 255, 71, 0.15) !important;
      border-color: #e8ff47 !important;
      color: #e8ff47 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050508; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #0c0c12; border: 1px solid #1f1f2e; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #e8ff47 0%, #a3ff1a 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
              <a href="https://parampanwar.xyz" target="_blank" style="text-decoration: none;">
                <img src="cid:logo" alt="Param Panwar Logo" height="38" style="height: 38px; width: auto; max-height: 38px; display: block; border: 0; outline: none; margin: 0 auto;" />
              </a>
            </td>
          </tr>
          
          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <span style="display: inline-block; padding: 4px 12px; background: rgba(232, 255, 71, 0.08); border: 1px solid rgba(232, 255, 71, 0.25); border-radius: 100px; color: #e8ff47; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px;">Transmission Successful</span>
              <h1 style="font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; line-height: 1.25; color: #f0f0fc; margin: 0 0 16px;">Thanks for reaching out!</h1>
              <p style="font-size: 15px; line-height: 1.75; color: #a8a8c8; margin: 0 0 24px; font-family: 'DM Sans', sans-serif;">
                Hi <strong style="color: #f0f0fc;">${safeName}</strong>, thank you for contacting me. I've received your submission regarding <strong style="color: #e8ff47;">"${safeSubject}"</strong> and will personally review your message and reply within 24 hours.
              </p>
            </td>
          </tr>
          
          <!-- Message Body Summary -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #7e7e9a;">Summary of your message</p>
              <div style="background-color: #12121a; border-left: 3px solid #e8ff47; border-radius: 0 12px 12px 0; padding: 24px; margin-bottom: 8px;">
                <p style="color: #e2e2f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap; margin: 0;">${safeMessageHtml}</p>
              </div>
            </td>
          </tr>
          
          <!-- Call To Action Button -->
          <tr>
            <td align="center" style="padding: 8px 40px 48px;">
              <a href="https://parampanwar.xyz" class="btn-action" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #e8ff47; color: #050508; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 100px; letter-spacing: 0.05em; box-shadow: 0 8px 30px rgba(232, 255, 71, 0.25); text-align: center; transition: all 0.2s ease;">Visit Website ↗</a>
            </td>
          </tr>
          
          <!-- Footer Signature -->
          <tr>
            <td style="background-color: #12121a; border-top: 1px solid #1f1f2e; padding: 32px 40px; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: #a8a8c8; line-height: 1.6;">
                    Warm regards,<br>
                    <strong style="color: #f0f0fc; font-weight: 600;">Param Panwar</strong><br>
                    <span style="font-size: 12px; color: #7e7e9a;">Full-Stack Developer</span>
                  </td>
                  <td align="right" valign="bottom" style="white-space: nowrap;">
                    <a href="${social.github}" class="social-link" target="_blank" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e8ff47; text-decoration: none; margin-left: 8px; padding: 4px 12px; background: rgba(232, 255, 71, 0.05); border: 1px solid rgba(232, 255, 71, 0.15); border-radius: 6px; transition: all 0.2s ease;">GitHub</a>
                    <a href="${social.linkedin}" class="social-link" target="_blank" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e8ff47; text-decoration: none; margin-left: 8px; padding: 4px 12px; background: rgba(232, 255, 71, 0.05); border: 1px solid rgba(232, 255, 71, 0.15); border-radius: 6px; transition: all 0.2s ease;">LinkedIn</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 24px; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #55556d; text-align: center; border-top: 1px solid #1f1f2e;">
                    This is an automated transmission summary. Please do not reply directly to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; font-size: 11px; color: #7e7e9a; text-align: center; letter-spacing: 0.02em; font-family: 'DM Sans', sans-serif;">
          © ${new Date().getFullYear()} parampanwar.xyz. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const logoAttachment = {
      filename: "logo.png",
      path: path.join(process.cwd(), "public", "logo.png"),
      cid: "logo",
    };

    await Promise.all([
      transporter.sendMail({
        from: `"Param Panwar" <contact@parampanwar.xyz>`,
        to: process.env.MAIL_TO,
        subject: `Portfolio contact — ${safeSubject}`,
        html: adminHtml,
        attachments: [logoAttachment],
      }),
      transporter.sendMail({
        from: `"Param Panwar" <contact@parampanwar.xyz>`,
        to: email,
        subject: "Thanks for reaching out!",
        html: userHtml,
        attachments: [logoAttachment],
      }),
    ]);

    return res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}

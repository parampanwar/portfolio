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
  <title>New Message: ${safeSubject}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #0E0E0C !important; }
      .card-bg { background-color: #171714 !important; border-color: #2A2926 !important; }
      .text-primary { color: #F2EFE8 !important; }
      .text-muted { color: #8F8B82 !important; }
      .text-subtle { color: #726E65 !important; }
      .panel-bg { background-color: #1F1E1B !important; border-color: #2A2926 !important; }
      .border-line { border-color: #2A2926 !important; }
      .btn-primary { background-color: #F2EFE8 !important; color: #121212 !important; }
    }
    .btn-primary:hover {
      background-color: #FF4D1F !important;
      color: #FFFFFF !important;
    }
  </style>
</head>
<body class="body-bg" style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #121212;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="body-bg" style="background-color: #F4F1EA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-bg" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #D9D4C7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          <!-- Top Accent Line -->
          <tr>
            <td height="4" style="background: #FF4D1F; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 32px 36px 20px; border-bottom: 1px solid #EBE7DD;" class="border-line">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal; letter-spacing: -0.02em; color: #121212;" class="text-primary">
                      Param Panwar
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">
                      Portfolio Inbox
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <!-- Status Pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 4px 12px; background: rgba(255, 77, 31, 0.08); border: 1px solid rgba(255, 77, 31, 0.25); border-radius: 99px;">
                    <span style="display: inline-block; width: 6px; height: 6px; background-color: #FF4D1F; border-radius: 50%; vertical-align: middle; margin-right: 6px;"></span>
                    <span style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #FF4D1F; font-weight: 600; vertical-align: middle;">New Inbound Message</span>
                  </td>
                </tr>
              </table>

              <!-- Subject Headline -->
              <h1 style="margin: 0 0 24px; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: normal; line-height: 1.25; letter-spacing: -0.025em; color: #121212;" class="text-primary">
                ${safeSubject}
              </h1>

              <!-- Sender Details Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="panel-bg border-line" style="background-color: #FAF8F5; border: 1px solid #EBE7DD; border-radius: 8px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="70" valign="top" style="padding-bottom: 10px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">From:</td>
                        <td valign="top" style="padding-bottom: 10px; font-size: 14px; font-weight: 600; color: #121212;" class="text-primary">${safeName}</td>
                      </tr>
                      <tr>
                        <td width="70" valign="top" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">Email:</td>
                        <td valign="top" style="font-size: 14px; color: #121212;" class="text-primary">
                          <a href="mailto:${safeEmail}" style="color: #FF4D1F; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <p style="margin: 0 0 10px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">
                Message Content
              </p>
              <div class="panel-bg" style="background-color: #FAF8F5; border-left: 3px solid #FF4D1F; border-top: 1px solid #EBE7DD; border-right: 1px solid #EBE7DD; border-bottom: 1px solid #EBE7DD; border-radius: 0 8px 8px 0; padding: 22px 24px; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #121212; white-space: pre-wrap;" class="text-primary">${safeMessageHtml}</p>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                <tr>
                  <td align="left">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(safeSubject)}" class="btn-primary" target="_blank" style="display: inline-block; padding: 13px 28px; background-color: #121212; color: #FFFFFF; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; text-decoration: none; border-radius: 99px;">
                      Direct Reply &rarr;
                    </a>
                  </td>
                  <td style="padding-left: 16px;">
                    <a href="https://parampanwar.xyz/admin" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F; text-decoration: none;" class="text-muted">
                      Admin Console &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Panel -->
          <tr>
            <td style="background-color: #FAF8F5; border-top: 1px solid #EBE7DD; padding: 28px 36px;" class="panel-bg border-line">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family: Georgia, 'Times New Roman', serif; font-size: 13px; color: #6B675F;" class="text-muted">
                    Param Panwar — Software engineer
                  </td>
                  <td align="right">
                    <a href="${social.github}" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #121212; text-decoration: none; margin-left: 12px;" class="text-primary">GitHub &rarr;</a>
                    <a href="${social.linkedin}" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #121212; text-decoration: none; margin-left: 12px;" class="text-primary">LinkedIn &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <p style="margin: 20px 0 0; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; color: #8F8B82; text-align: center; letter-spacing: 0.08em;" class="text-subtle">
          PARAM PANWAR PORTFOLIO • JAIPUR, IN
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
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #0E0E0C !important; }
      .card-bg { background-color: #171714 !important; border-color: #2A2926 !important; }
      .text-primary { color: #F2EFE8 !important; }
      .text-muted { color: #8F8B82 !important; }
      .text-subtle { color: #726E65 !important; }
      .panel-bg { background-color: #1F1E1B !important; border-color: #2A2926 !important; }
      .border-line { border-color: #2A2926 !important; }
      .btn-primary { background-color: #F2EFE8 !important; color: #121212 !important; }
    }
    .btn-primary:hover {
      background-color: #FF4D1F !important;
      color: #FFFFFF !important;
    }
  </style>
</head>
<body class="body-bg" style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #121212;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="body-bg" style="background-color: #F4F1EA; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-bg" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #D9D4C7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          <!-- Top Accent Line -->
          <tr>
            <td height="4" style="background: #FF4D1F; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 32px 36px 20px; border-bottom: 1px solid #EBE7DD;" class="border-line">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal; letter-spacing: -0.02em; color: #121212;" class="text-primary">
                      Param Panwar
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">
                      Jaipur, IN
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <!-- Status Pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 4px 12px; background: rgba(255, 77, 31, 0.08); border: 1px solid rgba(255, 77, 31, 0.25); border-radius: 99px;">
                    <span style="display: inline-block; width: 6px; height: 6px; background-color: #FF4D1F; border-radius: 50%; vertical-align: middle; margin-right: 6px;"></span>
                    <span style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #FF4D1F; font-weight: 600; vertical-align: middle;">Message Received</span>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <h1 style="margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; line-height: 1.25; letter-spacing: -0.03em; color: #121212;" class="text-primary">
                Thanks for reaching out.
              </h1>

              <!-- Greeting & Note -->
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #3A3834;" class="text-primary">
                Hi <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.7; color: #3A3834;" class="text-primary">
                Thank you for your note regarding <strong style="color: #FF4D1F;">&ldquo;${safeSubject}&rdquo;</strong>. I've received your inquiry and will personally review it and get back to you within 24 hours.
              </p>

              <!-- Copy of their message -->
              <p style="margin: 0 0 10px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F;" class="text-muted">
                Summary of your message
              </p>
              <div class="panel-bg" style="background-color: #FAF8F5; border-left: 3px solid #FF4D1F; border-top: 1px solid #EBE7DD; border-right: 1px solid #EBE7DD; border-bottom: 1px solid #EBE7DD; border-radius: 0 8px 8px 0; padding: 22px 24px; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #121212; white-space: pre-wrap;" class="text-primary">${safeMessageHtml}</p>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                <tr>
                  <td>
                    <a href="https://parampanwar.xyz" class="btn-primary" target="_blank" style="display: inline-block; padding: 13px 28px; background-color: #121212; color: #FFFFFF; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; text-decoration: none; border-radius: 99px;">
                      Visit Portfolio &rarr;
                    </a>
                  </td>
                  <td style="padding-left: 16px;">
                    <a href="https://parampanwar.xyz/resume" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B675F; text-decoration: none;" class="text-muted">
                      View Résumé &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="background-color: #FAF8F5; border-top: 1px solid #EBE7DD; padding: 28px 36px;" class="panel-bg border-line">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.6; color: #121212;" class="text-primary">
                    Warm regards,<br>
                    <strong style="font-size: 16px;">Param Panwar</strong><br>
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #6B675F;" class="text-muted">Software engineer engineering intelligent products with purpose</span>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="${social.github}" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #121212; text-decoration: none; margin-left: 12px;" class="text-primary">GitHub &rarr;</a>
                    <a href="${social.linkedin}" target="_blank" style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #121212; text-decoration: none; margin-left: 12px;" class="text-primary">LinkedIn &rarr;</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 20px; border-top: 1px solid #EBE7DD; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #8F8B82; text-align: center;" class="text-subtle border-line">
                    This is an automated confirmation sent from parampanwar.xyz.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <p style="margin: 20px 0 0; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; color: #8F8B82; text-align: center; letter-spacing: 0.08em;" class="text-subtle">
          © ${new Date().getFullYear()} PARAM PANWAR • JAIPUR, IN
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

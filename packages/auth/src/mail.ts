import { Resend } from "resend";
import { env } from "@Poneglyph/env/server";

const resend = new Resend(env.RESEND_API_KEY);

function buildVerificationEmail({
  userName,
  verifyUrl,
}: {
  userName: string;
  verifyUrl: string;
}): string {
  const safeUrl = escapeHtml(verifyUrl);
  const safeName = escapeHtml(userName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email — Poneglyph</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6fa;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6fa;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;width:100%;background:#ffffff;border:1px solid #e8ecf4;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;border-bottom:1px solid #e8ecf4;">

              <!-- Logo - TODO: Have to add real one here -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="width:28px;height:28px;background:#0a0a0a;border-radius:6px;text-align:center;vertical-align:middle;">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white"/>
                      <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white"/>
                      <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white"/>
                      <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white"/>
                    </svg>
                  </td>
                  <td style="padding-left:10px;font-size:15px;font-weight:600;color:#0a0a0a;letter-spacing:-0.2px;">Poneglyph</td>
                </tr>
              </table>

              <!-- Greeting -->
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0a0a0a;letter-spacing:-0.5px;line-height:1.25;">
                Welcome, ${safeName} — one step left.
              </h1>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
                You're joining a platform built for NGO workers, researchers, and journalists making decisions that matter. Verify your email to access Poneglyph’s open dataset repository.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px;">

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                <tr>
                  <td align="center">
                    <a href="${safeUrl}" style="display:inline-block;padding:13px 32px;background:#0a0a0a;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:-0.2px;">
                      Verify my email address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;text-align:center;font-size:12px;color:#9ca3af;">
                This link expires in 24 hours. After that, sign in again to request a new one.
              </p>

              <div style="height:1px;background:#e8ecf4;"></div>
            </td>
          </tr>

          <!-- Fallback URL -->
          <tr>
            <td style="padding:20px 40px;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">If the button doesn't work, paste this into your browser:</p>
              <p style="margin:0;font-size:11px;color:#4b5563;font-family:ui-monospace,monospace;word-break:break-all;background:#f9fafb;padding:10px 12px;border-radius:8px;line-height:1.6;">
                ${safeUrl}
              </p>
            </td>
          </tr>

          <tr><td style="height:1px;background:#e8ecf4;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 40px 32px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                If you didn't create an account, you can safely ignore this email.<br/>
                No account will be activated without verification.<br/><br/>
                <a href="https://poneglyph.vyse.site" style="color:#6b7280;text-decoration:underline;">poneglyph.vyse.site</a> · Open datasets for open minds
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendVerificationEmail({
  email,
  name,
  url,
}: {
  email: string;
  name: string;
  url: string;
}): Promise<void> {
  const html = buildVerificationEmail({ userName: name, verifyUrl: url });

  const { error } = await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to: [email],
    subject: "Verify your email — Poneglyph",
    html,
    text: `Hi ${name},\n\nWelcome to Poneglyph. Verify your email to unlock the full platform:\n${url}\n\nThis link expires in 24 hours.`,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

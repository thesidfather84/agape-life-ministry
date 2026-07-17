/**
 * Pastor notification emails, sent with Resend.
 *
 * SERVER-SIDE ONLY — this module reads RESEND_API_KEY and must never be
 * imported from a client component. It is only used inside server
 * actions. Email failures are logged and swallowed so a delivery
 * problem never blocks a form submission that already saved.
 */
import { Resend } from "resend";
import { SITE_URL, CHURCH } from "./site";

const PASTOR_EMAIL =
  process.env.PASTOR_NOTIFICATION_EMAIL ?? "arthurwarning49@gmail.com";

// Until agapelifeministry.org is verified inside Resend, fall back to
// Resend's approved testing sender so development emails still deliver.
const FROM_ADDRESS =
  process.env.EMAIL_FROM_ADDRESS ?? "onboarding@resend.dev";

function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Submission time in the church's time zone. */
function submittedAt(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

export interface EmailField {
  label: string;
  value: string;
}

interface NotificationInput {
  subject: string;
  heading: string;
  intro?: string;
  fields: EmailField[];
  buttonLabel?: string;
  /** Site-relative path for the dashboard button, e.g. "/admin/messages". */
  buttonPath?: string;
  /** Set when the pastor should be able to reply directly from Gmail. */
  replyTo?: string;
}

function buildHtml(input: NotificationInput): string {
  const buttonUrl = input.buttonPath ? `${SITE_URL}${input.buttonPath}` : null;
  const rows = input.fields
    .map(
      (f) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3ecdc;vertical-align:top;width:160px;">
            <strong style="color:#533a8b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(f.label)}</strong>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f3ecdc;color:#0d1633;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(f.value)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#faf6ec;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf6ec;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#0d1633;padding:28px 32px;text-align:center;">
                <p style="margin:0;color:#fdfbf6;font-size:20px;font-weight:bold;letter-spacing:0.08em;">AGAPE LIFE MINISTRY</p>
                <p style="margin:6px 0 0;color:#d4af37;font-size:13px;">Sharing God's unconditional love</p>
              </td>
            </tr>
            <tr><td style="background-color:#d4af37;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 8px;color:#0d1633;font-size:20px;">${escapeHtml(input.heading)}</h1>
                ${input.intro ? `<p style="margin:0 0 16px;color:#1d2c63;font-size:15px;line-height:1.6;">${escapeHtml(input.intro)}</p>` : ""}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
                ${
                  buttonUrl
                    ? `<p style="margin:28px 0 0;text-align:center;">
                        <a href="${buttonUrl}" style="display:inline-block;background-color:#d4af37;color:#0d1633;font-weight:bold;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:999px;">${escapeHtml(input.buttonLabel ?? "Open Pastor Dashboard")}</a>
                      </p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="background-color:#faf6ec;padding:20px 32px;text-align:center;">
                <p style="margin:0;color:#533a8b;font-size:12px;line-height:1.6;">This message was sent automatically from the ${escapeHtml(CHURCH.name)} website at agapelifeministry.org.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText(input: NotificationInput): string {
  const buttonUrl = input.buttonPath ? `${SITE_URL}${input.buttonPath}` : null;
  const lines = [
    "AGAPE LIFE MINISTRY",
    "",
    input.heading,
    ...(input.intro ? ["", input.intro] : []),
    "",
    ...input.fields.map((f) => `${f.label}: ${f.value}`),
    ...(buttonUrl
      ? ["", `${input.buttonLabel ?? "Open Pastor Dashboard"}: ${buttonUrl}`]
      : []),
    "",
    "This message was sent automatically from the Agape Life Ministry website at agapelifeministry.org.",
  ];
  return lines.join("\n");
}

/**
 * Send a notification to the pastor. Never throws: a failure is logged
 * (without message content or secrets) and the caller continues.
 */
export async function sendPastorNotification(
  input: NotificationInput
): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      "[email] RESEND_API_KEY is not set — pastor notification skipped."
    );
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `${CHURCH.name} <${FROM_ADDRESS}>`,
      to: PASTOR_EMAIL,
      subject: input.subject,
      html: buildHtml(input),
      text: buildText(input),
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    if (error) {
      // Log the provider error name only — never form content or keys.
      console.error(`[email] Delivery failed: ${error.name ?? "unknown"}`);
    }
  } catch (err) {
    console.error(
      `[email] Delivery failed: ${err instanceof Error ? err.name : "unknown"}`
    );
  }
}

export { submittedAt };

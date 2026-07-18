export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export function emailShell(opts: { badge: string; heading: string; rows: string; footerNote: string }) {
  const { badge, heading, rows, footerNote } = opts;
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#050508;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050508;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#0b0b12;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

            <!-- Top accent bar -->
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,#00d4ff,#4f6ef7,#8b5cf6);font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Logo -->
            <tr>
              <td style="padding:36px 40px 0 40px;text-align:center;">
                <img src="https://uxcodestudio.com/logo.png" alt="UXCODESTUDIO" width="150" style="display:inline-block;" />
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="padding:28px 40px 4px 40px;text-align:center;">
                <div style="display:inline-block;background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.3);border-radius:999px;padding:5px 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;color:#22d3ee;text-transform:uppercase;">
                  ${badge}
                </div>
                <h1 style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#ffffff;">
                  ${heading}
                </h1>
              </td>
            </tr>

            <!-- Summary card -->
            <tr>
              <td style="padding:24px 40px 8px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 40px 36px 40px;text-align:center;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#4b4f5a;">
                  ${footerNote}
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

export function row(label: string, value: string, accent = false) {
  return `
    <tr>
      <td style="padding:11px 0;border-top:1px solid rgba(255,255,255,0.08);color:#8a8f9c;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${label}</td>
      <td style="padding:11px 0;border-top:1px solid rgba(255,255,255,0.08);color:${accent ? "#22d3ee" : "#ffffff"};font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;text-align:right;">${value}</td>
    </tr>`;
}

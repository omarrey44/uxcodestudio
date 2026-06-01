import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Strip CR/LF to prevent SMTP header injection in subject/replyTo fields */
const hdr = (s: string) => s.replace(/[\r\n]/g, " ").trim();

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const name    = typeof body.name    === "string" ? body.name.slice(0, 200)    : "";
    const email   = typeof body.email   === "string" ? body.email.slice(0, 254)   : "";
    const message = typeof body.message === "string" ? body.message.slice(0, 5000): "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const safeName    = esc(name);
    const safeEmail   = esc(email);
    const safeMessage = esc(message);

    await resend.emails.send({
      from: "UX Code Studio <onboarding@resend.dev>",
      to: "uxcodestudio@outlook.com",
      replyTo: hdr(email),
      subject: `New inquiry from ${hdr(name)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#111;margin-bottom:4px">New project inquiry</h2>
          <p style="color:#666;font-size:14px;margin-top:0">Via uxcodestudio.com contact form</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#888;font-size:13px;width:80px">Name</td><td style="padding:6px 0;font-size:14px;color:#111">${safeName}</td></tr>
            <tr><td style="padding:6px 0;color:#888;font-size:13px">Email</td><td style="padding:6px 0;font-size:14px;color:#111"><a href="mailto:${safeEmail}" style="color:#0891b2">${safeEmail}</a></td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#888;font-size:13px;margin-bottom:8px">Message</p>
          <p style="color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap">${safeMessage}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#bbb;font-size:12px">Reply directly to this email to respond to ${safeName}.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

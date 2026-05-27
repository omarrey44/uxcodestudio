import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, service, date, time, message } = await req.json();

  if (!name || !email || !service || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("bookings")
    .insert([{ name, email, service, date, time, message: message || null }]);

  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error));
    return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 500 });
  }

  // Send alert email to company — non-blocking
  resend.emails.send({
    from: "UX Code Studio <onboarding@resend.dev>",
    to: "uxcodestudio@outlook.com",
    subject: `📅 Nueva reserva — ${service}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0c1228;color:#fff;border-radius:12px;">
        <h2 style="color:#00d4ff;margin-top:0">Nueva reserva agendada</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#aaa;width:120px">Servicio</td><td style="padding:8px 0;font-weight:600">${service}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Fecha</td><td style="padding:8px 0;font-weight:600">${date}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Hora</td><td style="padding:8px 0;font-weight:600">${time}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Empresa/Nombre</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00d4ff">${email}</a></td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#aaa;vertical-align:top">Mensaje</td><td style="padding:8px 0">${message}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#555">Enviado automáticamente desde uxcodestudio.com</p>
      </div>
    `,
  }).catch(err => console.error("Resend error:", err));

  return NextResponse.json({ success: true });
}

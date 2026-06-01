import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAnon } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Strip CR/LF to prevent SMTP header injection in subject/header fields */
const hdr = (s: string) => s.replace(/[\r\n]/g, " ").trim();

const KNOWN_SERVICES = [
  "Business Websites", "Landing Page", "Online Store", "Hosting & Management",
  "Booking & Contact", "Website Updates", "Mobile Apps", "Other",
  // ES equivalents
  "Sitios Web de Negocio", "Tienda en Línea", "Hosting y Gestión",
  "Reservas y Contacto", "Actualizaciones Web", "Apps Móviles",
];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name    = typeof body.name    === "string" ? body.name.slice(0, 200)    : "";
  const email   = typeof body.email   === "string" ? body.email.slice(0, 254)   : "";
  const service = typeof body.service === "string" ? body.service.slice(0, 100) : "";
  const date    = typeof body.date    === "string" ? body.date.slice(0, 20)     : "";
  const time    = typeof body.time    === "string" ? body.time.slice(0, 20)     : "";
  const message = typeof body.message === "string" ? body.message.slice(0, 2000): "";

  if (!name || !email || !service || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!KNOWN_SERVICES.includes(service)) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  // Basic date format guard (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const supabase = createSupabaseAnon();

  const { error } = await supabase
    .from("bookings")
    .insert([{ name, email, service, date, time, message: message || null }]);

  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error));
    return NextResponse.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }

  const safeName    = esc(name);
  const safeEmail   = esc(email);
  const safeService = esc(service);
  const safeDate    = esc(date);
  const safeTime    = esc(time);
  const safeMessage = message ? esc(message) : null;

  resend.emails.send({
    from: "UX Code Studio <onboarding@resend.dev>",
    to: "uxcodestudio@outlook.com",
    subject: `Nueva reserva — ${hdr(service)}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0c1228;color:#fff;border-radius:12px;">
        <h2 style="color:#00d4ff;margin-top:0">Nueva reserva agendada</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#aaa;width:120px">Servicio</td><td style="padding:8px 0;font-weight:600">${safeService}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Fecha</td><td style="padding:8px 0;font-weight:600">${safeDate}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Hora</td><td style="padding:8px 0;font-weight:600">${safeTime}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Empresa/Nombre</td><td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
          <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#00d4ff">${safeEmail}</a></td></tr>
          ${safeMessage ? `<tr><td style="padding:8px 0;color:#aaa;vertical-align:top">Mensaje</td><td style="padding:8px 0">${safeMessage}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#555">Enviado automáticamente desde uxcodestudio.com</p>
      </div>
    `,
  }).catch(err => console.error("Resend error:", err));

  return NextResponse.json({ success: true });
}

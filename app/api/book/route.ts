import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";

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

  return NextResponse.json({ success: true });
}

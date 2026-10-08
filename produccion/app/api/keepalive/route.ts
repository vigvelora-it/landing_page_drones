import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Cron llama a esta ruta una vez al día (ver vercel.json) para que el plan gratuito
// de Supabase no pause el proyecto tras 7 días sin actividad. Vercel envía CRON_SECRET
// como "Authorization: Bearer ..." automáticamente.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("contact_requests").select("id").limit(1);

    if (error) {
      console.error("Keep-alive de Supabase falló:", error.code, error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Keep-alive sin configuración de Supabase:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

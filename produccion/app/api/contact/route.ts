import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "La solicitud no contiene datos válidos." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Revisa los datos ingresados." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("contact_requests").insert({
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email.toLowerCase(),
      service: parsed.data.service || null,
      message: parsed.data.message,
      source: "website",
    });

    if (error) {
      console.error("No se pudo registrar la solicitud:", error.code, error.message);
      return NextResponse.json(
        { message: "No pudimos enviar tu solicitud. Escríbenos a skytsperu@gmail.com." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Solicitud recibida correctamente." }, { status: 201 });
  } catch (error) {
    console.error("Error de configuración del formulario:", error);
    return NextResponse.json(
      { message: "El formulario aún no está disponible. Escríbenos a skytsperu@gmail.com." },
      { status: 503 },
    );
  }
}

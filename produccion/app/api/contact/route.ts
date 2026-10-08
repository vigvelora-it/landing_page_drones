import { NextResponse } from "next/server";
import { sendContactConfirmation, sendContactNotification } from "@/lib/contact-email";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

async function saveToDatabase(data: ContactInput) {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("contact_requests").insert({
      name: data.name,
      company: data.company || null,
      email: data.email.toLowerCase(),
      service: data.service || null,
      message: data.message,
      source: "website",
    });

    if (error) {
      console.error("No se pudo registrar la solicitud:", error.code, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error de configuración de la base de datos:", error);
    return false;
  }
}

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

  // La base de datos es la fuente principal; el correo se envía siempre y sirve de respaldo
  // si Supabase está pausado o caído, para que ninguna solicitud se pierda.
  const saved = await saveToDatabase(parsed.data);

  let notified = false;
  try {
    await sendContactNotification(parsed.data, saved);
    notified = true;
  } catch (error) {
    console.error("No se pudo enviar el correo de notificación:", error);
  }

  if (!saved && !notified) {
    return NextResponse.json(
      { message: "No pudimos enviar tu solicitud. Escríbenos a skytsperu@gmail.com." },
      { status: 503 },
    );
  }

  try {
    await sendContactConfirmation(parsed.data);
  } catch (error) {
    console.error("No se pudo enviar el correo de confirmación al cliente:", error);
  }

  return NextResponse.json({ message: "Solicitud recibida correctamente." }, { status: 201 });
}

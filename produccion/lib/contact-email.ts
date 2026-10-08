import "server-only";

import type { ContactInput } from "@/lib/contact-schema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type EmailMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL?.split(",").map((email) => email.trim()).filter(Boolean) ?? [];

  if (!apiKey || !from || to.length === 0) {
    throw new Error("El envío de correos no está configurado en el servidor.");
  }

  return { apiKey, from, to };
}

async function sendEmail(apiKey: string, from: string, message: EmailMessage) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend respondió ${response.status}: ${detail.slice(0, 300)}`);
  }
}

function buildNotification(data: ContactInput, savedToDatabase: boolean) {
  const rows: [string, string][] = [
    ["Nombre", data.name],
    ["Empresa", data.company || "—"],
    ["Correo", data.email],
    ["Servicio", data.service || "—"],
  ];

  const warning = savedToDatabase
    ? ""
    : "⚠ Esta solicitud NO se pudo guardar en la base de datos. Este correo es la única copia.";

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2933;max-width:600px">
      <h2 style="margin:0 0 16px">Nueva solicitud desde la web</h2>
      ${warning ? `<p style="padding:10px 12px;background:#fff4e5;border-left:4px solid #e8590c">${warning}</p>` : ""}
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#52606d;width:110px">${label}</td><td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#52606d">Proyecto</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#7b8794">Responde a este correo para contestar directamente al cliente.</p>
    </div>`;

  const text = [
    "Nueva solicitud desde la web",
    warning,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Proyecto:",
    data.message,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject: `Nueva solicitud web: ${data.name}${data.company ? ` (${data.company})` : ""}`, html, text };
}

function buildConfirmation(data: ContactInput) {
  const name = escapeHtml(data.name);
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2933;max-width:600px">
      <p>Hola ${name},</p>
      <p>Gracias por escribirnos. Recibimos tu solicitud y un especialista de Skytech se pondrá en contacto contigo a la brevedad.</p>
      <p style="margin:20px 0 6px;color:#52606d">Tu mensaje:</p>
      <p style="margin:0;padding:10px 12px;background:#f5f7fa;white-space:pre-wrap">${escapeHtml(data.message)}</p>
      <p style="margin-top:24px">Saludos,<br />Equipo Skytech Solutions</p>
    </div>`;

  const text = `Hola ${data.name},\n\nGracias por escribirnos. Recibimos tu solicitud y un especialista de Skytech se pondrá en contacto contigo a la brevedad.\n\nTu mensaje:\n${data.message}\n\nSaludos,\nEquipo Skytech Solutions`;

  return { subject: "Recibimos tu solicitud — Skytech Solutions", html, text };
}

export async function sendContactNotification(data: ContactInput, savedToDatabase: boolean) {
  const { apiKey, from, to } = getEmailConfig();
  await sendEmail(apiKey, from, { ...buildNotification(data, savedToDatabase), to, replyTo: data.email });
}

export async function sendContactConfirmation(data: ContactInput) {
  if (process.env.CONTACT_SEND_CONFIRMATION !== "true") return;

  const { apiKey, from, to } = getEmailConfig();
  await sendEmail(apiKey, from, { ...buildConfirmation(data), to: [data.email], replyTo: to[0] });
}

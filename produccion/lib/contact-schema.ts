import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(100),
  company: z.string().trim().max(150).optional().default(""),
  email: z.email("Ingresa un correo electrónico válido.").max(254),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Cuéntanos un poco más sobre tu proyecto.").max(3000),
  website: z.string().max(0, "Solicitud no válida.").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

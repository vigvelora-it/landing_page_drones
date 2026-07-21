# Contact regression — BRAND-02

Todas las pruebas fueron same-origin contra `127.0.0.1`; no hubo escritura, email, WhatsApp ni host externo.

## Configuración segura

- Archivos `.env*` reales: `false`
- `NEXT_PUBLIC_SUPABASE_URL` presente: `false`
- `SUPABASE_SERVICE_ROLE_KEY` presente: `false`

Solo se registran booleanos. No se imprimió ni conservó ningún valor.

## API directa local

| Caso | Resultado |
|---|---|
| JSON malformado | 400 — `La solicitud no contiene datos válidos.` |
| Schema inválido (`name` de un carácter) | 400 — `Ingresa tu nombre.` |
| Honeypot `website` no vacío | 400 — `Solicitud no válida.` |
| Payload sintético válido sin credenciales | 503 — `El formulario aún no está disponible. Escríbenos a skytsperu@gmail.com.` |

El 503 se ejecutó únicamente tras confirmar ambas credenciales ausentes; `createSupabaseAdmin` falla antes de construir un cliente o alcanzar Supabase.

## Browser mocks antes de red

Datos sintéticos exclusivos: `Persona QA`, `qa@example.invalid` y mensaje QA.

- 201 con demora 500 ms: pending `Enviando solicitud…`, submit disabled; dos activaciones inmediatas produjeron exactamente `1 request`; después submit enabled, campos reseteados y success `Solicitud recibida. Nos pondremos en contacto contigo.`
- 400 mock: `1 request`, submit reactivado, nombre/email preservados y error español mockeado en `#form-status`.
- 500 mock: `1 request`, submit reactivado, nombre/email preservados y error español mockeado en `#form-status`.
- Cada `page.route('**/api/contact')` se retiró al terminar. No external request salió del navegador.

## Wiring estructural

`ContactForm` → `fetch("/api/contact", POST JSON)` → `contactSchema.safeParse` → `createSupabaseAdmin` → `supabase.from("contact_requests").insert`.

- Seis opciones del select (placeholder + cinco servicios) derivadas de `services.map`.
- Honeypot `website`: `tabIndex=-1`, `aria-hidden=true`.
- `#form-status`: `aria-live="polite"`.
- No se probó 201 real y no se creó fila persistente.

**BRAND-02: PASS sin escritura externa.**

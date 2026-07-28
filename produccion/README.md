# Sky Tech Perú

> **PRODUCCIÓN V2:** esta carpeta representa el sitio aprobado y publicado en
> https://pagina-web-mayra.vercel.app. Los cambios experimentales se trabajan
> primero en `../local-2/`.

Sitio web corporativo construido con Next.js, TypeScript y Supabase. La versión
V2 incorpora la experiencia editorial aprobada, fotografías reales de Skytech,
galerías de proyectos y contacto por WhatsApp.

## Desarrollo local

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env.local` y agrega las credenciales de Supabase.
3. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
4. Inicia el proyecto con `npm run dev`.
5. Abre `http://localhost:3000`.

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`: URL pública del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada usada solo por el servidor. Nunca debe exponerse en el navegador.
- `NEXT_PUBLIC_SITE_URL`: dominio final, sin `/` al final.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número de WhatsApp en formato internacional,
  solo dígitos (por ejemplo, `519XXXXXXXX`).

Estas mismas variables deben registrarse en Vercel para Production, Preview y
Development. El formulario guarda cada solicitud en `contact_requests` mediante
`POST /api/contact`.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run lint`: revisión de calidad.
- `npm run typecheck`: verificación de TypeScript.
- `npm run build`: compilación de producción para Vercel.

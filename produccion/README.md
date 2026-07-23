# Sky Tech Perú

> **PRODUCCIÓN:** esta carpeta representa el sitio publicado en
> https://pagina-web-mayra.vercel.app. No aplicar aquí cambios experimentales.

Sitio web corporativo construido con Next.js, TypeScript y Supabase a partir del
diseño aprobado `landing-page-v4.html`. El HTML original se conserva como fuente
visual y respaldo; la aplicación real vive en `app/`.

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

Estas mismas variables deben registrarse en Vercel para Production, Preview y
Development. El formulario guarda cada solicitud en `contact_requests` mediante
`POST /api/contact`.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run lint`: revisión de calidad.
- `npm run typecheck`: verificación de TypeScript.
- `npm run build`: compilación de producción para Vercel.

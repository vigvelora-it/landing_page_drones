# Sky Tech Perú — versión local

Esta carpeta es el entorno exclusivo de desarrollo. Sus cambios no deben
desplegarse en Vercel ni mezclarse automáticamente con `../produccion`.

La interfaz usa la paleta corporativa extraída del brochure de Sky Tech. Un
distintivo `LOCAL` permanece visible en la esquina inferior derecha para evitar
confundirla con producción.

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

El formulario solo se conectará a Supabase localmente si se crea un `.env.local`.
No se incluyen credenciales de producción en esta carpeta.

## Comandos

- `npm run dev`: servidor de desarrollo en `http://localhost:4173`.
- `npm run lint`: revisión de calidad.
- `npm run typecheck`: verificación de TypeScript.
- `npm run build`: compilación de producción para Vercel.
- `npm run deploy`: bloquea intencionalmente cualquier intento de despliegue.

El archivo `vercel.json` también impide que un despliegue accidental desde esta
carpeta llegue a completarse.

# Sky Tech Perú — laboratorio visual local-2

Segundo ambiente local de pruebas para la nueva experiencia web de Sky Tech Perú. Esta variante usa una dirección oscura, editorial y cinematográfica con animaciones de scroll, menú superpuesto y composiciones de gran escala.

## Aislamiento

- Esta carpeta es independiente de `../local/` y `../produccion/`.
- No debe desplegarse ni copiarse a producción sin aprobación explícita.
- `npm run deploy` y `vercel.json` bloquean deliberadamente el despliegue.
- Los recursos visuales son locales; la interfaz no depende de imágenes remotas.

## Iniciar el ambiente

```powershell
Set-Location F:\ClaudeCode\Pagina_Web_Mayra\local-2
npm.cmd run dev
```

Abrir `http://localhost:4173`. Si ese puerto está ocupado por el primer ambiente local:

```powershell
npx.cmd next dev -p 4174
```

## Validación

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Estructura activa

- `app/page.tsx`: contenido y estructura de la experiencia.
- `app/globals.css`: sistema visual, animaciones y responsive.
- `components/experience.tsx`: intro, menú, revelados, parallax, cursor y formulario.
- `app/api/contact/route.ts`: endpoint del formulario conectado a Supabase cuando existen variables locales.
- `public/IMAGENES_PAGINA_WEB/`: recursos visuales locales.
- `public/video/drone-flight-close.mp4`: video local del dron usado en el hero.
- `public/video/CREDITS.md`: fuente y licencia documentadas del video.
- `CONTINUIDAD.md`: plan, decisiones, pruebas, bitácora y próximos pasos.

`landing-page-v4.html`, `lib/v4-template.ts` y `components/v4-interactions.tsx` se conservan únicamente como referencia del diseño anterior; la página nueva ya no los importa.

## Variables opcionales del formulario

Copiar `.env.example` como `.env.local` y completar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Sin credenciales, toda la experiencia visual funciona localmente y el formulario muestra un mensaje controlado indicando que todavía no está disponible.

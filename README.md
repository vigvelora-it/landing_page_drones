# Sky Tech Perú — entornos separados

El proyecto está dividido deliberadamente para impedir que los cambios en
desarrollo afecten el sitio publicado.

## Carpetas

- `produccion/`: copia del proyecto actualmente publicado y conectado a Supabase.
- `local/`: entorno de cambios, con la paleta corporativa del brochure y bloqueo de Vercel.
- `referencias/`: diseños HTML anteriores, capturas y recursos originales.

## Trabajar localmente

```powershell
Set-Location .\local
npm install
npm run dev
```

La versión local abre en `http://localhost:4173` y muestra una insignia `LOCAL`.

## Producción

La web pública es https://pagina-web-mayra.vercel.app. Cualquier despliegue
futuro debe ejecutarse deliberadamente desde `produccion/`, nunca desde `local/`.

```powershell
Set-Location .\produccion
npm install
npm run build
```

No copiar archivos de `local/` a `produccion/` sin una aprobación explícita.

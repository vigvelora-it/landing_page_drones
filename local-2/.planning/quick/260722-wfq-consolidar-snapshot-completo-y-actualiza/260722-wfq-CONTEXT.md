# Quick task 260722-wfq — Snapshot completo y rollback v2

## Objetivo

Consolidar en Git la versión funcional completa de `local-2` y hacer que el tag
de rollback `v2` apunte a ese estado exacto.

## Inventario previo

- 230 archivos de `local-2` ya estaban versionados.
- 40 archivos funcionales o documentales estaban sin versionar.
- El conjunto pendiente ocupa 227.270.754 bytes (216,74 MiB), principalmente por
  dos masters 4K con procedencia documentada.
- No existe `.env` real dentro de `local-2`.
- `.env.example` contiene valores de ejemplo cortos; no contiene JWT ni una
  `service_role` real.

## Inclusiones

- Configuración completa de Next.js, TypeScript y ESLint.
- API y validación del formulario de contacto.
- Configuración, esquema y migración de Supabase.
- Protección local contra despliegues accidentales.
- Recursos visuales usados por la aplicación.
- Biblioteca multimedia fuente, masters 4K y documentos de procedencia.
- Video histórico conservado para rollback.
- README, paleta y documentación operativa.

## Exclusiones

- `node_modules/`, `.next/`, `out/` y `.vercel/`.
- `.env` y variantes locales.
- `.playwright-cli/`.
- `tmp/` y `.tmp-*`.
- Cachés de TypeScript y Supabase.

Las exclusiones se registran en `local-2/.gitignore` para que el snapshot sea
reproducible sin incluir secretos, builds ni evidencia temporal de QA.

## Estrategia de tags

1. Conservar el destino anterior de `v2`
   (`e1ee23a5dfeae7271c3659d6ee3068282deced56`) con un tag de respaldo.
2. Crear el commit de consolidación mediante `gsd-tools`.
3. Reasignar el tag anotado `v2` al commit consolidado.
4. Verificar que `v2^{commit}` coincide con `HEAD`.

No se realiza push, despliegue ni modificación fuera de `local-2`.

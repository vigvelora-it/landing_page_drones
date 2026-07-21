# Phase 6: Calidad y Regresion Final - Research

**Researched:** 2026-07-20  
**Domain:** QA de release local para Next.js 16, regresion responsive e interactiva, inventario semantico/provenance de medios y formulario `/api/contact` con Supabase.  
**Confidence:** HIGH para codigo, entorno, API, assets y gaps; MEDIUM para el resultado visual final hasta ejecutar la matriz completa contra un build nuevo.

## Summary

La Fase 6 no necesita dependencias nuevas ni un rediseño. El cierre correcto es un unico plan secuencial que: detiene de forma controlada el `next start` actual, ejecuta `lint -> typecheck -> build`, levanta ese build en produccion local, completa la matriz de navegador, valida el formulario sin persistir datos y deja evidencia reproducible. Las reparaciones, si aparecen, deben ser pequeñas y locales al componente defectuoso.

Tres requisitos son verificables localmente con los recursos actuales:

- `QA-01`: los tres gates se ejecutan secuencialmente.
- `QA-02`: Playwright CLI esta instalado y el servidor de produccion local funciona en `127.0.0.1:4173`.
- `BRAND-02`: el wiring es correcto y puede probarse sin una escritura externa mediante payloads que terminan antes de Supabase y mediante interceptacion de red para los estados de cliente.

`QA-03` tiene un **gap real**. El DOM visible contiene medios de drone/topografia, equipo fotogrametrico con un puente al fondo y GNSS en terreno. Eso permite sostener drone/topografia, ingenieria de campo e infraestructura generica; no prueba honesta y simultaneamente geologia y mineria. Ademas, ningun PNG/JPG tiene un registro de provenance/licencia en el repositorio; solo el video tiene `public/video/CREDITS.md`. No se debe cambiar alt/caption para convertir equipo generico en mina o campaña geologica. Si el usuario no aporta assets locales autorizados e identificados, `QA-03` debe quedar abierto y el milestone debe reportar el gap.

`TEAM-01` y `BROCH-01` siguen fuera del alcance de esta fase: faltan cuatro retratos identificados y el PDF final. No deben marcarse completos.

## Constraints and Non-Negotiables

| Regla | Consecuencia |
|------|--------------|
| Solo `local-2/` | No tocar `../local/` ni `../produccion/` |
| Sin deploy | No invocar Vercel, `npm run deploy` ni servicios externos |
| Flujo secuencial | No ejecutar `tsc` y `next build` a la vez; no usar worktrees |
| QA, no rediseño | Mantener paleta, tipografia, spacing, copy, secciones y librerias actuales |
| Sin datos externos | No hacer insert real, enviar correo/WhatsApp ni llamar APIs fuera de localhost |
| Assets honestos | No copiar/generar/renombrar imagenes como evidencia de mineria o geologia |
| Gaps de Phase 5 | TEAM-01/BROCH-01 permanecen pendientes salvo insumo real del cliente |

<phase_requirements>
## Phase Requirements

| ID | Estado investigado | Evidencia necesaria | Resultado esperable |
|----|--------------------|--------------------|---------------------|
| QA-01 | Implementable | `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, cada uno con exit 0 y en ese orden | Puede cerrar tras ejecucion final |
| QA-02 | Implementable | Produccion local, 4 viewports, stress test combinado, reduced motion, no-JS, teclado, touch, 200% y consola | Puede cerrar si la matriz pasa o tras fixes minimos |
| QA-03 | **Gap de contenido/provenance** | Medios visibles y autorizados que representen geologia, ingenieria, mineria, infraestructura y drone/topografia con procedencia comprobable | No cerrar con el inventario actual |
| BRAND-02 | Implementable sin escritura externa | 400 malformed/schema/honeypot, 503 sin credenciales, wiring estructural y mocks 201/400/500 en navegador | Puede cerrar sin tocar Supabase |

Solo estos cuatro checkboxes pueden cambiar por evidencia de Phase 6. TEAM-01 y BROCH-01 no cambian.
</phase_requirements>

## Current Runtime and Environment

La inspeccion no expuso valores de entorno; solo registro presencia/ausencia:

- Listener actual: `127.0.0.1:4173`, PID 28456.
- Command line verificada: `node ...\local-2\node_modules\...\next start -p 4173`.
- Archivos `.env*`: solo `.env.example`.
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_SITE_URL`: placeholders en el ejemplo y ausentes del proceso actual.
- `playwright-cli.cmd` disponible globalmente.
- El build servido es util como baseline de Phase 5, pero Phase 6 debe construir uno nuevo antes de emitir evidencia final.

### Lifecycle seguro de build/start en PowerShell

Antes del build, resolver el listener y comprobar que su command line contiene la ruta absoluta de `local-2` y `next start -p 4173`. Solo entonces detener ese PID exacto; nunca matar todos los procesos `node`.

```powershell
$phase6Root = 'F:\ClaudeCode\Pagina_Web_Mayra\local-2'
$listener = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
$runtime = if ($listener) { Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" }
if ($runtime -and $runtime.CommandLine -notlike "*$phase6Root*next*start*-p 4173*") {
  throw 'El puerto 4173 no pertenece al next start de local-2.'
}
if ($runtime) { Stop-Process -Id $runtime.ProcessId }

npm.cmd run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
```

Para servir, crear primero un directorio de evidencia dentro de la carpeta de fase y usar ventana oculta. `Start-Process` devuelve el wrapper; la identidad final debe confirmarse de nuevo por el listener y `Win32_Process`.

```powershell
$evidence = Join-Path $phase6Root '.planning\phases\06-calidad-y-regresi-n-final\evidence'
New-Item -ItemType Directory -Force -Path $evidence | Out-Null
$server = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','start' `
  -WorkingDirectory $phase6Root -WindowStyle Hidden -PassThru `
  -RedirectStandardOutput (Join-Path $evidence 'server.stdout.log') `
  -RedirectStandardError (Join-Path $evidence 'server.stderr.log')
```

No borrar `.next` salvo que un error demostrado exija reconstruccion limpia. Nunca construir mientras `next start` consume el mismo artefacto.

## QA-01: Technical Gates

El `package.json` define exactamente:

- `lint`: `eslint .`
- `typecheck`: `tsc --noEmit`
- `build`: `next build`
- `start`: `next start -p 4173`
- `deploy`: script bloqueador local; no se invoca.

El plan debe capturar fecha/hora, comando, exit code y resumen de salida. La presencia previa de `.next` o `tsconfig.tsbuildinfo` no sustituye la ejecucion contra el codigo final. Si un gate falla, corregir la causa minima, volver a correr desde `lint` y registrar la iteracion.

## QA-02: Browser Matrix and Stress Test

### Matrix obligatoria

| Modo | Viewports | Evidencia |
|------|-----------|-----------|
| Default | 1440x900, 1000x800, 390x844, 320x568 | full vertical pass, overflow 0, console 0 errors, screenshots desktop/mobile |
| Reduced motion | 1440x900, 390x844 | contenido visible, video pausado, reveals/transiciones anulados, carousel usable y drag preservado |
| No JavaScript | 390x844 | intro oculto, reveals visibles, Nosotros/Proyectos/Contacto y email presentes |
| Keyboard-only | desktop + mobile principal | focus visible, orden logico, overlays cierran y restauran foco |
| 200% zoom | desktop | lectura/control sin scroll bidimensional; documentar zoom real o el proxy usado |

En cada viewport:

```js
({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  h1: document.querySelectorAll('h1').length,
  errors: /* contador pageerror + console.error del harness */,
})
```

Si `overflow !== 0`, listar elementos cuyo `getBoundingClientRect().right` exceda el ancho y arreglar ese componente. No añadir otra supresion global; hoy existe una sola declaracion `body{overflow-x:hidden}`.

### Stress test combinado

Ejecutar en el orden del UI-SPEC:

1. Top: header sin `.is-scrolled`, overflow 0, consola limpia.
2. Flick cruzando 80px y retorno: estado estable, sin cambio de altura.
3. Menu abierto desde scroll: Lenis bloqueado, seis destinos caben/tabulan, Escape/cierre/navegacion restauran scroll y foco.
4. Drawer: dialog visible, fondo inert, menu no puede abrir, body interno scrollea, Escape/backdrop/cierre funcionan y foco vuelve al servicio.
5. `Cotizar este servicio`: cierra drawer y llega a `#contacto` sin lock residual.
6. `.tech-sticky`: pin y release limpios; showcase queda despues, no debajo.
7. Carousel: viewport con ArrowRight/Left, botones extremos, dots, `aria-selected`, live region y `data-lenis-prevent` coherentes.
8. Drag horizontal/touch y scroll vertical sin conflicto ni expansion del documento.
9. Reduced motion: navegacion de controles instantanea; drag sigue funcional.
10. No autoplay: esperar al menos 10 s en snap 1 y comprobar que no cambia; source gate sin interval/timer/auto-advance.

### Hallazgos baseline

- En el build actualmente servido, 1440x900 dio overflow 0, un solo h1 y cero errores/warnings de consola en la carga observada.
- El fallback no-JS ya existe en `app/layout.tsx`: oculta `.intro` y fuerza visibles los reveals. En contexto 390x844 con JavaScript desactivado: intro `display:none`, 60/60 reveals visibles, secciones y email presentes, overflow 0.
- No debe reutilizarse este baseline como evidencia final despues de fixes; repetir todo contra el build final.

## QA-03: Rendered Media and Provenance Audit

El runtime visible actual contiene seis imagenes (una decorativa) y un video:

| Medio/render | Sujeto verificado visualmente | Axis defendible | Provenance en repo | Dictamen |
|--------------|-------------------------------|-----------------|--------------------|----------|
| Hero `topografia-con-drones.jpg` + `drone-flight-close.mp4` | drone sobre representacion/terreno y vuelo cercano | drone/topografia | video: Mixkit documentado; JPG: no documentado | Parcial |
| Technology `dron.png` | plataforma aerea/equipo | drone/topografia | no documentado | Parcial |
| Carousel `equipos1.png` | drone/equipos con puente al fondo | infraestructura generica + drone | no documentado | Parcial; no atribuir a proyecto |
| Carousel `dron.png` repetido | drone/equipo | drone/topografia | no documentado | No agrega eje nuevo |
| Process `monumentacion_puntos_referencia.png` | receptor GNSS en terreno montañoso | ingenieria/geomatica de campo | no documentado | Parcial; no prueba mina/geologia |
| Contact `equipos1.png`, alt vacio | repeticion decorativa a baja opacidad | decorativo | no documentado | Correcto que no anuncie contenido repetido |

Assets locales no visibles: `usar-drones-en-topografia.jpg` es otro drone y `MUSEO ZEN L1.png` es una camara/equipo. Ninguno cierra geologia o mineria. La inspeccion visual no autoriza provenance ni una asociacion a clientes/proyectos.

**Gap:** faltan medios visibles autorizados y con provenance para geologia y mineria; tambien falta documentar provenance de los JPG/PNG actuales. La reparacion minima solo es posible si el usuario aporta/autoriza assets y su procedencia. En caso contrario, crear un inventario de evidencia y dejar `QA-03` unchecked. No bloquear la ejecucion de QA-01/02/BRAND-02.

## BRAND-02: Non-Destructive Contact Verification

### Wiring estructural confirmado

```text
ContactForm
  -> POST /api/contact JSON
  -> contactSchema.safeParse(payload)
  -> createSupabaseAdmin()
  -> supabase.from("contact_requests").insert(...)
```

El cliente deshabilita submit durante la solicitud, mantiene los datos en error, resetea en 2xx y publica estado mediante `#form-status[aria-live="polite"]`. Las opciones derivan de `services`. El honeypot `website` esta fuera del tab order y Zod exige longitud cero. El helper Supabase es `server-only`, requiere URL + service role y desactiva persistencia/refresh de sesion.

### API segura ya observada

Con las credenciales confirmadas ausentes y contra localhost:

| Caso | Esperado/observado |
|------|--------------------|
| JSON malformado | 400, `La solicitud no contiene datos validos.` |
| Objeto schema-invalid | 400, primer mensaje Zod canonico |
| Honeypot no vacio | 400, `Solicitud no valida.` |
| Payload sintetico valido, sin credenciales | 503, fallback a `skytsperu@gmail.com` |

Los tres 400 retornan antes de crear el cliente. El 503 actual es seguro porque `createSupabaseAdmin` lanza antes de cualquier llamada externa. Revalidar presencia/ausencia de env justo antes del test final sin imprimir valores.

### Regla si aparecen credenciales

Si existe un `.env.local` o el proceso tiene ambas variables Supabase, **no enviar payload valido al endpoint real**. Limitar API directa a malformed/schema/honeypot y verificar el resto estructuralmente. No asumir que la URL es un proyecto de pruebas.

### Estados browser mediante mocks same-origin

Usar `page.route('**/api/contact', handler)` dentro de `playwright-cli run-code`. El handler espera unos 200-300 ms antes de `route.fulfill`, permitiendo afirmar el estado pending, y luego devuelve JSON local:

- 201: submit disabled mientras espera, live status `Enviando solicitud...`; despues formulario reseteado, button enabled y success canonico.
- 400/500: mantener valores, reactivar button y mostrar exactamente el mensaje mockeado.
- Dos clicks/Enter consecutivos mientras pending: una sola request interceptada.

Eliminar la route despues de cada caso. La intercepcion ocurre en el navegador antes de la red, por lo que no crea filas ni mensajes. No capturar body con datos reales; usar `Persona QA`, `qa@example.invalid` y texto sintetico.

## Likely Gaps and Minimal Repairs

| Hallazgo posible | Fix minimo permitido |
|------------------|----------------------|
| Overflow localizado | Corregir width/min-width/gap del selector culpable; nunca blanket overflow |
| Focus no visible | Añadir `:focus-visible` al control existente con `--focus-ring` |
| Estado de formulario no robusto a re-submit | Guardia client-side local durante pending, sin libreria ni cambio de API |
| Warning de preload del poster | Revisar relacion `priority`/video poster y corregir solo si se reproduce y es atribuible; warnings se clasifican |
| Reduced-motion video no pausado | Ajustar efecto existente, sin retirar controles |
| QA-03 geologia/mineria | Solo asset local autorizado + alt honesto + registro de provenance; de lo contrario dejar gap |

No se anticipa ningun cambio de schema, migracion, dependencia o copy de marca.

## Evidence Artifacts

Directorio recomendado: `.planning/phases/06-calidad-y-regresi-n-final/evidence/`.

- `quality-gates.txt`: comandos, timestamps, exit codes.
- `server.stdout.log` / `server.stderr.log`: solo salida local; revisar que no contenga secretos antes de commit.
- `browser-matrix.md` o JSON: viewport, modo, overflow, consola, escenarios y resultado.
- screenshots de desktop/mobile principal, overlay/drawer/carousel y reduced motion.
- `media-inventory.md`: ruta, render, alt, sujeto observado, provenance, eje y pass/gap.
- `contact-regression.md`: API status/copy, env booleans, mocks y contador de requests; sin payload sensible.
- `06-VALIDATION.md` y `06-VERIFICATION.md`: resultado agregado y gaps honestos.

No es necesario versionar logs voluminosos ni archivos temporales de Playwright; el plan debe seleccionar evidencia estable y auditable.

## Recommended Plan Split

Un solo plan `06-01-PLAN.md`, secuencial:

1. **Preflight + gates:** inventario/env booleans, detener listener verificado, lint/typecheck/build, levantar produccion local y confirmar command line.
2. **QA integrada + fixes minimos:** matriz de navegador, stress test, accessibility/reduced/no-JS/zoom, overflow y console; reparar solo defectos reproducidos y repetir gates afectados.
3. **Media + formulario + release evidence:** inventario QA-03 con provenance/gap, API 400/503 segun env, mocks browser 201/error/pending, documentar evidence y marcar solo requisitos probados.

El plan puede completar QA-01, QA-02 y BRAND-02 aun si QA-03 permanece abierto. El verifier debe reportar score 3/4 en ese caso, mas TEAM-01/BROCH-01 como gaps externos heredados; no forzar milestone completo.

## Autocheck Checklist

- [x] Requisitos QA-01/02/03 y BRAND-02 trazados a evidencia concreta.
- [x] Build/start secuencial y seguro para PowerShell documentado.
- [x] Matriz de cuatro viewports, reduced motion, no-JS, teclado, touch y zoom incluida.
- [x] API 400/503 y mocks 201/error definidos sin escritura externa.
- [x] Estado de Supabase comprobado por booleanos, sin exponer secretos.
- [x] Inventario de medios visibles basado en inspeccion visual y DOM.
- [x] QA-03 reconocido como gap real; no se inventa provenance ni contenido.
- [x] TEAM-01/BROCH-01 preservados como gaps externos.
- [x] Un solo plan secuencial recomendado; sin worktree, dependencia o deploy.

## Sources

### Primary (HIGH confidence)

- Codigo actual: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/api/contact/route.ts`, `components/contact-form.tsx`, `components/menu-overlay.tsx`, `components/service-drawer.tsx`, `components/equipment-carousel.tsx`, secciones, hooks, `lib/contact-schema.ts`, `lib/supabase-admin.ts`, `lib/site-content.ts`.
- Configuracion: `package.json`, `.env.example`, `next.config.ts`, `vercel.json`, `supabase/schema.sql`, migracion vigente.
- Contrato: `06-UI-SPEC.md`, `PROJECT.md`, `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `BRAND-CONTENT.md`, `CLAUDE.md`.
- Assets locales e inspeccion visual directa; `public/video/CREDITS.md`.
- Runtime local de produccion: process/port inspection, API localhost y Playwright baseline.

### External sources

Ninguna. No se consultaron ni copiaron Fugro, Seequent u otras webs. La investigacion depende del codigo, assets, brief y herramientas ya instaladas.

## Metadata

- Arquitectura y formulario: HIGH.
- Entorno/Supabase actual: HIGH, revalidar antes de ejecutar porque puede cambiar.
- QA-03: HIGH en el dictamen de gap actual; el cierre depende de nuevos assets/provenance del cliente.
- Responsive/interacciones: MEDIUM hasta ejecutar el plan sobre el build final.

**Research date:** 2026-07-20  
**Valid until:** cualquier cambio de codigo, variables de entorno o assets requiere repetir el preflight.

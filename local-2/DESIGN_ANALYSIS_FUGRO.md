# Análisis de referencia de diseño — fugro.com

> **Uso previsto:** este documento analiza `https://www.fugro.com/` únicamente como referencia de *principios* de diseño, motion y UX. Ninguna copia literal (textos, imágenes, logos, video, iconografía, código, nombres de clase) debe reutilizarse. El objetivo final es informar un rediseño original para **SkyTech Solutions**, empresa peruana de topografía y geología, sin relación con Fugro.
>
> Herramienta usada: Playwright CLI (`npx playwright-cli ...`) — no se dispuso de Chrome DevTools MCP en este entorno.

---

## 1. Resumen del lenguaje visual de Fugro

Fugro proyecta una identidad corporativa de ingeniería/geociencia mediante un lenguaje visual **plano, de bordes rectos y alto contraste tipográfico**: casi no hay border-radius (0px en imágenes, 2px en botones — prácticamente escuadrado), no hay sombras decorativas (`box-shadow: none` es la norma), y la separación entre bloques se resuelve con líneas finas (hairlines de 1px) y espacio en blanco generoso en vez de tarjetas flotantes con elevación. El color se usa con mucha disciplina: una base de azul marino muy oscuro y blanco, con un único acento cálido (naranja/rojo) reservado casi exclusivamente para llamados a la acción y flechas direccionales, lo que lo hace leer como "color de urgencia/acción" más que decorativo.

Tipográficamente combina dos familias autoalojadas (servidas vía `next/font`, no Google Fonts): una grotesca geométrica para cuerpo de texto y navegación, y una segunda familia — de trazo más fino y con mayor tamaño — reservada solo para titulares hero/H1. El contraste de peso entre ambas (headline grande y ligera vs. cuerpo denso y medio) es uno de los recursos más distintivos del sitio.

Estructuralmente, el sitio se apoya mucho en fotografía documental a pantalla completa (drones, plataformas, personal de campo) como fondo de secciones, con overlays de texto en tarjetas semitransparentes tipo "vidrio" (glassmorphism sutil, sin blur fuerte) que se solidifican en el estado activo/hover. El motion es discreto y funcional: transiciones CSS cortas (~0.2–0.3s) en vez de animaciones de scroll cinematográficas o librerías JS de animación pesadas — no se detectó GSAP, Framer Motion, Lenis ni Three.js/WebGL en esta página.

## 2. Estructura y patrones de sección

Orden observado en la home (descrito por función, no por contenido):

1. **Header global** (no fijo/sticky): logo + 6 ítems de navegación + búsqueda + perfil + botón CTA con borde. Transparente sobre el hero, se sobrepone a la imagen de fondo con un degradado oscuro superior para legibilidad.
2. **Hero de foto completa**: imagen documental a ancho completo, headline en tipografía display grande, subtítulo corto y botón "reproducir video" con icono de play, alineados en la mitad inferior de la imagen.
3. **Barra de navegación secundaria "Jump to"** (ancla in-page): fila delgada con enlaces a las secciones siguientes de la misma página. Esta barra sí es sticky (se fija al hacer scroll), mientras que el header principal no lo es.
4. **Sección de introducción/propósito**: título + párrafo + enlace, en columna angosta (~540px) sobre fondo blanco.
5. **Sección "industrias" tipo selector**: imagen de fondo a todo lo ancho con 3 tarjetas superpuestas (glass cards); una tarjeta aparece "activa" (fondo sólido blanco, texto oscuro, flecha en color de acento) mientras las otras dos quedan en estado "vidrio" (fondo semitransparente, borde blanco, texto blanco, flecha blanca).
6. **Grid de casos de estudio**: 3 columnas de tarjetas imagen+etiqueta+título, encabezado con enlace "ver todos" alineado a la derecha.
7. **Sección "organización"**: grid asimétrico de 2 tarjetas grandes (imagen+texto) + 2 módulos más pequeños (uno de ellos un widget de cotización bursátil en vivo).
8. **Banner CTA de reclutamiento**: imagen de fondo a todo lo ancho + overlay de texto + enlace, formato "banda" horizontal.
9. **Carrusel de noticias**: 3 tarjetas con controles prev/next (paginación por flechas, sin puntos/dots visibles).
10. **Banner institucional final** ("nuestra historia"): imagen a la izquierda + panel de color sólido a la derecha con texto y enlace — mismo patrón que el banner CTA de reclutamiento pero en formato dividido 50/50 en vez de overlay.
11. **Footer**: logo + columna de enlaces principales + columna "suscribirse" + dos columnas (redes sociales / contacto) + línea legal inferior + fila "también te puede interesar".

No se detectaron elementos flotantes persistentes tipo chat widget o botón "volver arriba"; el único elemento fijo real además de la barra "Jump to" es el banner de cookies.

## 3. Sistema tipográfico

Ambas familias son **autoalojadas** (`@font-face` con `woff2` servido desde `/_next/static/media/...`, optimizado vía `next/font`), no son Google Fonts. Los nombres internos ofuscados (`__aktivGrotesk_*`, `__review_*`) sugieren que la grotesca es **Aktiv Grotesk** (fundición Dalton Maag), una tipografía de pago/licenciada de uso común en identidades corporativas — **no debe copiarse ni asumirse de libre uso**; para un proyecto nuevo conviene una categoría similar: *grotesca geométrica/neo-grotesca de peso medio* (ej. Inter, General Sans, Söhne, o una grotesca de Google Fonts con métricas parecidas). La segunda familia (variable interna "review") es una tipografía display de trazo más ligero usada solo en H1; al no poder confirmarse su identidad ni licencia, se recomienda tratarla igual: no copiar, usar una display sans de peso ligero/regular como categoría equivalente.

Escala tipográfica medida (desktop 1440px → mobile 390px):

| Elemento | Desktop | Mobile | Font-family | Peso | Letter-spacing |
|---|---|---|---|---|---|
| H1 (hero) | 68px / line-height 74.8px | 36px / line-height 43.2px | Display (self-hosted, "review") | 400 | -1% |
| H2 (sección) | 26px / line-height 35.1px | 24px / line-height 32.4px | Grotesca (Aktiv Grotesk) | 500 | -2% |
| Párrafo (hero) | 24px / line-height 38.4px | — | Grotesca | 400 | 0% |
| Botón/nav | 16px | — | Grotesca | 500 | — |

Notas: el H1 reduce su tamaño en ~47% de desktop a mobile (68→36px) mientras el H2 apenas cambia (26→24px) — es decir, la jerarquía se "aplana" en mobile: el salto entre H1 y H2 es mucho menor que en desktop. El letter-spacing negativo (-1% a -2%) en titulares es constante en ambos breakpoints, un recurso típico para compactar visualmente titulares grandes.

## 4. Paleta y tratamiento del color

Colores extraídos por computed style (no inventados):

| Uso | Valor | Hex aproximado |
|---|---|---|
| Azul marino (texto, fondos institucionales, botón hover text) | `rgb(1, 30, 65)` | `#011E41` |
| Acento naranja/rojo (CTAs, flechas, enlaces "leer más") | `rgb(255, 51, 0)` | `#FF3300` |
| Blanco (texto sobre foto, fondos de tarjeta activa) | `rgb(255, 255, 255)` | `#FFFFFF` |
| Overlay hero | degradado negro→transparente sobre la imagen, para legibilidad del header y el H1 | — |
| Tarjetas "vidrio" (industrias) | fondo semitransparente oscuro + borde blanco 1px, sin blur intenso perceptible | — |

No se observó uso de gradientes decorativos de marca (solo el degradado funcional de legibilidad sobre el hero) ni de colores secundarios adicionales (verdes, morados, etc.) en la home. El contraste blanco-sobre-foto-oscura y navy-sobre-blanco es alto y consistente; el acento naranja sobre blanco (`#FF3300` sobre `#FFFFFF`) cumple holgadamente el contraste AA para texto de tamaño normal.

## 5. Sistema de espaciados

- **Max-width de contenedor**: `1440px`, con padding lateral fijo de `48px` en ambos lados (a 1440px de viewport el contenedor ocupa el 100% con gutter de 48px, no hay "aire" adicional fuera de él).
- **Padding vertical de sección**: `48px` arriba de forma consistente entre secciones `<section>` del `<main>` (medido en 3 secciones consecutivas); no se detectó padding-bottom explícito equivalente, sugiriendo que el espaciado entre secciones se resuelve principalmente con el padding-top de la siguiente.
- **Columna de contenido angosta** (para bloques de texto tipo "What we do"): `max-width: 542px`, sin padding lateral propio (hereda el del contenedor padre) pero con `padding-right: 32px` adicional para no pegar el texto al borde de la columna.
- **Gutter entre tarjetas** (grid de 3 casos de estudio): visualmente consistente con el sistema de 8px (bordes de tarjeta a tarjeta ~24–32px).

## 6. Diseño de botones y enlaces

- **Botón primario de header ("Get in touch")**: outline-only en reposo — fondo transparente, borde blanco 1px, texto blanco, `border-radius: 2px`, padding `20px`, `font-weight: 500`. En **hover** se invierte completamente: fondo pasa a blanco sólido, texto a navy (`#011E41`), el borde se mantiene. Transición explícita: `background 0.2s cubic-bezier(0.45, 0, 0.55, 1), border 0.2s cubic-bezier(0.45, 0, 0.55, 1)` — es decir, una curva de easing simétrica tipo ease-in-out, no un ease estándar de navegador.
- **Tarjetas de industria (glass cards)**: la tarjeta "activa"/seleccionada tiene fondo blanco sólido, texto navy y flecha en color de acento; las tarjetas inactivas son transparentes con borde blanco y texto/flecha blancos. El cambio de estado observado corresponde a una tarjeta "activa por defecto" (posiblemente ciclada automáticamente o controlada por estado de componente), más que a un simple `:hover` de CSS — recomendable investigar en fase de build si es focus/hover real o un estado controlado por JS.
- **Enlaces de texto tipo "Read more" / "All case studies"**: color de acento naranja permanente (no solo en hover), acompañados de una flecha SVG; el patrón "texto + flecha inline" se repite en todo el sitio como firma visual de enlace secundario.
- **Iconografía de flecha en botón cuadrado**: un `span` cuadrado con transición propia de `0.25s` detectado en el markup, sugiriendo un desplazamiento sutil de la flecha en hover (no confirmado visualmente de forma concluyente, pero la transición está declarada en CSS).

## 7. Comportamiento del header

Hallazgo distintivo: **el header global (logo + navegación principal) no es sticky** — se desplaza junto con el contenido y desaparece de la vista al hacer scroll más allá del hero. En su lugar, es la **barra secundaria de navegación por anclas ("Jump to")** la que se fija (`position: sticky; top: 0`) y permanece visible durante todo el resto del scroll de la página, incluso sobre el footer.

**Mega-menú**: al hacer hover sobre un ítem de navegación (ej. "Industries") se despliega un panel de 3 columnas con fondo blanco sólido:
- Columna 1: título de la sección + descripción corta + enlace "overview" con icono de flecha en botón cuadrado.
- Columna 2: lista de enlaces de segundo nivel.
- Columna 3: tarjeta destacada (imagen + etiqueta + título + flecha) a modo de contenido promovido.

El ítem de navegación activo recibe un subrayado (underline) navy debajo del texto. El resto de la página queda ligeramente atenuado (scrim) mientras el menú está abierto. En viewports táctiles (tablet/mobile) el mismo componente colapsa a un **overlay de pantalla completa** con botones "atrás" (`‹`) y "cerrar" (`✕`) en la esquina superior, listado vertical de un nivel por pantalla (patrón drill-down), consistente entre 768px y 390px.

## 8. Uso de imágenes y videos

- Todas las imágenes de contenido pasan por el optimizador de imágenes de Next.js (`/_next/image?url=...&w=...&q=75`), servidas desde un CDN externo (CloudFront) — evidencia de **CMS headless** (ver sección 11) con transformación de imágenes on-demand (resize, formato WebP) y ausencia de `loading="lazy"` verificable directamente, pero el patrón de query params (`w=1920`, `w=656`) confirma generación de tamaños responsivos por breakpoint.
- El hero no usa video de fondo autoplay; usa una imagen estática con un botón "reproducir" que, al activarse, carga un `<video>` nativo con `src` tipo `blob:` (Media Source Extensions) — es decir, streaming adaptativo (consistente con el dominio `1vod-adaptive.akamaized.net` permitido en la política CSP del sitio), no un simple `<video src="archivo.mp4">`. Los controles nativos del navegador (play, tiempo, volumen, fullscreen) quedan visibles, indicando que no hay una capa de UI custom sobre el reproductor.
- El modal de video se abre con una animación de expansión: se detectó un `@keyframes expandBox` que anima de una caja pequeña (10% ancho, 5% alto, posicionada abajo) a un panel casi de pantalla completa (95% ancho, 90% alto, centrado) — el modal crece desde la posición del botón "play" hasta cubrir la vista, con overlay de fondo oscurecido y botón de cierre cuadrado en la esquina superior derecha.
- Proporciones de imagen variables según contexto (hero ~16:9 ancho completo, tarjetas de caso de estudio ~4:3, banners institucionales en formato ancho tipo 21:9).

## 9. Catálogo de animaciones detectadas

| Elemento / sección | Trigger | Estado inicial | Estado final | Duración aprox. | Easing aprox. | Propiedades animadas | Tecnología probable |
|---|---|---|---|---|---|---|---|
| Botón "Get in touch" (header) | hover | fondo transparente, texto blanco | fondo blanco, texto navy | ~0.2s | `cubic-bezier(0.45,0,0.55,1)` (ease-in-out simétrico) | `background`, `border` | CSS transition (styled-components) |
| Flecha en botones/tarjetas (span cuadrado) | hover (declarado en CSS) | posición base | desplazamiento sutil (no confirmado visualmente) | 0.25s | no especificado explícitamente (default ease) | `transform` (inferido) | CSS transition |
| Modal de video ("Watch our story") | click en botón play | caja pequeña (10% w / 5% h, anclada abajo) | panel casi pantalla completa (95% w / 90% h, centrado) | no confirmable con precisión desde CSS estático (keyframe sin `animation-duration` inline visible) | no confirmado | `width`, `height`, `margin-left`, `top` | **CSS `@keyframes`** (nombre `expandBox`, hash de CSS-in-JS) |
| Mega-menú de navegación | hover sobre ítem de nav | oculto | panel visible + scrim de fondo + underline en ítem activo | rápido, percibido <0.3s | no medido con precisión | `opacity`/`display` + posición del panel | CSS transition / toggle de clase (React state) |
| Tarjetas "industrias" (glass cards) | estado activo/seleccionado (no confirmado si hover puro o estado de componente) | tarjeta transparente con borde | tarjeta sólida blanca + flecha de acento | no medido | no medido | `background-color`, `color` | CSS transition sobre clase controlada por React |
| Ripple genérico (Material Design Components) | interacción táctil/click en ciertos controles | radio 0, opacidad 0 | radio expandido, opacidad 0.1→0 | variable (definido por MDC, típicamente 225–400ms) | `cubic-bezier(0.4,0,0.2,1)` | `transform: scale`, `opacity` | **CSS `@keyframes` de la librería Material Design Components (MDC ripple)** — evidencia directa: nombres `mdc-ripple-fg-*` encontrados en las hojas de estilo |

No se detectó scroll-reveal (fade-in/slide-in al entrar elementos al viewport) de forma clara en la porción de home analizada; los cambios visibles al hacer scroll se limitan al comportamiento sticky de la barra "Jump to". Esto puede deberse a que gran parte del contenido ya es visible sin scroll adicional en desktop, o a que las animaciones de entrada son mínimas/inexistentes en esta plantilla.

## 10. Duraciones y easings aproximados (resumen)

- **Micro-interacciones de botón/enlace**: ~0.2s–0.25s, con curvas `cubic-bezier` simétricas tipo ease-in-out (no `ease` por defecto del navegador) — sensación de respuesta rápida y "firme", sin rebote ni exceso de suavidad.
- **Ripple (MDC)**: curva `cubic-bezier(0.4, 0, 0.2, 1)`, la curva estándar de Material Design ("standard easing"), reutilizada tal cual de la librería sin personalizar.
- **Modal de video**: sin duración explícita confirmable, pero por convención de expansión de caja este tipo de transición suele rondar 0.3–0.5s en implementaciones equivalentes.
- **No se detectaron** animaciones de larga duración (>0.6s), parallax, ni easings tipo "elastic/bounce" en ningún punto analizado — el motion del sitio es deliberadamente contenido y funcional.

## 11. Librerías o tecnologías probables (con evidencia)

| Tecnología inferida | Evidencia observada |
|---|---|
| **Next.js (React) con App/Pages Router híbrido** | Chunks `framework-*.js`, `webpack-*.js`, `main-*.js`, rutas `_next/static/chunks/pages/[[...slug]]-*.js`; fuentes servidas vía `_next/static/media/*.woff2` (patrón de `next/font`); imágenes vía `_next/image?url=...` |
| **styled-components (CSS-in-JS)** | Nombres de clase con patrón `sc-<hash>-<n>` en el DOM (ej. `sc-272981b3-0 dbZHxu`), y nombres de `@keyframes` con hash aleatorio (ej. `dLTjhF`) típico de generación en runtime |
| **Storyblok (CMS headless)** | Error de consola explícito: *"You need to provide an access token to interact with Storyblok API"*; dominio `api.storyblok.com` permitido en la Content-Security-Policy |
| **CloudFront + Next.js Image Optimization** | URLs de imagen con host `d3rwfsce0vn25a.cloudfront.net` pasadas como parámetro a `/_next/image` |
| **Video adaptativo (Akamai / streaming HLS-like vía MSE)** | El `<video>` del modal usa `src="blob:..."`, y el dominio `1vod-adaptive.akamaized.net` está explícitamente permitido en CSP para `connect-src` |
| **Material Design Components (solo para ripple)** | `@keyframes mdc-ripple-fg-radius-in`, `mdc-ripple-fg-opacity-in/out` presentes en las hojas de estilo — probablemente un componente aislado (ej. algún control de formulario) reutiliza esta librería, no todo el sitio |
| **Analítica/martech pesado** | GTM, Google Analytics 4, Google Ads/DoubleClick, LinkedIn Insight Tag, Hotjar, Marketo/Munchkin, VWO (Visual Website Optimizer, A/B testing), Cookiescript (consentimiento), RequestMetrics (RUM) — decenas de requests de tracking en cada carga |
| **GSAP / ScrollTrigger** | No detectado: `window.gsap` es `undefined`, ningún chunk con nombre reconocible, ningún patrón de animación de scroll complejo observado |
| **Framer Motion** | No detectado: sin globals expuestos ni atributos `data-framer-*` en el DOM inspeccionado |
| **Lenis / Locomotive Scroll (smooth-scroll)** | No detectado: el scroll nativo del navegador responde de forma estándar (sin inercia añadida perceptible ni `window.Lenis`) |
| **Three.js / WebGL / Canvas** | No detectado: no hay elementos `<canvas>` en el árbol de accesibilidad de la home |
| **Lottie** | No detectado: sin requests a `.json` de animación ni `window.lottie` |

**Conclusión sobre motion**: la evidencia apunta consistentemente a **animaciones CSS puras** (transiciones declarativas y `@keyframes` generados por styled-components), sin una librería de animación JS dedicada para el flujo principal de la home. La única librería de animación de terceros confirmada (MDC ripple) parece acotada a un componente puntual, no al sistema de motion general del sitio.

## 12. Patrones que conviene aplicar a un sitio corporativo más pequeño

1. **Paleta de dos colores + un acento único**: usar una base sobria (oscuro + blanco) con un solo color de acento reservado exclusivamente para CTAs y elementos interactivos (flechas, enlaces "leer más") comunica jerarquía sin necesidad de una paleta extensa — encaja bien con una marca de ingeniería/topografía que busca transmitir precisión y confianza.
2. **Botón outline-invertido en hover**: el patrón de botón con borde y fondo transparente que se invierte a sólido en hover es simple de implementar en CSS puro, no requiere JS, y da una sensación de interactividad "firme" apropiada para un sitio B2B técnico.
3. **Barra de navegación por anclas sticky, separada del header principal**: para una landing con secciones largas (servicios, proceso, casos de éxito), una barra secundaria delgada y sticky con enlaces a cada sección ayuda a la orientación sin necesidad de duplicar o fijar todo el header (menor complejidad de CSS/JS que un header sticky completo con estados de scroll).
4. **Tarjetas "glass" sobre fotografía de campo real**: para un sitio de topografía/geología con buen material fotográfico de campo (equipos, drones, terreno), superponer tarjetas semitransparentes con texto blanco sobre una imagen de fondo a todo ancho es una forma efectiva de combinar storytelling visual con navegación, sin necesitar ilustraciones o iconografía custom.
5. **Transiciones cortas y simétricas (~0.2s, ease-in-out) en vez de easings "juguetones"**: para un sitio técnico/corporativo, mantener las animaciones de interacción por debajo de 300ms con curvas simétricas refuerza una sensación de "herramienta profesional" en vez de "app de consumo", evitando bounce/elastic.

## 13. Patrones que NO conviene aplicar (y por qué)

- **Volumen de martech/tracking (GTM, 3+ pixeles de Ads, Hotjar, VWO, Marketo, LinkedIn Insight, etc.)**: apropiado para una multinacional con equipos de marketing dedicados y presupuesto de paid media; para un sitio corporativo pequeño esto añade peso de carga, superficie de violaciones de CSP (se observaron varios bloqueos reales en consola) y complejidad de cumplimiento de cookies sin beneficio proporcional.
- **Mega-menú de 3 columnas con contenido promovido**: tiene sentido cuando existen decenas de sub-secciones por categoría (industrias, expertise, etc.); para un sitio con 5–6 páginas totales, un mega-menú se sentiría sobredimensionado — un dropdown simple de una columna es suficiente y más rápido de construir/mantener.
- **CMS headless (Storyblok) + pipeline de imágenes vía CDN externo**: resuelve necesidades de una organización con equipos editoriales globales publicando contenido constantemente; para un sitio estático de alcance más acotado, esta infraestructura es sobre-ingeniería — un sitio estático/JAMstack simple con imágenes optimizadas localmente cumple el mismo objetivo visual sin la complejidad operativa.
- **Header no-sticky combinado con navegación secundaria sticky**: es un patrón válido para Fugro porque su barra "Jump to" ya contiene enlaces de navegación funcionales, pero implica que el usuario pierde acceso al menú principal (Industries, Expertise, etc.) mientras hace scroll salvo que vuelva arriba — para un sitio más pequeño con menos secciones, es preferible un header principal sticky simple (más predecible para el usuario) en vez de replicar esta separación de dos barras.
- **Widget de cotización bursátil en vivo y contenido de relaciones con inversionistas**: irrelevante para una empresa que no cotiza en bolsa; es contenido específico del sector de Fugro como compañía pública, no un patrón de diseño a imitar.

## 14. Rendimiento y accesibilidad

**Rendimiento** (medido en una carga limpia tras reload, viewport 1440×900):
- TTFB: ~86ms
- DOMContentLoaded: ~649ms
- Load event: ~1078ms
- Recursos cargados: 103 (46 scripts, 21 imágenes, 21 fetch, 10 link/CSS-fuentes, 1 beacon)
- Transferencia total aproximada: ~515KB en la carga inicial (sin contar el video bajo demanda ni las decenas de peticiones de analítica que llegan después de forma asíncrona)
- Se detectaron **7 peticiones bloqueadas por CSP** (violaciones reales registradas en consola: doubleclick, cookie-script) y **2 errores de React minificado (#418, #423)** — típicos de mismatch de hidratación SSR/cliente en Next.js. Esto no es un patrón deseable a replicar; indica fricción entre el contenido dinámico del CMS y el render inicial.
- El volumen de scripts de terceros (46 en la carga base, más decenas de peticiones de tracking tras la interacción) es alto para el peso visual que aporta a la página; en un rediseño más pequeño este presupuesto debería reducirse drásticamente.

**Accesibilidad**:
- Jerarquía de encabezados correcta y limpia en el árbol de accesibilidad: un único `h1` (hero) seguido de `h2` por cada sección subsiguiente, sin saltos de nivel detectados.
- Landmarks semánticos presentes y bien usados: `banner` (header), `main`, `contentinfo` (footer) — estructura de accesibilidad sólida.
- **No se detectó soporte para `prefers-reduced-motion`** en ninguna hoja de estilo inspeccionada — ninguna `@media` query condiciona las transiciones/keyframes a la preferencia de movimiento reducido del usuario. Es un punto de mejora a **sí** aplicar en el rediseño (aunque el sitio de referencia no lo haga).
- Botones y enlaces cuentan con roles accesibles correctos (`button "Play video"`, `button "Search"`, etc.) y los enlaces de navegación exponen su `href` de forma estándar.
- El modal de video expone un botón "Close video" con nombre accesible explícito — buen patrón a replicar en cualquier lightbox/modal propio.

## 15. Capturas tomadas (rutas relativas a la carpeta scratchpad `fugro-analysis/`)

Carpeta base: `C:\Users\JHOAN\AppData\Local\Temp\claude\f--ClaudeCode-Pagina-Web-Mayra\abdc14e1-034c-4f05-b464-a2a863303f13\scratchpad\fugro-analysis\`

- `desktop-1440/00-initial-load.png` — carga inicial con banner de cookies visible
- `desktop-1440/card-hover.png` / `desktop-1440/card-nohover.png` — comparación de estado de tarjetas "industrias"
- `desktop-1440/video-modal-open.png` — modal de video expandido
- `desktop-1440/header-scrolled-1500.png` / `desktop-1440/header-scrolled-clean.png` / `desktop-1440/header-scrolled-clean2.png` — comportamiento del header/barra sticky al hacer scroll
- `desktop-1440/mega-menu-hover.png` — mega-menú desplegado sobre "Industries"
- `desktop-1440/footer.png` — footer completo
- `laptop-1280/01-hero.png` (con mega-menú abierto), `laptop-1280/01-hero-clean.png` — hero en 1280×800
- `laptop-1280/02-cards.png` — sección de tarjetas en 1280×800
- `laptop-1280/03-footer.png` — footer en 1280×800
- `tablet-768/01-hero.png` (overlay de menú mobile-style abierto), `tablet-768/01-hero-clean.png` — hero en 768×1024
- `tablet-768/02-cards.png` — tarjetas en 768×1024
- `tablet-768/03-footer.png` — footer en 768×1024
- `mobile-390/01-hero.png` — hero en 390×844
- `mobile-390/02-cards.png` — tarjetas en 390×844
- `mobile-390/03-footer.png` — footer en 390×844
- `mobile-390/04-menu-open.png` — submenú "Industries" en overlay mobile
- `mobile-390/04b-menu-root.png` — menú raíz en overlay mobile (drill-down con chevrons)
- `full-snapshot.txt` — snapshot de accesibilidad completo de la home (estructura semántica)
- `network-requests.txt` / `network-requests-static.txt` — listado de peticiones de red (dinámicas y estáticas)

Todas las capturas son material de referencia interno para este análisis; no deben reutilizarse como assets finales del sitio de SkyTech Solutions.

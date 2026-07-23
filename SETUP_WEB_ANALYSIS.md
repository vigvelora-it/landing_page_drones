# Setup del entorno Claude Code para análisis de páginas de referencia

Fecha: 2026-07-22

## 1. Herramientas encontradas inicialmente

| Herramienta | Estado inicial |
|---|---|
| Claude Code | 2.1.177, instalado |
| Node.js | v24.16.0 (≥18 ✔) |
| npm / npx | 11.13.0 |
| Git | 2.54.0.windows.1, en el PATH |
| Google Chrome | Instalado en `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Playwright CLI | `@playwright/cli` 0.1.14 instalado globalmente, skill ya en `~/.claude/skills/playwright-cli` |
| Chrome DevTools MCP | **No instalado** (ni como plugin ni como MCP manual) |
| frontend-design | **No instalado** |
| Marketplaces | Ya configurados: `claude-plugins-official` (anthropics/claude-plugins-official), `fullstack-dev-skills`, `ui-ux-pro-max-skill`, `buildwithclaude` |
| Plugins | `agents-development-architecture@buildwithclaude`, `fullstack-dev-skills@fullstack-dev-skills` (scope proyecto), `ui-ux-pro-max@ui-ux-pro-max-skill` |
| GSD Core | 67 skills `gsd-*` en `~/.claude/skills/` |
| web-reference-analyzer | No existía |

El marketplace `claude-plugins-official` ya presente resultó ser la fuente oficial equivalente a la solicitada (`anthropics/claude-code`): su catálogo incluye tanto `chrome-devtools-mcp` (apuntando directamente al repo oficial `ChromeDevTools/chrome-devtools-mcp`) como `frontend-design` (de Anthropic). No fue necesario añadir un segundo marketplace.

## 2. Herramientas instaladas

- **`chrome-devtools-mcp@claude-plugins-official`** (scope: user) → instala el servidor MCP oficial (`npx chrome-devtools-mcp@1.6.0`) y 6 skills: `chrome-devtools`, `chrome-devtools-cli`, `a11y-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`, `troubleshooting`.
- **`frontend-design@claude-plugins-official`** (scope: user) → skill oficial de Anthropic para diseño de UI.
- **Skill personalizada `web-reference-analyzer`** en `~/.claude/skills/web-reference-analyzer/SKILL.md`.

## 3. Herramientas actualizadas

- **`@playwright/cli`**: 0.1.14 → **0.1.17** (`npm install -g @playwright/cli@latest`).
- Skill `playwright-cli` en `~/.claude/skills/playwright-cli` actualizada al contenido correspondiente a la versión 0.1.17 (ver nota de duplicado en advertencias).

## 4. Herramientas que ya estaban correctas

- Claude Code 2.1.177 (soporta plugins/MCP/skills sin cambios).
- Node.js, npm, npx, Git.
- Google Chrome.
- Plugins `agents-development-architecture`, `fullstack-dev-skills`, `ui-ux-pro-max` — **no modificados**.
- GSD Core (67 skills) — **no modificado**.

## 5. Versiones finales

| Componente | Versión |
|---|---|
| Claude Code | 2.1.177 |
| Node.js | v24.16.0 |
| npm | 11.13.0 |
| npx | 11.13.0 |
| Git | 2.54.0.windows.1 |
| Playwright CLI (`@playwright/cli`) | 0.1.17 |
| chrome-devtools-mcp (plugin/MCP) | 1.6.0 |
| frontend-design (plugin) | sin número de versión publicado por el marketplace ("unknown"), contenido presente y funcional |

## 6. Ubicación de cada skill

| Skill | Ubicación |
|---|---|
| `playwright-cli` | `~/.claude/skills/playwright-cli/` (usuario, global) |
| `chrome-devtools` / `chrome-devtools-cli` / `a11y-debugging` / `debug-optimize-lcp` / `memory-leak-debugging` / `troubleshooting` | dentro del plugin `chrome-devtools-mcp@claude-plugins-official` (usuario, global) |
| `frontend-design` | dentro del plugin `frontend-design@claude-plugins-official` (usuario, global) |
| `web-reference-analyzer` | `~/.claude/skills/web-reference-analyzer/SKILL.md` (usuario, global, creada en esta sesión) |
| GSD Core (67 skills `gsd-*`) | `~/.claude/skills/gsd-*` (usuario, global) — intactas |
| `ui-ux-pro-max` | dentro del plugin `ui-ux-pro-max@ui-ux-pro-max-skill` (usuario, global) — intacto |
| `fullstack-dev-skills` | plugin con scope de **proyecto** (`fullstack-dev-skills@fullstack-dev-skills`) — intacto |

## 7. MCP activos

```
claude.ai Google Drive: https://drivemcp.googleapis.com/mcp/v1 - ✔ Connected
plugin:chrome-devtools-mcp:chrome-devtools: npx chrome-devtools-mcp@1.6.0 - ✔ Connected
```

Una sola instalación activa de Chrome DevTools MCP, gestionada por el plugin oficial (no se creó una segunda entrada manual con `claude mcp add`).

## 8. Plugins activos

```
agents-development-architecture@buildwithclaude   (user)   ✔ enabled
chrome-devtools-mcp@claude-plugins-official        (user)   ✔ enabled   [nuevo]
frontend-design@claude-plugins-official            (user)   ✔ enabled   [nuevo]
fullstack-dev-skills@fullstack-dev-skills          (project) ✔ enabled
ui-ux-pro-max@ui-ux-pro-max-skill                  (user)   ✔ enabled
```

## 9. Pruebas realizadas y resultado

| Prueba | Resultado |
|---|---|
| `playwright-cli open https://example.com --headed` | ✔ Chrome se abrió, navegó y devolvió snapshot de la página |
| `playwright-cli screenshot` | ✔ Captura de viewport generada correctamente |
| `playwright-cli snapshot` + `playwright-cli click e6` | ✔ Interacción por referencia de elemento funcionó; navegó a `iana.org/help/example-domains` |
| `playwright-cli resize 390 844` | ✔ Cambio a viewport móvil aplicado sin errores |
| `playwright-cli close-all` + `playwright-cli list` | ✔ Todas las sesiones (incluidas antiguas de proyectos previos) cerradas; `list` confirma "no browsers" |
| `claude mcp list` tras instalar el plugin | ✔ `chrome-devtools` aparece "Connected" vía `npx chrome-devtools-mcp@1.6.0` |
| `claude plugin list` tras instalar | ✔ 5 plugins, todos `enabled`, sin duplicados |
| Verificación de duplicados de skills | ✔ Ninguna skill duplicada tras corregir el duplicado detectado (ver advertencias) |
| Validación JSON de `.claude/settings.local.json` | ✔ JSON válido, no fue necesario modificarlo (no se tocó, no requirió backup) |

## 10. Advertencias

- `playwright-cli install --skills` solo soporta instalación a **nivel de proyecto** (creó `.claude/skills/playwright-cli` en este repositorio). Como la regla del usuario exige herramientas a nivel de usuario para todos los proyectos, se sincronizó el contenido actualizado hacia `~/.claude/skills/playwright-cli` (global) y se **eliminó** la copia de proyecto recién creada para evitar una skill duplicada con el mismo nombre. Si en el futuro se ejecuta `playwright-cli install --skills` dentro de otro proyecto, ocurrirá lo mismo y deberá repetirse esta sincronización manual (no existe un flag `--scope user` en esta versión de la CLI).
- El plugin `frontend-design@claude-plugins-official` reporta versión "unknown" en `claude plugin list`; esto es cosmético (el manifiesto del marketplace no publica un campo de versión para este plugin), el contenido de la skill (`SKILL.md`) está presente y activo.
- Existe un plugin de terceros llamado `frontend-design-pro` en el marketplace `buildwithclaude` (ya configurado previamente por el usuario) — **no se instaló**, solo aparece en el catálogo. No hay conflicto de nombres porque no está instalado.
- `playwright-cli --version` tras la actualización mostró correctamente `0.1.17`, seguido de un error de cierre de proceso de Node en Windows (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`). Es un problema cosmético de salida del proceso en Windows, no afecta la funcionalidad — todas las pruebas posteriores con la CLI funcionaron con normalidad.
- Se limpiaron únicamente los 3 archivos de prueba generados en `.playwright-cli/` durante esta sesión (screenshot y snapshots de `example.com`); los artefactos previos del usuario en esa carpeta (capturas de fases anteriores del proyecto) no se tocaron.
- No se modificó ningún archivo de configuración (`settings.json` / `settings.local.json`), por lo que no fue necesario crear copias de seguridad.

## 11. Comandos pendientes que requieren reiniciar o recargar Claude Code

Ninguno. Los plugins instalados (`chrome-devtools-mcp`, `frontend-design`) y la skill personalizada `web-reference-analyzer` ya fueron detectados y quedaron disponibles en la sesión activa sin necesidad de reiniciar Claude Code.

---

## Tabla resumen

| Componente | Estado | Versión | Ubicación | Prueba realizada |
|---|---|---|---|---|
| Claude Code | Ya correcto | 2.1.177 | binario CLI | `claude --version` |
| Node.js | Ya correcto | v24.16.0 | sistema | `node --version` (≥18 ✔) |
| npm | Ya correcto | 11.13.0 | sistema | `npm --version` |
| npx | Ya correcto | 11.13.0 | sistema | `npx --version` |
| Git | Ya correcto | 2.54.0.windows.1 | PATH del sistema | `git --version` |
| Google Chrome | Ya correcto | instalado | `C:\Program Files\Google\Chrome\Application\chrome.exe` | detección de ruta |
| Playwright CLI | Actualizado | 0.1.14 → 0.1.17 | npm global (`AppData\Roaming\npm`) | open/screenshot/click/resize/close-all |
| Skill `playwright-cli` | Actualizado (sync + deduplicado) | acorde a 0.1.17 | `~/.claude/skills/playwright-cli` | listada como skill disponible |
| Chrome DevTools MCP | Instalado (nuevo) | 1.6.0 | plugin `chrome-devtools-mcp@claude-plugins-official` (user) | `claude mcp list` → Connected |
| Skills Chrome DevTools (6) | Instaladas (nuevo) | incluidas en plugin 1.6.0 | dentro del plugin anterior | listadas como skills disponibles |
| frontend-design | Instalado (nuevo) | "unknown" (cosmético) | plugin `frontend-design@claude-plugins-official` (user) | `claude plugin list` → enabled |
| GSD Core | Intacto | 67 skills | `~/.claude/skills/gsd-*` | conteo antes/después idéntico |
| fullstack-dev-skills | Intacto | 0.4.15 | plugin, scope proyecto | `claude plugin list` |
| ui-ux-pro-max | Intacto | 2.5.0 | plugin `ui-ux-pro-max@ui-ux-pro-max-skill` (user) | `claude plugin list` |
| web-reference-analyzer | Creado (nuevo) | — | `~/.claude/skills/web-reference-analyzer/SKILL.md` | reconocida en el listado de skills activas |
| Duplicados | Resueltos | — | — | verificación manual de carpetas y `plugin list` |

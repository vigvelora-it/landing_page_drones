# Quick task 260722-vpo — Logo al finalizar el video

## Objetivo

Reproducir el video del Hero una sola vez, detenerlo en el último fotograma y
mostrar suavemente el logo de SkyTech en el espacio derecho.

## Comportamiento

- El atributo `loop` se elimina del video.
- Al dispararse `ended`, el último fotograma queda visible.
- El logo horizontal transparente aparece con una transición de opacidad,
  desplazamiento y escala leves.
- El control cambia a `Reproducir`.
- Al pulsar `Reproducir`, el video vuelve a `0`, el logo se oculta y comienza una
  nueva reproducción única.
- Una pausa manual intermedia no muestra el logo.
- Con `prefers-reduced-motion`, el video permanece pausado y se muestra el estado
  final sin una transición prolongada.

## Responsive

- Desktop: logo amplio en el tercio derecho libre.
- Móvil: logo reducido en la zona superior derecha para no tapar el titular,
  descripción ni CTA.

## Verificación

- Evento final, último fotograma, logo visible y botón `Reproducir`.
- Reinicio manual, logo oculto y botón `Pausar`.
- Desktop y móvil sin overflow.
- `lint`, `typecheck` y `build` aprobados.

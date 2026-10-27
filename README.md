# Beauty Tech Retail Experience

**Versión 24.** Experiencia local para cinco estaciones de belleza, con consentimiento previo y procesamiento de cámara en el navegador.

## Inicio rápido en Windows

1. Extrae el proyecto completo.
2. Ejecuta `INICIAR-DEMO.bat`, o desde PowerShell en esta carpeta: `py .\iniciar_demo.py`.
3. Usa la dirección local que se abre; deja la ventana del servidor activa.

No requiere Node, paquetes Python, claves ni conexión a internet para la detección local y los vídeos incluidos. No abras `index.html` con doble clic: la cámara y los módulos necesitan el servidor local de `127.0.0.1`.

## Recorrido

1. En la pantalla inicial, selecciona una sección y pulsa **Iniciar experiencia**.
2. Lee el aviso. **Aceptar y activar cámara** solicita el permiso nativo del navegador; **No aceptar · Volver** vuelve sin solicitarlo ni encenderla.
3. Tras aceptar, se carga el detector facial local y aparece el estado de escaneo. Una presencia sostenida muestra una franja aproximada de edad, sugerencias generales y el vídeo local de la sección.
4. Se puede corregir la franja en el selector de recomendaciones. El botón **Volver al inicio** o Escape detiene la cámara y devuelve al inicio.
5. Si se rechaza el permiso del navegador, se muestran acciones para reintentar, volver al inicio o iniciar una demostración guiada sin cámara. Esta última se identifica como simulación y no estima edad.

## Funcionalidad

- Cinco estaciones configurables y contenido local de muestra.
- Modos trabajador, administración y presentación a pantalla completa.
- Consentimiento explícito antes de solicitar el acceso a la cámara.
- Detección facial y rango de edad calculados en el dispositivo con `@vladmandic/face-api` 1.7.15. Código y pesos necesarios incluidos.
- Rango corregible: menos de 18, 18–24, 25–34, 35–44 y 45 o más.
- Recomendaciones de ejemplo generales por rango; no son diagnóstico ni valoración de la piel.
- Dos vídeos locales de muestra con licencia abierta: MP4/AV1 preferido y WebM/VP8 como alternativa cuando el navegador no admita AV1; pueden sustituirse por archivos autorizados de la tienda.
- Modos de simulación manual/guiada sin cámara, claramente identificados como simulación.
- Cinco zonas de cámara configurables, ajuste de confianza y diseño responsive.

## Privacidad y límites

- No se activa la cámara antes de aceptar el aviso. El navegador puede denegar el permiso y la experiencia ofrece opciones de salida.
- Fotogramas y rango estimado se procesan en memoria local: no se guardan ni se envían a terceros ni a un servidor.
- La edad estimada puede ser inexacta y **no verifica la edad**. La edad no determina las necesidades de la piel. No se presenta ni se usa la salida de género del modelo.
- La detección requiere ver un rostro; no estima edad si solo ve un cuerpo. No reconoce identidad, mirada, barba o características del cabello.
- Los vídeos de ejemplo son genéricos, no representan productos reales. La franja cambia las sugerencias; la selección de vídeo actual depende de la sección.
- La interfaz no usa fuentes web: `css/fonts.css` toma Segoe UI/Georgia disponibles en el sistema. Los iconos son SVG incluidos en `assets/icons/`.
- En Administración se puede introducir voluntariamente una URL externa de vídeo. Ese uso opcional contacta al host elegido y necesita internet; no es necesario para la demo y nunca recibe imágenes de cámara.
- No se ha probado una cámara física ni una tablet Android real. El comportamiento de GPU, permisos y codecs debe confirmarse en el dispositivo de destino.
- El servidor Python enlaza solo a `127.0.0.1`. En Android, una web servida por HTTP desde otro equipo de la red normalmente no es un origen seguro para cámara; usa un origen HTTPS de confianza o ejecuta el servicio localmente en la tablet.
- Para un despliegue en tienda, revisa accesibilidad, rendimiento, consentimiento, privacidad, obligaciones legales y los derechos de cualquier contenido que añadas.

## Recursos y licencias

| Recurso | Versión | Licencia | Descarga y copia incluida | Alternativas evaluadas / elección |
|---|---|---|---|---|
| `@vladmandic/face-api` (detección y estimación) | 1.7.15 | MIT; copia de `LICENSE` junto a la biblioteca | Paquete oficial del autor en [npm 1.7.15](https://www.npmjs.com/package/@vladmandic/face-api/v/1.7.15); `vendor/face-api/face-api.js` | Se descargaron e inspeccionaron `face-api.js` 0.22.2 (MIT) y `@vladmandic/human` 3.3.6 (MIT). El paquete antiguo no incluía pesos de modelo; Human era más grande y no empaquetaba un modelo de edad listo para este flujo. Se eligió el bundle compacto y se probó su carga desde disco. |
| TensorFlow.js (incluido en el bundle del navegador) | 4.22.0 | Apache-2.0; copia local | Código incluido en el bundle oficial anterior; [licencia del repositorio oficial `tensorflow/tfjs`](https://github.com/tensorflow/tfjs/blob/tfjs-v4.22.0/LICENSE); `vendor/face-api/TENSORFLOW-LICENSE` | Se mantiene local, junto con el bundle de inferencia; no se carga desde CDN. |
| TinyFaceDetector y AgeGenderNet (pesos) | Incluidos en 1.7.15 | MIT, distribuidos dentro del paquete anterior | Manifiestos y pesos del mismo paquete npm; `models/face-api/` | Las alternativas inspeccionadas no proporcionaban aquí pesos de edad listos para uso local. |
| Recomendaciones por edad | 24 | Lógica y textos de ejemplo del proyecto | `js/products.js` y `data/contenido.json`; sin descarga externa | Reglas locales por rango, editables; no se envía la imagen ni se consulta una API. |
| Muestra de cosmética (`cosmetics-demo.mp4`, alternativa `.webm`) | AV1 MP4 + VP8 WebM | CC BY-SA 4.0 | Sha'Boris, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cosmetics.webmhd.webm); archivos locales en `assets/videos/` | Se probaron WebM/VP8 y MP4/H.264; el Chromium integrado no decodificó WebM, mientras que MP4/AV1 sí se reprodujo. H.264 no se incluyó por sus condiciones de patentes; WebM/VP8 queda como alternativa a confirmar en el dispositivo final. |
| Muestra de cabello (`haircare-demo.mp4`, alternativa `.webm`) | AV1 MP4 + VP8 WebM | CC0 1.0 | Blackgirlmighty, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hair_cutting_in_Botswana.webm); archivos locales en `assets/videos/` | AV1 se probó reproduciendo el archivo; WebM/VP8 queda incluido para dispositivos que lo admitan, pero no se pudo validar en el Chromium integrado. La fuente CC0 permite su reutilización comercial. |
| Fuentes e iconos | Dependientes del sistema / SVG del proyecto | Segoe UI y Georgia dependen de la licencia del sistema; SVG propios del proyecto | Fuentes del sistema y `assets/icons/`; no se descarga una fuente web | Se evitó Google Fonts y paquetes de iconos remotos para que la interfaz no dependa de internet. |

La licencia MIT del paquete está en `vendor/face-api/LICENSE`; la licencia Apache-2.0 del componente TensorFlow.js incluido está en `vendor/face-api/TENSORFLOW-LICENSE`. El servidor local admite solicitudes HTTP por rangos de bytes, necesarias para que el navegador pueda reproducir y buscar en los vídeos. En uso comercial del vídeo CC BY-SA, conserva la atribución y cumple las condiciones de esa licencia; el archivo CC0 no requiere atribución, aunque aquí se conserva su autoría como referencia. Sustituye los vídeos solo por contenido con derechos adecuados.

## Diagnóstico y pruebas

- Si la cámara no inicia, revisa permisos del navegador, conexión física de la cámara y cierra aplicaciones que la estén usando. Si rechazas el permiso, puedes volver al inicio o usar la simulación sin cámara.
- Si no carga el modelo local, comprueba que `vendor/face-api/` y `models/face-api/` estén incluidos en la carpeta.
- Los modelos y vídeos incluidos no usan CDN. Solo un enlace externo añadido manualmente puede generar solicitudes de red.
- Verificado en Windows con el Chromium integrado de Electron (Chrome 150): arranque con `python .\iniciar_demo.py`, detección y estimación local con una cara vectorial sintética, carga de ambos modelos, mapeo de los cinco rangos, actualización manual de recomendaciones y reproducción de ambos MP4/AV1. La cara sintética prueba la conexión del flujo, no la precisión con personas reales.
- Se probó rechazar el consentimiento sin cargar modelos, el permiso de cámara denegado, reintentar con una cámara simulada y volver al inicio. También se inició y detuvo la simulación guiada sin activar la cámara.
- En el recorrido de prueba no hubo solicitudes externas, respuestas HTTP 4xx, solicitudes fallidas ni errores/avisos de consola. Los rangos HTTP se validaron con respuestas 206 y 416; la inferencia mostró 27 ms tras cargar los modelos.
- Se capturaron e inspeccionaron las vistas de bienvenida y resultado en 1280×800 y 390×844; no hubo desbordamiento horizontal. AV1 se reprodujo; el Chromium integrado no pudo decodificar WebM/VP8, así que esa alternativa queda pendiente de prueba en Chrome/Edge nativos.
- No se certificó cámara física, tablet Android real ni todas las combinaciones de GPU/codec. Confirma la cámara, el permiso y el respaldo WebM en el dispositivo de tienda.

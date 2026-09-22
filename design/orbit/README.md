# ORBIT / UX–01

Nuevo compañero 3D de UXCODESTUDIO. Casco cerámico, visor oscuro,
articulaciones de titanio, iluminación configurable y base de levitación.

## Archivos

- `orbit-v2.blend`: modelo editable y estudio de iluminación en Blender 5.1.
- `orbit-preview.png`: render transparente de referencia.
- `../../public/models/orbit-v2.glb`: modelo web, sin texturas ni dependencias externas.
- `../../public/models/orbit-poster.png`: respaldo optimizado mientras carga el 3D o si WebGL no está disponible.

Los modelos anteriores (`orbit_robot*.glb`, `ORBIT_final.glb`) se eliminaron de `public/`.

## Interacciones

- La mirada sigue el cursor en toda la ventana; los ojos anticipan el giro de cabeza.
- Al dejar de mover el cursor, vuelve suavemente a una pose de espera.
- Cada toque muestra un gesto distinto: saludo, órbita, baile y guiño.
- Tres colores: cian, violeta y ámbar; se aplican a ojos, luces y ambiente del panel.
- Controles mínimos: colores, **Pregúntale a ORBIT** y **?** (pistas y secretos).
- **Se duerme** tras 30 s sin actividad (ojos cerrados, luces bajas, "Zzz") y despierta sobresaltado con cualquier movimiento.
- **Tímido**: si el cursor se acerca a su cara, se echa hacia atrás y entrecierra los ojos.
- **Señala** con el brazo cualquier `.studio-button` (o `[data-orbit-point]`) bajo el cursor.
- En móvil, la mirada sigue la **inclinación del teléfono** (en iOS se pide permiso al primer toque).
- Botones accesibles con teclado, indicadores de selección y textos en español e inglés.
- Pausa el renderizado fuera de pantalla y al ocultar la pestaña.
- Con movimiento reducido, elimina la animación continua y renderiza bajo demanda.

### Compañero flotante

Cuando el hero sale de pantalla, un ORBIT pequeño vuela a la esquina inferior derecha
(`OrbitDock.tsx`, portal al `body`). Comparte estado con el del hero; sólo uno renderiza a la vez.

- Saluda una vez en cada sección (servicios, proceso, precios, FAQ, contacto).
- Reacciona al pasar el cursor por tarjetas de servicio y por el plan destacado (máx. una vez cada 8 s).
- Formulario de contacto: baila al enviar, cara triste si falla (`cueOrbit` en `lib/orbitCue.ts`).
- Tocarlo abre el chat.

### Chat con IA

`OrbitChat.tsx` → `POST /api/orbit` (AI SDK + Vercel AI Gateway, `anthropic/claude-haiku-4.5`).
El contexto se construye con `lib/i18nData.ts` y `lib/serviceDetails.ts`, así que los precios y
servicios del chat siempre coinciden con la página. Mientras responde, la boca y el ecualizador
del pecho se mueven. **Enviar esto al equipo** copia las preguntas al formulario de contacto.

- Requiere `AI_GATEWAY_API_KEY` en local; en Vercel funciona con OIDC al activar AI Gateway.
- Sin clave o con error, ORBIT responde con un mensaje de respaldo y el email de contacto.
- Límites: 10 turnos, 600 caracteres por mensaje, 300 tokens de salida y 20 mensajes por IP
  cada 10 min (por instancia). Para un límite global, añadir una regla de rate limit en Vercel Firewall.

### Personalidad y secretos

- Espera con levitación, mirada curiosa, parpadeo doble y un pequeño estiramiento cada 23 segundos de animación, si no está siguiendo al visitante.
- **Órbita**: vuelo de 6,4 segundos sobre una base inmóvil, con inclinación, brazos abiertos y partículas. Ajusta el desplazamiento al ancho del escenario.
- El panel del pecho acompaña los gestos y aparecen frases breves en español o inglés.
- Mantener pulsado 700 ms descubre los **ojos de corazón**. Alternativa de teclado: enfocar al robot y pulsar **H**.
- Tres toques en menos de 900 ms descubren un **giro de 360°**. También funciona pulsando Enter tres veces con el robot enfocado.
- Escribir **ORBIT** con el robot enfocado descubre el **vuelo entre estrellas**. El atajo no intercepta los campos ni la navegación del resto del sitio.
- **Secretos** abre pistas y permite repetir los gestos descubiertos. La lista se recuerda en localStorage cuando está disponible.
- Escape cancela el gesto y cierra las pistas. Reposo cancela gestos y temporizadores. Deslizar más de 12 px cancela la pulsación prolongada y conserva el scroll vertical.
- Con movimiento reducido se conservan las expresiones y los mensajes, sin vuelos, giros, partículas ni bucles de movimiento.

## Editar el modelo

Abrir `orbit-v2.blend` directamente en Blender. Mantener los nombres y pivotes
`ORBIT_Root`, `Head`, `Body`, `Eye_L`, `Eye_R`, `Happy_L`, `Happy_R`, `Smile`,
`Arm_L`, `Arm_R` y `Chest_Equalizer_0` a `Chest_Equalizer_4`:
el componente web los utiliza para las expresiones. `Dock` es independiente.

Las expresiones `Happy_*` están ocultas inicialmente en Blender, pero se incluyen
en el GLB para que la página pueda activarlas. Los materiales `Eye_LED` y
`Accent_LED` reciben el color elegido por el visitante.

Para exportar a mano, seleccionar sólo el modelo (sin cámara ni luces), exportar
GLB con **Y Up**, aplicar modificadores, desactivar animaciones y conservar la
jerarquía. Incluir las expresiones ocultas. Guardar en `public/models/orbit-v2.glb`.

Después, comprimir con meshopt (1,23 MB → 339 KB; drei lo decodifica sin configuración):

```powershell
npx @gltf-transform/cli meshopt public/models/orbit-v2.glb public/models/orbit-v2.glb --level medium
```

La cuantización añade escala a los nodos hoja (`Chest_Equalizer_*`); `HeroScene` anima
relativo a esa escala base.

## Regenerar desde el script

Desde la raíz del proyecto, en PowerShell:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.1\blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/blender/build_orbit.py
node scripts/blender/optimize_orbit_poster.mjs
npx @gltf-transform/cli meshopt public/models/orbit-v2.glb public/models/orbit-v2.glb --level medium
```

La regeneración sobrescribe el modelo generado y el `.blend`: guardar cualquier
edición manual con otro nombre antes de ejecutarla.

## Integración

- `components/three/HeroScene.tsx`: materiales, iluminación, seguimiento y animación.
- `components/three/OrbitCompanion.tsx`: controles, idioma y recuperación de errores.
- `components/three/OrbitCompanion.module.css`: presentación adaptable.
- `components/three/orbitBehavior.ts`: coreografías y duraciones, independientes del renderizado.
- `components/three/useOrbitPersonality.ts`: gestos, secretos, cancelación y memoria opcional.
- `components/three/OrbitDock.tsx`: compañero flotante al hacer scroll.
- `components/three/OrbitChat.tsx` y `app/api/orbit/route.ts`: chat con IA.
- `lib/orbitCue.ts`: eventos para que otras secciones hagan reaccionar a ORBIT.
- `components/Hero.tsx`: ubicación dentro de la portada.

Única dependencia añadida: `ai` (AI SDK) para el chat. La exportación usa la
[API glTF de Blender](https://docs.blender.org/api/main/bpy.ops.export_scene.html).

## Verificación realizada

- `npx tsc --noEmit --incremental false` y `npm run build`: correctos.
- Escritorio 1440 × 1000, móvil 375 × 812 y emulación iPhone 12.
- Selección de color, saludo por clic y teclado, reposo y reactivación.
- Botones de al menos 44 × 44 px; sin desbordamiento horizontal a 375 px.
- Pausa fuera de pantalla; renderizado bajo demanda con movimiento reducido.
- Pérdida de contexto WebGL simulada: respaldo visible y recuperación al reintentar.
- Versiones española e inglesa; sesión limpia sin errores de JavaScript.
- GLB: 339 KB (meshopt), 54.988 triángulos, 7 materiales, sin recursos externos.

Capturas: `before.png`, `final-desktop.png` y `final-mobile.png`.

Pruebas de las coreografías (Node 24):

```powershell
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test scripts/tests/orbit-behavior.test.mjs
```

Comprueban límites del vuelo, regreso al reposo, giro completo y ausencia de movimiento
en modo reducido. Capturas de la personalidad: `personality-flight.png`,
`personality-love.png`, `personality-mobile.png` y `personality-mobile-en.png`.

La actualización de personalidad se revisó a 1440, 768, 375 y 320 px, en ambos
idiomas: secretos por teclado, pulsación prolongada real, cancelación al arrastrar,
reposo, recuperación del 3D y devolución del foco al cerrar las pistas. En modo
reducido se verificaron también los ojos de corazón con renderizado bajo demanda.

# ORBIT / UX–01

Nuevo compañero 3D de UXCODESTUDIO. Casco cerámico, visor oscuro,
articulaciones de titanio, iluminación configurable y base de levitación.

## Archivos

- `orbit-v2.blend`: modelo editable y estudio de iluminación en Blender 5.1.
- `orbit-preview.png`: render transparente de referencia.
- `../../public/models/orbit-v2.glb`: modelo web, sin texturas ni dependencias externas.
- `../../public/models/orbit-poster.png`: respaldo optimizado mientras carga el 3D o si WebGL no está disponible.

Los modelos anteriores en `public/` se conservan.

## Interacciones

- La mirada sigue el cursor en toda la ventana; los ojos anticipan el giro de cabeza.
- Al dejar de mover el cursor, vuelve suavemente a una pose de espera.
- Clic, toque o el botón **Saludar**: ojos sonrientes, inclinación y saludo con el brazo.
- Tres colores: cian, violeta y ámbar; se aplican a ojos, luces y ambiente del panel.
- Reposo: ojos entrecerrados, cabeza relajada y luces atenuadas.
- Botones accesibles con teclado, indicadores de selección y textos en español e inglés.
- Pausa el renderizado fuera de pantalla y al ocultar la pestaña.
- Con movimiento reducido, elimina la animación continua y renderiza bajo demanda.

## Editar el modelo

Abrir `orbit-v2.blend` directamente en Blender. Mantener los nombres y pivotes
`Head`, `Body`, `Eye_L`, `Eye_R`, `Happy_L`, `Happy_R`, `Smile` y `Arm_R`:
el componente web los utiliza para las expresiones. `Dock` es independiente.

Las expresiones `Happy_*` están ocultas inicialmente en Blender, pero se incluyen
en el GLB para que la página pueda activarlas. Los materiales `Eye_LED` y
`Accent_LED` reciben el color elegido por el visitante.

Para exportar a mano, seleccionar sólo el modelo (sin cámara ni luces), exportar
GLB con **Y Up**, aplicar modificadores, desactivar animaciones y conservar la
jerarquía. Incluir las expresiones ocultas. Guardar en `public/models/orbit-v2.glb`.

## Regenerar desde el script

Desde la raíz del proyecto, en PowerShell:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.1\blender.exe' --background --factory-startup --python-exit-code 1 --python scripts/blender/build_orbit.py
node scripts/blender/optimize_orbit_poster.mjs
```

La regeneración sobrescribe el modelo generado y el `.blend`: guardar cualquier
edición manual con otro nombre antes de ejecutarla.

## Integración

- `components/three/HeroScene.tsx`: materiales, iluminación, seguimiento y animación.
- `components/three/OrbitCompanion.tsx`: controles, idioma y recuperación de errores.
- `components/three/OrbitCompanion.module.css`: presentación adaptable.
- `components/Hero.tsx`: ubicación dentro de la portada.

No se añadieron dependencias. La exportación usa la
[API glTF de Blender](https://docs.blender.org/api/main/bpy.ops.export_scene.html).

## Verificación realizada

- `npx tsc --noEmit --incremental false` y `npm run build`: correctos.
- Escritorio 1440 × 1000, móvil 375 × 812 y emulación iPhone 12.
- Selección de color, saludo por clic y teclado, reposo y reactivación.
- Botones de al menos 44 × 44 px; sin desbordamiento horizontal a 375 px.
- Pausa fuera de pantalla; renderizado bajo demanda con movimiento reducido.
- Pérdida de contexto WebGL simulada: respaldo visible y recuperación al reintentar.
- Versiones española e inglesa; sesión limpia sin errores de JavaScript.
- GLB: 1,23 MB, 54.988 triángulos, 7 materiales, sin recursos externos.

Capturas: `before.png`, `final-desktop.png` y `final-mobile.png`.

# UXCODESTUDIO — rediseño del sitio

## Dirección visual

Una composición editorial con tipografía grande, texto breve y ORBIT como punto focal. El fondo de estrellas y la transición WarpStars se conservan; los movimientos decorativos respetan la preferencia de movimiento reducido.

- Hero: grafito, cian suave, dos acciones en escritorio y una principal en móvil.
- Servicios: tarjetas asimétricas con conceptos de interfaces dibujados en CSS. Son ilustraciones de servicios, no casos de clientes.
- Proceso: fondo crema y cinco tarjetas en tonos salvia que se apilan al desplazarse en escritorio. En móvil y tablet se presentan en flujo normal.
- Precios: tres planes principales y cuatro opciones adicionales desplegables, conservando precios y contenido comercial existente.
- FAQ: acordeón sobre un fondo claro.
- Contacto: fondo cian, etiquetas visibles y estados de envío, éxito y error.
- Footer: seis tecnologías con logotipos locales, explicaciones bilingües, enlaces oficiales y estados de foco y hover. La franja se adapta a seis, tres o dos columnas.
- Navegación y detalles: diálogos nativos con cierre por Escape y devolución del foco.

## Archivos principales

- `app/studio.css`: composición, colores, estados y adaptación por tamaño.
- `components/studio/StudioUI.tsx`: entrada al desplazarse, interacción de tarjetas y diálogos.
- `components/studio/ServiceVisual.tsx`: ilustraciones de las tarjetas.
- `components/studio/ServiceExtensions.tsx`: tarjetas grandes de hosting, reservas, actualizaciones y apps, con ilustraciones y capacidades visibles.
- `components/studio/ServiceCardHeading.tsx`: cabeceras de los siete servicios con rótulos grandes, traducciones, iconos y numeración. Los pasos del proceso usan números destacados e indicadores de las cinco etapas.
- `components/studio/FooterTechnology.tsx`: presentación de Next.js, React, TypeScript, Tailwind CSS, Framer Motion y Vercel.
- `components/studio/SectionLabel.tsx`: títulos de sección grandes con seis dibujos SVG propios: órbita, composición, ruta, gráfica, diálogo y avión de papel. Los iconos animan solo cuando están visibles y la pestaña está activa; respetan movimiento reducido.
- `lib/serviceDetails.ts`: textos detallados originales de los servicios.
- `lib/useMotionPreference.ts`: seguimiento de la preferencia de movimiento reducido.

Las rutas `/` y `/es` comparten el diseño. ORBIT mantiene el modelo y las interacciones del rediseño anterior.

## Validación

- Compilación de producción y comprobación de TypeScript.
- Revisión visual en 1440, 768 y 375 px, en español e inglés.
- Navegación móvil, detalles de servicios, Escape, devolución del foco, planes adicionales y FAQ.
- Reserva abierta desde servicios y planes; verificación del servicio preseleccionado, sin confirmar reservas.
- Formulario probado con respuestas locales simuladas de éxito y error. No se enviaron correos.
- Preferencia de movimiento reducido y ausencia de desbordamiento horizontal.

Las capturas en esta carpeta muestran la vista local de desarrollo.

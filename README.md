# UXCODESTUDIO

Sitio web premium estilo agencia / SaaS construido con **Next.js 15**, **TypeScript**, **TailwindCSS**, **GSAP**, **Lenis**, **Framer Motion** y **Three.js / React Three Fiber / Drei**.

Estética: oscura futurista, glassmorphism, glow neón, gradientes mesh animados, partículas, scroll suave cinematográfico e interacciones inmersivas.

---

## 🚀 Cómo arrancar (Windows / VS Code)

```powershell
cd C:\Users\Omar\IdeaProjects\uxcodestudio
npm install
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000).

> Si prefieres usar **pnpm** o **yarn**, los comandos equivalentes son `pnpm install && pnpm dev` o `yarn && yarn dev`.

### Abrir en VS Code

```powershell
code C:\Users\Omar\IdeaProjects\uxcodestudio
```

Al abrir el proyecto, VS Code te sugerirá instalar las extensiones recomendadas (ESLint, Prettier, Tailwind CSS IntelliSense).

---

## 📦 Scripts

| Comando         | Acción                              |
| --------------- | ----------------------------------- |
| `npm run dev`   | Servidor de desarrollo (`:3000`)    |
| `npm run build` | Build de producción                 |
| `npm start`     | Servir el build de producción       |
| `npm run lint`  | Linter de Next.js                   |

---

## 🗂️ Estructura

```
uxcodestudio/
├── app/
│   ├── globals.css        # tokens, glass, aurora, grid, scrollbar
│   ├── layout.tsx         # fonts + SmoothScroll + Navbar
│   └── page.tsx           # composición de secciones
├── components/
│   ├── three/HeroScene.tsx   # escena R3F (orbe + anillos + partículas)
│   ├── SmoothScroll.tsx      # Lenis + GSAP ScrollTrigger
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Process.tsx
│   ├── WhyChooseUs.tsx
│   ├── FeaturedWork.tsx
│   ├── Testimonials.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   └── MagneticButton.tsx
├── lib/utils.ts
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 Sistema de diseño

- **Background:** `#050508`
- **Acentos:** `#4f6ef7` (blue) · `#00d4ff` (cyan) · `#8b5cf6` (violet)
- **Fuentes:** Syne (display) · Inter (body)
- **Efectos clave:** `glass`, `glass-strong`, `neon-border`, `text-gradient-accent`, `aurora-layer`, `grid-bg`, `glow-blue`, `glow-violet`

---

## 🧠 Notas técnicas

- **Lenis** se inicializa en `SmoothScroll.tsx` y se sincroniza con `gsap.ticker` para que `ScrollTrigger` siga el scroll virtual.
- La **escena 3D** (`HeroScene`) se carga con `next/dynamic` y `ssr: false` para evitar errores de SSR con WebGL.
- Las **animaciones de entrada** usan GSAP (`expo.out` / `power3.out`) y Framer Motion (`viewport={{ once: true }}`).
- Los **mockups de Featured Work** son SVG/CSS puros: no requieren imágenes externas.
- El marquee de **Testimonials** usa `animation-marquee` definido en `tailwind.config.ts` con `mask-fade-x`.

---

## 🛠️ Personalización rápida

| Quieres cambiar...    | Edita...                                       |
| --------------------- | ---------------------------------------------- |
| Colores / fuentes     | `tailwind.config.ts` + `app/layout.tsx`        |
| Texto del hero        | `components/Hero.tsx` (constante `ROTATING`)   |
| Servicios             | `components/Services.tsx` (`SERVICES`)         |
| Casos del portafolio  | `components/FeaturedWork.tsx` (`WORKS`)        |
| Precios               | `components/Pricing.tsx` (`PLANS`)             |
| FAQs                  | `components/FAQ.tsx` (`FAQS`)                  |

---

## ✅ Checklist de despliegue

- [ ] Cambia `metadataBase` y el dominio en `app/layout.tsx`.
- [ ] Sustituye el email `info@uxcodestudio.com` en `FinalCTA.tsx`.
- [ ] Añade tu favicon en `app/icon.png` (Next.js lo detecta automáticamente).
- [ ] `npm run build` antes de subir a Vercel / Netlify.

---

Made with ✦ by UXCODESTUDIO.

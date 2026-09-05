export type DetailCopy = {
  eyebrow: string;
  extendedDesc: string;
  includes: string[];
  idealFor?: string[];
  cta: string;
};
export type ServiceDetail = DetailCopy & {
  accentColor: string;
  accentRgb: string;
  heroBg: string;
  es: DetailCopy;
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    eyebrow: "Most Popular",
    extendedDesc: "A business website is your company's main online home. It gives customers a clear place to learn who you are, what you offer, where you are located, and how to contact you.\n\nIt is perfect for businesses that need to look more professional, build trust, explain their services, and make it easier for customers to call, visit, book, or request a quote.\n\nWith a business website, your company can create a stronger first impression, support your Google and Apple Maps presence, and give customers the information they need before making a decision.",
    includes: ["Professional design tailored to your brand", "Mobile-friendly on all devices", "Contact form & click-to-call button", "Google Maps & location integration", "Core Web Vitals optimized", "Basic SEO setup", "Analytics integration (Google Analytics)", "Easy to update yourself"],
    idealFor: ["Local businesses", "Service providers", "Restaurants & retail", "Contractors & freelancers"],
    cta: "Get Your Business Website",
    accentColor: "#4f6ef7", accentRgb: "79,110,247",
    heroBg: "linear-gradient(135deg,#0a0f2e 0%,#1a1060 60%,#0d1845 100%)",
    es: {
      eyebrow: "Más Popular",
      extendedDesc: "Un sitio web de negocio es el hogar principal de tu empresa en línea. Les da a los clientes un lugar claro para conocer quién eres, qué ofreces, dónde estás ubicado y cómo contactarte.\n\nEs perfecto para negocios que necesitan verse más profesionales, generar confianza, explicar sus servicios y facilitar que los clientes llamen, visiten, reserven o soliciten una cotización.\n\nCon un sitio web de negocio, tu empresa puede causar una mejor primera impresión, reforzar tu presencia en Google y Apple Maps, y darle a los clientes la información que necesitan antes de tomar una decisión.",
      includes: ["Diseño profesional para tu marca", "Compatible con celular y tablet", "Formulario de contacto y botón de llamada", "Integración con Google Maps", "Core Web Vitals optimizado", "SEO básico configurado", "Integración con Analytics (Google Analytics)", "Fácil de actualizar"],
      idealFor: ["Negocios locales", "Proveedores de servicios", "Restaurantes y tiendas", "Contratistas y freelancers"],
      cta: "Obtén tu Sitio Web",
    },
  },
  {
    eyebrow: "Landing Page",
    extendedDesc: "A landing page is a focused one-page website designed for a specific goal: promote a service, present an offer, collect leads, receive calls, or guide customers to take action.\n\nIt is perfect for businesses that want to advertise one main service, launch a promotion, test a new idea, or create a simple online presence without needing a full website.\n\nWith a landing page, your business can give customers the key information they need quickly, clearly, and professionally. No distractions. Just one clear message and one clear action.",
    includes: ["One professional page", "Clear headline and message", "Service or offer section", "Benefits and key information", "Contact form or call button", "Mobile-friendly design", "Core Web Vitals optimized", "Basic SEO setup", "Analytics integration", "Social media links", "Clear call to action"],
    idealFor: ["New businesses", "Service promotions", "Campaign launches", "Simple online presence"],
    cta: "Get Your Landing Page",
    accentColor: "#00d4ff", accentRgb: "0,212,255",
    heroBg: "linear-gradient(135deg,#041824 0%,#083048 60%,#041824 100%)",
    es: {
      eyebrow: "Landing Page",
      extendedDesc: "Una landing page es un sitio web de una sola página diseñado para un objetivo específico: promover un servicio, presentar una oferta, capturar leads, recibir llamadas o guiar a los clientes a tomar acción.\n\nEs perfecta para negocios que quieren publicitar un servicio principal, lanzar una promoción, probar una nueva idea o crear una presencia en línea simple sin necesitar un sitio web completo.\n\nCon una landing page, tu negocio puede dar a los clientes la información clave que necesitan de manera rápida, clara y profesional. Sin distracciones. Solo un mensaje claro y una acción clara.",
      includes: ["Una página profesional", "Encabezado y mensaje claro", "Sección de servicio u oferta", "Beneficios e información clave", "Formulario de contacto o botón de llamada", "Diseño compatible con móvil", "Core Web Vitals optimizado", "Configuración básica de SEO", "Integración con Analytics", "Links a redes sociales", "Llamada a la acción clara"],
      idealFor: ["Negocios nuevos", "Promociones de servicios", "Lanzamientos de campaña", "Presencia en línea simple"],
      cta: "Obtén tu Landing Page",
    },
  },
  {
    eyebrow: "Online Store",
    extendedDesc: "An online store is a website where your customers can see your products, learn about them, add them to a cart, and buy directly from your business.\n\nIt is perfect for businesses that sell physical products, digital products, packages, memberships, or services that can be paid for online.\n\nWith an online store, your business can sell beyond your physical location, stay open 24/7, and give customers a simple way to shop from their phone or computer.",
    includes: ["Product pages", "Product images and descriptions", "Shopping cart", "Secure checkout setup", "Payment connection", "Mobile-friendly design", "Basic store organization", "Contact and support information"],
    idealFor: ["Retail businesses", "Handmade & crafts", "Digital products", "Service packages"],
    cta: "Launch Your Online Store",
    accentColor: "#7c3aed", accentRgb: "124,58,237",
    heroBg: "linear-gradient(135deg,#0d0820 0%,#1e0d4a 60%,#0d0820 100%)",
    es: {
      eyebrow: "Tienda en Línea",
      extendedDesc: "Una tienda en línea es un sitio web donde tus clientes pueden ver tus productos, conocerlos, agregarlos al carrito y comprarlos directamente de tu negocio.\n\nEs perfecta para negocios que venden productos físicos, productos digitales, paquetes, membresías o servicios que se pueden pagar en línea.\n\nCon una tienda en línea, tu negocio puede vender más allá de tu ubicación física, estar disponible las 24 horas y darles a los clientes una forma sencilla de comprar desde su celular o computadora.",
      includes: ["Páginas de producto", "Imágenes y descripciones de productos", "Carrito de compras", "Configuración de pago seguro", "Conexión de pasarela de pago", "Diseño compatible con móvil", "Organización básica de tienda", "Información de contacto y soporte"],
      idealFor: ["Negocios minoristas", "Artesanías y manualidades", "Productos digitales", "Paquetes de servicios"],
      cta: "Lanza tu Tienda en Línea",
    },
  },
  {
    eyebrow: "Hosting & Management",
    extendedDesc: "Website hosting is the service that keeps your website online and available for customers to visit at any time.\n\nMany business owners do not want to deal with technical setup, servers, domains, security, emails, or confusing hosting platforms. That is where we help.\n\nWith our hosting management service, we help set up, connect, and manage the basic technical side of your website so your business can stay online, load properly, and look professional. It is perfect for businesses that want a simple, guided solution without dealing with complicated technical steps.",
    includes: ["Domain connection & configuration", "Hosting setup (Bluehost)", "SSL security certificate", "Professional email setup", "Website publishing & testing", "Basic speed optimization", "Monthly uptime monitoring", "Contact form configuration", "Technical support for hosting issues"],
    idealFor: ["New website owners", "Businesses upgrading online", "Non-technical owners", "Any business needing hosting"],
    cta: "Get Hosting & Management",
    accentColor: "#3b82f6", accentRgb: "59,130,246",
    heroBg: "linear-gradient(135deg,#030d24 0%,#0a2060 60%,#030d24 100%)",
    es: {
      eyebrow: "Hosting y Gestión",
      extendedDesc: "El hosting web es el servicio que mantiene tu sitio en línea y disponible para que los clientes lo visiten en cualquier momento.\n\nMuchos dueños de negocios no quieren lidiar con servidores, dominios, seguridad, correos o plataformas de hosting complicadas. Ahí es donde ayudamos.\n\nCon nuestro servicio de gestión de hosting, configuramos y administramos el lado técnico de tu sitio web para que tu negocio esté en línea, cargue correctamente y se vea profesional. Es ideal para negocios que quieren una solución guiada y simple.",
      includes: ["Conexión y configuración de dominio", "Configuración de hosting (Bluehost)", "Certificado de seguridad SSL", "Configuración de correo profesional", "Publicación y prueba del sitio", "Optimización básica de velocidad", "Monitoreo mensual de disponibilidad", "Configuración de formulario de contacto", "Soporte técnico para problemas de hosting"],
      idealFor: ["Nuevos propietarios de sitios", "Negocios actualizando su presencia", "Dueños no técnicos", "Cualquier negocio que necesite hosting"],
      cta: "Obtén Hosting y Gestión",
    },
  },
  {
    eyebrow: "Booking & Contact",
    extendedDesc: "A booking or contact page gives your customers a simple way to reach your business, request information, schedule a service, or ask for a quote.\n\nIt is perfect for businesses that depend on appointments, service requests, consultations, reservations, or direct customer communication.\n\nWith a clear booking or contact page, your customers do not have to search for your phone number, email, location, or next step. Everything they need is organized in one place, making it easier for them to take action.",
    includes: ["Contact form", "Call button", "Email link", "Location & map", "Service request form", "Quote request form", "Booking button or calendar link", "Business hours", "Social media links", "Mobile-friendly design"],
    idealFor: ["Service businesses", "Salons & clinics", "Contractors", "Restaurants & cafes"],
    cta: "Add Booking & Contact",
    accentColor: "#a855f7", accentRgb: "168,85,247",
    heroBg: "linear-gradient(135deg,#1a0535 0%,#2d0a5e 60%,#1a0535 100%)",
    es: {
      eyebrow: "Reservas y Contacto",
      extendedDesc: "Una página de reservas o contacto le da a tus clientes una forma sencilla de comunicarse con tu negocio, solicitar información, agendar un servicio o pedir una cotización.\n\nEs perfecta para negocios que dependen de citas, solicitudes de servicio, consultas, reservaciones o comunicación directa con clientes.\n\nCon una página de reservas o contacto clara, tus clientes no tienen que buscar tu número, correo, ubicación o próximo paso. Todo lo que necesitan está organizado en un solo lugar.",
      includes: ["Formulario de contacto", "Botón de llamada", "Enlace de correo", "Ubicación y mapa", "Formulario de solicitud de servicio", "Formulario de cotización", "Botón de reserva o enlace de calendario", "Horario de atención", "Links a redes sociales", "Diseño compatible con móvil"],
      idealFor: ["Negocios de servicios", "Salones y clínicas", "Contratistas", "Restaurantes y cafés"],
      cta: "Agregar Reservas y Contacto",
    },
  },
  {
    eyebrow: "Website Updates",
    extendedDesc: "If your business already has a website, but it looks outdated, feels confusing, loads slowly, or no longer represents your brand, we can help improve it.\n\nWebsite updates are perfect for businesses that need to refresh their content, replace images, improve sections, fix mobile issues, update services, or make the website look cleaner and more professional.\n\nA few smart updates can make your website easier to understand, easier to use, and more effective for customers who are ready to call, book, visit, or buy.",
    includes: ["Text & content updates", "Image changes", "Service section updates", "Layout improvements", "Mobile fixes", "Button & link updates", "Contact info updates", "Basic speed improvements", "Section cleanup & visual refresh"],
    idealFor: ["Businesses with outdated sites", "Post-rebrand updates", "Seasonal content changes", "Fixing broken elements"],
    cta: "Update My Website",
    accentColor: "#06b6d4", accentRgb: "6,182,212",
    heroBg: "linear-gradient(135deg,#031218 0%,#062836 60%,#031218 100%)",
    es: {
      eyebrow: "Actualizaciones Web",
      extendedDesc: "Si tu negocio ya tiene un sitio web pero se ve desactualizado, confuso, lento o ya no representa tu marca, podemos ayudarte a mejorarlo.\n\nLas actualizaciones de sitio web son perfectas para negocios que necesitan refrescar su contenido, cambiar imágenes, mejorar secciones, arreglar problemas en móvil, actualizar servicios o hacer que el sitio se vea más limpio y profesional.\n\nUnos cuantos cambios inteligentes pueden hacer que tu sitio sea más fácil de entender, más fácil de usar y más efectivo para clientes listos para llamar, reservar, visitar o comprar.",
      includes: ["Actualización de texto y contenido", "Cambio de imágenes", "Actualización de sección de servicios", "Mejoras de diseño", "Correcciones para móvil", "Actualización de botones y enlaces", "Actualización de información de contacto", "Mejoras básicas de velocidad", "Limpieza y refresco visual"],
      idealFor: ["Negocios con sitios desactualizados", "Actualizaciones post-rebranding", "Cambios de contenido de temporada", "Corrección de elementos rotos"],
      cta: "Actualizar mi Sitio Web",
    },
  },
  {
    eyebrow: "Mobile Apps",
    extendedDesc: "A mobile app gives your business a more direct and personalized way to connect with customers from their phones.\n\nIt is perfect for businesses that need more than a website and want to offer features such as customer accounts, bookings, notifications, loyalty programs, online ordering, service requests, or a more customized digital experience.\n\nWith a mobile app, your business can make it easier for customers to interact with your brand, return more often, and access your services in a faster and more convenient way.",
    includes: ["App structure planning", "Mobile-friendly interface design", "Customer account options", "Booking or request features", "Service or product sections", "Push notification options", "Loyalty or rewards features", "Basic app flow design", "Prototype or app development", "Custom features based on project needs"],
    idealFor: ["Restaurants & delivery", "Salons & booking services", "Retail & loyalty programs", "Service businesses"],
    cta: "Build Your Mobile App",
    accentColor: "#059669", accentRgb: "5,150,105",
    heroBg: "linear-gradient(135deg,#022c1e 0%,#065f46 60%,#022c1e 100%)",
    es: {
      eyebrow: "Apps Móviles",
      extendedDesc: "Una app móvil le da a tu negocio una forma más directa y personalizada de conectar con los clientes desde sus teléfonos.\n\nEs perfecta para negocios que necesitan más que un sitio web y quieren ofrecer funciones como cuentas de cliente, reservas, notificaciones, programas de lealtad, pedidos en línea, solicitudes de servicio o una experiencia digital más personalizada.\n\nCon una app móvil, tu negocio puede hacer que sea más fácil para los clientes interactuar con tu marca, regresar más seguido y acceder a tus servicios de forma más rápida y cómoda.",
      includes: ["Planificación de estructura de app", "Diseño de interfaz para móvil", "Opciones de cuenta de cliente", "Funciones de reserva o solicitud", "Secciones de servicios o productos", "Opciones de notificaciones push", "Funciones de lealtad o recompensas", "Diseño básico del flujo de la app", "Prototipo o desarrollo de app", "Funciones personalizadas según el proyecto"],
      idealFor: ["Restaurantes y entregas", "Salones y servicios de reserva", "Retail y programas de lealtad", "Negocios de servicios"],
      cta: "Construye tu App Móvil",
    },
  },
];

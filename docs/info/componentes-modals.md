# Componentes Modales

Modales overlay para visualización de galerías y flujos interactivos. Ubicados en `components/modals/`.

## Índice

| Componente | Archivo | Usado en | Descripción |
|-----------|---------|----------|-------------|
| `ModalsImageSlide` | `components/modals/ImageSlide.vue` | `pages/about.vue` | Slideshow accesible de galería con navegación y cierre por teclado |
| `ModalsSubmitContact` | `components/modals/submitContact.vue` | `pages/contact.vue` | Confirmación y feedback del envío de formulario de contacto |

*Nota arquitectónica (U-SEO-001)*: El modal legacy `ModalsProjectShow` fue eliminado en favor de rutas y páginas estáticas completas prerenderizadas en SSG (`pages/projects/[...slugs].vue`), asegurando indexación SEO completa, URLs canónicas únicas, esquemas Schema.org y eliminación de bloqueos de scroll artificiales.

## `ModalsImageSlide` — Galería de imágenes

Slideshow modal para la galería de fotos de la página "Sobre Mí".

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `show` | `boolean` | Visibilidad del modal |
| `galleryPaths` | `GalleryPathType[]` | Array de rutas thumbnail/image con textos alternativos descriptivos |
| `selectedIndex` | `number` | Índice de la imagen seleccionada |

### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:show` | `boolean` | Cierra el modal |

### Funcionalidad

- Navegación entre imágenes (anterior/siguiente) con botones accesibles (`aria-label`).
- Cierre mediante clic en fondo o pulsación de tecla `Escape`.
- Dimensiones controladas y `100dvh` para evitar overflow en pantallas móviles.
- Integración con `useModalAccessibility`: bloqueo de scroll en el fondo, trampa de foco accesible y retorno del foco al elemento desencadenante al cerrar.

## `ModalsSubmitContact` — Confirmación de contacto

Modal multi-paso accesible para la confirmación previa, estado de carga y resultado del formulario de contacto.

### Pasos

1. **Paso 1 (Resumen)**: muestra un desglose de los datos introducidos (nombre, email, asunto y mensaje) para confirmación explícita del usuario.
2. **Paso 2 (Procesando)**: indicador de espera accesible con spinner CSS animado que respeta `prefers-reduced-motion` (sustituye GIFs animados pesados).
3. **Paso 3 (Resultado)**:
   - **Éxito**: confirmación visual con icono accesible y mensaje informativo.
   - **Error**: desglose de errores normalizados (`formattedErrors`) procedentes de la validación del servidor o captcha.

### Accesibilidad y diseño

- Diseñado íntegramente con tokens semánticos de "Silicon Architect" (`bg-surface-container`, `text-primary`, `border-outline-variant`).
- Gestión de accesibilidad con `useModalAccessibility`: scroll lock en body, trampa de foco (focus trap) ciclando elementos interactivos, y restauración de foco al cerrar.
- Gestión de teclado: cierre con tecla `Escape` (`cancel` en paso 1, `finished` en paso 3).
- Atributos ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="submit-contact-title"`.

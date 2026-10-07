# Página Principal (Home / Landing)

Landing page estática del portfolio con hero, ecosistema tecnológico, especializaciones, stack técnico, CTA y redes sociales.

## Archivos principales

| Archivo           | Rol              |
| ----------------- | ---------------- |
| `pages/index.vue` | Página principal |

## Ruta

- **URL**: `/`
- **Datos**: 100% estáticos (no consume API)

## Secciones del template

| Sección                      | Descripción                                                                                                                                                        | Componentes usados                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Hero**                     | Presentación con nombre, título, descripción, franja de métricas de impacto (+15 años, 7 años empresa, IA, 100+ repos) y CTAs (`/projects`, `CV Online`, `/about`) | —                                                                                                                              |
| **Ecosistema Principal**     | Badges hexagonales de tecnologías core (PHP, Laravel, Vue, JS, PostgreSQL)                                                                                         | `StackBadgeHexagon`, `NuxtImg`                                                                                                 |
| **Pasión Open Source & IoT** | Storytelling FOSS & Maker con CTAs + mosaico 2x2 de hitos y hardware (+20 años open source, +100 repos, microcontroladores ESP32/Pi, diseño 3D)                    | `UiMaterialIcon`, `NuxtLink`                                                                                                   |
| **Especializaciones**        | Grid 3 columnas: Sistemas Distribuidos IoT, Arquitectura Backend, Automatización                                                                                   | —                                                                                                                              |
| **Áreas de Especialidad**    | Grid bento: Backend & Arquitectura (destacado), IA & Automatización, Frontend Reactivo, Bases de Datos, Sistemas & DevOps                                          | —                                                                                                                              |
| **CTA**                      | Call-to-action con enlace a contacto y email                                                                                                                       | —                                                                                                                              |
| **Redes Sociales**           | Iconos de redes sociales con decoraciones y enlace a `/social/`                                                                                                    | `IconsYoutube`, `IconsLinkedin`, `IconsTwitch`, `IconsGitlab`, `IconsGithub`, `IconsMastodon`, `IconsTwitter`, `IconsTelegram` |

## SEO

```typescript
useHead({
    title: 'Raúl Caro Pastorino - Desarrollador Web Backend',
    meta: [
        { name: 'description', content: 'Portfolio de Raúl Caro Pastorino...' },
        { name: 'keywords', content: 'Raúl Caro Pastorino, raupulus, ...' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        // ...og:title, og:description
    ],
});
```

## Relaciones con otros módulos

- → [componentes-ui.md](./componentes-ui.md): `StackBadgeHexagon`
- → [componentes-icons.md](./componentes-icons.md): todos los iconos de redes sociales
- → [design-system.md](./design-system.md): `circuit-pattern`, `glass-panel`, tokens de color

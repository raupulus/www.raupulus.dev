# Componentes de Iconos

Iconos SVG como componentes Vue para redes sociales e iconos genéricos. Ubicados en `components/icons/`.

## Índice

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `IconsGeneric` | `components/icons/Generic.vue` | Icono SVG genérico base |
| `IconsGenericSocial` | `components/icons/GenericSocial.vue` | Wrapper social con hover y enlace |
| `IconsEarth` | `components/icons/Earth.vue` | Icono de globo terráqueo (web) |
| `IconsGithub` | `components/icons/Github.vue` | Logo GitHub |
| `IconsGitlab` | `components/icons/Gitlab.vue` | Logo GitLab |
| `IconsYoutube` | `components/icons/Youtube.vue` | Logo YouTube |
| `IconsLinkedin` | `components/icons/Linkedin.vue` | Logo LinkedIn |
| `IconsTwitter` | `components/icons/Twitter.vue` | Logo Twitter/X |
| `IconsTwitch` | `components/icons/Twitch.vue` | Logo Twitch |
| `IconsMastodon` | `components/icons/Mastodon.vue` | Logo Mastodon |
| `IconsTelegram` | `components/icons/Telegram.vue` | Logo Telegram |
| `IconsInfo` | `components/icons/Info.vue` | Icono de información |

## Props comunes

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `string` | — | Tamaño del icono (ej. `"80px"`) |
| `decored` | `boolean` | `false` | Muestra decoración alrededor del icono |

## Uso típico

```vue
<!-- En pages/index.vue (sección redes sociales) -->
<IconsYoutube size="80px" :decored="true" />
<IconsLinkedin size="80px" :decored="true" />
<IconsGithub size="80px" :decored="true" />
```

## Convenciones

- Cada icono es un componente SVG inline (no archivos .svg externos)
- Los componentes de redes sociales enlazan directamente al perfil del autor
- Colores adaptados al design system (primary, tertiary, etc.)

## Relaciones con otros módulos

- → [pagina-home.md](./pagina-home.md): sección de redes sociales del landing
- → [design-system.md](./design-system.md): colores del design system

## UiMaterialIcon (`components/ui/MaterialIcon.vue`)

Componente para los iconos Material Symbols como SVG inline self-hosted (sustituye a la fuente de iconos de Google). Uso: `<UiMaterialIcon name="memory" class="text-primary text-4xl" />`. Los SVG están en `assets/icons/material/`; ver detalles en [design-system.md](./design-system.md).

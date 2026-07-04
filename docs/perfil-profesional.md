# Informe de perfil profesional — Raúl Caro Pastorino (@raupulus)

> Elaborado a partir de fuentes públicas: este repositorio (ramas `main` y `dev`),
> el perfil y repositorios de [GitHub](https://github.com/raupulus), el perfil de
> [GitLab](https://gitlab.com/raupulus) y el README público de perfil.
> LinkedIn no es accesible sin sesión, por lo que no se ha incluido su contenido.
> Solo contiene información pública.

## Resumen ejecutivo

Raúl Caro Pastorino es un **desarrollador web full stack con especialización clara en
backend**, centrado en el ecosistema **PHP/Laravel con PostgreSQL**, con una segunda
línea de trabajo muy consolidada en **Python aplicado a IoT** y una fuerte identidad
como **defensor del software libre** (activo en open source, con proyectos publicados
desde hace más de una década y GitHub desde 2015; él mismo sitúa su vínculo con el
open source en 2001). Ubicado en Chipiona (Cádiz, España).

> Nota: por decisión del autor, este informe no menciona empleadores.

## Identidad profesional (tal y como se presenta en raupulus.dev)

- **Titular**: "Desarrollador Web Backend especializado en PHP/Laravel, Python, IoT y
  sistemas distribuidos".
- En la página "Sobre mí": *"desarrollador backend con amplia experiencia en PHP,
  Laravel, Javascript y PostgreSQL"*, con experiencia desde pequeños sitios web hasta
  aplicaciones empresariales.
- Habilidades que destaca: creación de APIs, gestión de MySQL/PostgreSQL, optimización
  de rendimiento, prácticas de seguridad, administración Linux desde terminal
  (VPS, caché, pasarelas de pago, streaming, servicios de IA), trabajo en equipo.
- Especializaciones que publica en la home: sistemas distribuidos IoT (MQTT/AMQP),
  arquitectura backend (microservicios, APIs REST) y automatización de sistemas
  (CI/CD, scripting).

## Evidencias técnicas del stack Laravel + PostgreSQL

La especialización declarada está respaldada por proyectos reales y verificables:

| Evidencia | Detalle |
|-----------|---------|
| `api.raupulus.dev` | API propia en Laravel que alimenta el portfolio (contenidos, proyectos, CV, formulario de contacto con reCAPTCHA validado en servidor y CSRF de Sanctum) |
| `www.jaja.raupulus.dev` | Proyecto Laravel con panel **Filament** y API de comunidad (chistes/adivinanzas) |
| `api-fryntiz` (GitLab) | API con información en tiempo real de sus webs |
| Este portfolio | Nuxt 4 SSG que consume su API Laravel; el propio autor separa frontend estático y backend API |
| Seguridad server-side | Su API implementa validación de origen, bloqueo de IPs y alertas al administrador ante peticiones sospechosas (verificado durante el desarrollo de este repo) |

## Stack tecnológico (según sus perfiles públicos)

- **Backend**: PHP, Laravel, Python, Node.js
- **Frontend**: JavaScript, TypeScript, Vue.js, Nuxt, Angular
- **Bases de datos**: PostgreSQL, MariaDB, MySQL
- **IoT / hardware**: ESP32, Raspberry Pi (incl. Pico/Micropython), Arduino, sensores, LoRaWAN
- **Sistemas**: Debian GNU/Linux (principal), Fedora, Gentoo, macOS; Bash avanzado
- **DevOps**: pipelines CI/CD (GoCD en este proyecto), Apache/Nginx, despliegues automatizados, scripting de servidores

Distribución de lenguajes en sus ~157 repos públicos de GitHub (mirror de GitLab,
que usa como forja principal): Python (38), PHP (11), Vue (8), JavaScript (8),
Shell (7), C++ (6), HTML, TypeScript, Blade.

## Open source, comunidad y divulgación

- **GitHub**: 157 repositorios públicos, 152 seguidores. Destacados:
  `javascript-ejercicios-resueltos` (59★), `bash-guide-style` (26★, guía de estilo
  Bash en español), `ShellScript` (18★), `debian-developer-conf` (17★).
- **GitLab** (forja principal): más de 100 proyectos públicos, muchos con mirror en GitHub.
- **Proyectos IoT/maker publicados**: estación meteorológica con Raspberry Pi,
  monitor de energía con RPi Pico, detector de rayos (AS3935), bonsái inteligente
  con ESP32, asistente en malla LoRaWAN, CryptoWatchdog, KeyCounter.
- **Divulgación**: La Guía Linux (laguialinux.es, proyecto de documentación sobre
  GNU/Linux y software libre), micro-blog personal, canal de YouTube, directos en
  Twitch y canal de difusión en Telegram sobre tecnología y Linux.

## Rasgos diferenciales

1. **Perfil backend con producto completo**: no solo APIs — diseña, despliega y
   opera su propia infraestructura (VPS, servidores web, CI/CD, seguridad).
2. **Puente software–hardware**: pocos desarrolladores Laravel documentan tantos
   proyectos IoT reales integrados con sus propias APIs.
3. **Cultura de documentación**: guías de estilo propias (Bash), documentación
   técnica por módulos en sus proyectos y contenido divulgativo en español.
4. **Compromiso open source sostenido**: actividad pública continua, mirrors
   GitLab→GitHub y proyectos reutilizables (plantillas para RPi Pico, scripts Debian).

## Fuentes

- Este repositorio (`main` y `dev`): páginas `about`, `index`, `webs`, `social` y documentación
- https://github.com/raupulus (perfil, README de perfil y API pública de GitHub)
- https://gitlab.com/raupulus (API pública de GitLab)
- https://raupulus.dev

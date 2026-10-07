<template>
    <div class="min-h-screen bg-background text-on-surface py-16 px-6 sm:px-8">
        <article class="max-w-4xl mx-auto space-y-10">
            <!-- Encabezado -->
            <header class="border-b border-outline-variant/20 pb-8">
                <span class="font-label text-xs uppercase tracking-[0.3em] text-secondary font-bold block mb-2">
                    Transparencia y Gestión de Cookies
                </span>
                <h1 class="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                    Política de <span class="text-on-surface font-light">Cookies</span>
                </h1>
                <p class="mt-4 text-sm font-label uppercase tracking-widest text-outline">
                    Última actualización: 6 de octubre de 2026 · Conforme al art. 22.2 de la LSSI-CE y directrices del
                    CEPD/AEPD
                </p>
            </header>

            <!-- Introducción -->
            <section class="space-y-4 text-on-surface-variant leading-relaxed">
                <p>
                    En este sitio web (<NuxtLink to="/" class="text-primary hover:underline">raupulus.dev</NuxtLink>)
                    utilizamos cookies y tecnologías similares para garantizar el funcionamiento técnico del servicio y,
                    únicamente si usted lo autoriza expresamente, para analizar el tráfico y la navegación en el sitio.
                </p>
                <p>
                    Las cookies son pequeños archivos de texto que se descargan y almacenan en su navegador o
                    dispositivo al acceder a determinadas páginas web. Permiten registrar información técnica de
                    navegación para recordar preferencias, mantener sesiones seguras o generar estadísticas agregadas.
                </p>
            </section>

            <!-- Panel de gestión rápida -->
            <section
                class="p-6 bg-surface-container-high rounded-xl border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div>
                    <h2 class="font-headline text-lg font-bold text-on-surface">Configuración de Cookies</h2>
                    <p class="text-xs text-on-surface-variant mt-1">
                        Puede revisar, modificar o retirar su consentimiento para el uso de cookies analíticas en
                        cualquier momento.
                    </p>
                </div>
                <button
                    type="button"
                    class="shrink-0 px-6 py-3 bg-primary text-on-primary font-headline text-xs font-bold uppercase tracking-widest rounded hover:bg-primary-container transition-colors cursor-pointer"
                    @click="openCookieModal"
                >
                    Gestionar Consentimiento
                </button>
            </section>

            <!-- Tipos de cookies utilizadas -->
            <section class="space-y-6 text-on-surface-variant leading-relaxed">
                <h2 class="font-headline text-2xl font-bold text-on-surface">
                    1. Tipos de cookies utilizadas en este sitio web
                </h2>

                <!-- Cookies necesarias -->
                <div class="space-y-3">
                    <h3 class="font-headline text-lg font-bold text-secondary">
                        A) Cookies Técnicas y Estrictamente Necesarias (Exentas de Consentimiento)
                    </h3>
                    <p class="text-sm">
                        Son indispensables para el funcionamiento técnico de la web, la navegación y la seguridad de las
                        peticiones. No requieren consentimiento previo del usuario según el art. 22.2 LSSI.
                    </p>
                    <div class="overflow-x-auto">
                        <table
                            class="w-full text-left text-sm border-collapse border border-outline-variant/30 rounded-lg overflow-hidden"
                        >
                            <caption class="sr-only">
                                Listado de cookies técnicas necesarias
                            </caption>
                            <thead
                                class="bg-surface-container-high font-label text-xs uppercase tracking-wider text-outline"
                            >
                                <tr>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Nombre</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Proveedor</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Finalidad</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Duración</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">ncc_c</td>
                                    <td class="p-3">raupulus.dev</td>
                                    <td class="p-3">
                                        Guarda el registro de si el usuario ha interactuado con el banner de cookies y
                                        ha tomado una decisión.
                                    </td>
                                    <td class="p-3">1 año</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">ncc_e</td>
                                    <td class="p-3">raupulus.dev</td>
                                    <td class="p-3">
                                        Almacena las categorías de cookies que el usuario ha habilitado voluntariamente.
                                    </td>
                                    <td class="p-3">1 año</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">XSRF-TOKEN</td>
                                    <td class="p-3">raupulus.dev</td>
                                    <td class="p-3">
                                        Protege contra ataques de falsificación de petición en sitios cruzados (CSRF) al
                                        enviar el formulario.
                                    </td>
                                    <td class="p-3">Sesión</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Cookies analíticas -->
                <div class="space-y-3">
                    <h3 class="font-headline text-lg font-bold text-tertiary">
                        B) Cookies Analíticas (Requieren Consentimiento Previo)
                    </h3>
                    <p class="text-sm">
                        Permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la
                        utilización del sitio web. Se configuran con <strong>Google Consent Mode v2</strong>,
                        manteniéndose bloqueadas por defecto hasta que el usuario hace clic en «Aceptar todas» o las
                        activa voluntariamente en el panel de configuración.
                    </p>
                    <div class="overflow-x-auto">
                        <table
                            class="w-full text-left text-sm border-collapse border border-outline-variant/30 rounded-lg overflow-hidden"
                        >
                            <caption class="sr-only">
                                Listado de cookies analíticas
                            </caption>
                            <thead
                                class="bg-surface-container-high font-label text-xs uppercase tracking-wider text-outline"
                            >
                                <tr>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Nombre</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Proveedor</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Finalidad</th>
                                    <th scope="col" class="p-3 border border-outline-variant/20">Duración</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">_ga</td>
                                    <td class="p-3">Google LLC (Analytics)</td>
                                    <td class="p-3">
                                        Distingue usuarios únicos recopilando un identificador anónimo de cliente.
                                    </td>
                                    <td class="p-3">2 años</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">_gid</td>
                                    <td class="p-3">Google LLC (Analytics)</td>
                                    <td class="p-3">
                                        Distingue usuarios en períodos de 24 horas para recuentos de sesión diarios.
                                    </td>
                                    <td class="p-3">24 horas</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-xs font-bold text-primary">_ga_*</td>
                                    <td class="p-3">Google LLC (Analytics)</td>
                                    <td class="p-3">
                                        Mantiene el estado de la sesión para el flujo de métricas en Google Analytics 4.
                                    </td>
                                    <td class="p-3">2 años</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- 2. Cómo revocar el consentimiento -->
            <section class="space-y-4 text-on-surface-variant leading-relaxed">
                <h2 class="font-headline text-2xl font-bold text-on-surface">
                    2. Opciones de consentimiento, revocación y persistencia
                </h2>
                <p class="text-sm">
                    En su primera visita a este sitio web se muestra un banner de información con tres opciones claras y
                    visibles al mismo nivel:
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-sm">
                    <li>
                        <strong>Aceptar todas:</strong> Concede autorización para la instalación y uso de las cookies
                        técnicas y analíticas.
                    </li>
                    <li>
                        <strong>Rechazar todas:</strong> Deniega expresamente el uso de cualquier cookie analítica u
                        opcional. Se almacena únicamente la cookie técnica necesaria (<code class="font-mono text-xs"
                            >ncc_c</code
                        >) para recordar su decisión, sin reiterar el aviso en futuras visitas.
                    </li>
                    <li>
                        <strong>Configurar:</strong> Abre un panel modal donde puede habilitar o inhabilitar
                        individualmente cada categoría de cookies.
                    </li>
                </ul>
                <p class="text-sm">
                    Puede revisar, modificar o revocar su consentimiento en cualquier momento mediante el botón flotante
                    permanente situado en la esquina inferior del sitio web o utilizando el botón «Gestionar
                    Consentimiento» de esta página. Al revocar el consentimiento, el sistema actualiza automáticamente
                    su estado a denegado (Google Consent Mode v2) y elimina del navegador las cookies de analítica
                    asociadas.
                </p>
            </section>

            <!-- 3. Desactivación desde el navegador -->
            <section class="space-y-4 text-on-surface-variant leading-relaxed">
                <h2 class="font-headline text-2xl font-bold text-on-surface">
                    3. Gestión de cookies desde la configuración del navegador
                </h2>
                <p class="text-sm">
                    También puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante las
                    opciones de configuración de su navegador de Internet:
                </p>
                <ul class="list-disc pl-6 space-y-1.5 text-sm">
                    <li>
                        <strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros
                        datos de sitios.
                    </li>
                    <li>
                        <strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y Seguridad &gt; Cookies y datos del
                        sitio.
                    </li>
                    <li>
                        <strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.
                    </li>
                    <li>
                        <strong>Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos del
                        sitio.
                    </li>
                </ul>
            </section>

            <!-- 4. Más información -->
            <section class="space-y-3 bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
                <h2 class="font-headline text-xl font-bold text-on-surface">4. Más información sobre privacidad</h2>
                <p class="text-sm text-on-surface-variant">
                    Para conocer el tratamiento general de datos personales y cómo ejercer sus derechos de acceso,
                    rectificación, supresión y oposición, consulte nuestra
                    <NuxtLink to="/privacy/" class="text-primary hover:underline">Política de Privacidad</NuxtLink>
                    o contacte a través de
                    <a href="mailto:public@raupulus.dev" class="text-primary hover:underline">public@raupulus.dev</a>.
                </p>
            </section>

            <!-- Footer navegación -->
            <footer
                class="pt-8 border-t border-outline-variant/20 flex flex-wrap gap-4 justify-between items-center text-xs font-label uppercase tracking-widest text-outline"
            >
                <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-2">
                    <UiMaterialIcon name="arrow_forward" class="rotate-180 text-sm" />
                    Volver al Inicio
                </NuxtLink>
                <NuxtLink to="/privacy/" class="hover:text-primary transition-colors">
                    Ver Política de Privacidad
                </NuxtLink>
            </footer>
        </article>
    </div>
</template>

<script lang="ts" setup>
    const runtimeConfig = useRuntimeConfig();
    const url = runtimeConfig.public.app.url;

    const cookieControl = useCookieControl();

    const openCookieModal = () => {
        cookieControl.isModalActive.value = true;
    };

    const title = 'Política de Cookies · Raúl Caro Pastorino';
    const description =
        'Información detallada sobre las cookies técnicas y analíticas utilizadas en el sitio web de Raúl Caro Pastorino y cómo gestionarlas.';
    const keywords =
        'política de cookies, cookies analíticas, cookies técnicas, LSSI, consentimiento, Raúl Caro Pastorino';

    useHead({
        title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'robots', content: 'index, follow' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: `${url}/cookies/` },
            { property: 'og:image', content: `${url}/social/privacy.webp` },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: `${url}/social/privacy.webp` },
        ],
        link: [{ rel: 'canonical', href: `${url}/cookies/` }],
    });
</script>

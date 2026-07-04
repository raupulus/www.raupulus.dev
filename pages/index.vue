<template>
    <div class="circuit-pattern">
        <!-- ===== HERO ===== -->
        <section class="relative min-h-[80vh] flex items-center px-8 overflow-hidden">
            <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container rounded-full blur-[128px]"/>
                <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary-container rounded-full blur-[128px]"/>
            </div>

            <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 z-10">
                <!-- Texto principal -->
                <div class="lg:col-span-8 flex flex-col justify-center">
                    <span class="font-label text-tertiary tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                        <span class="w-12 h-[1px] bg-tertiary"/>
                        Desarrollador Web &amp; Maker
                    </span>
                    <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] text-on-surface mb-8">
                        Raúl Caro
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">
                            Pastorino
                        </span>
                    </h1>
                    <p class="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                        Desarrollador Web Backend especializado en PHP/Laravel, Python, IoT y sistemas distribuidos.
                        Apasionado del Open Source desde 2001, construyendo herramientas y proyectos que marcan la diferencia.
                    </p>
                    <div class="flex flex-wrap gap-6">
                        <NuxtLink
                            to="/projects"
                            class="px-8 py-4 bg-primary text-on-primary font-headline font-bold rounded hover:bg-primary-container transition-colors tracking-widest uppercase text-sm"
                        >
                            Ver Proyectos
                        </NuxtLink>
                        <NuxtLink
                            to="/about"
                            class="px-8 py-4 border border-outline-variant hover:border-primary transition-all rounded font-headline font-bold text-on-surface tracking-widest uppercase text-sm"
                        >
                            Sobre Mí
                        </NuxtLink>
                    </div>
                </div>

                <!-- Decoración derecha -->
                <div class="lg:col-span-4 flex items-center justify-center relative">
                    <div class="relative w-full aspect-square max-w-md">
                        <div class="absolute inset-0 glass-panel rounded-xl border border-outline-variant/30 flex items-center justify-center p-8">
                            <div class="w-full h-full relative border border-dashed border-tertiary/20 rounded-full flex items-center justify-center p-12">
                                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-tertiary animate-pulse shadow-[0_0_15px_rgba(76,214,255,0.8)]"/>
                                <div class="w-full h-full border border-primary/40 rounded-full flex items-center justify-center">
                                    <UiMaterialIcon class="text-7xl text-primary" name="memory" />
                                </div>
                            </div>
                        </div>
                        <div class="absolute -top-4 -right-4 glass-panel px-4 py-2 border border-secondary/40 rounded-lg">
                            <span class="font-label text-xs text-secondary tracking-widest">SISTEMA_ESTABLE</span>
                        </div>
                        <div class="absolute -bottom-6 -left-4 glass-panel px-4 py-2 border border-tertiary/40 rounded-lg flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-tertiary"/>
                            <span class="font-label text-xs text-on-surface tracking-widest uppercase">Latencia: 12ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== CORE ECOSYSTEM (hexágonos originales) ===== -->
        <section class="py-24 px-8 bg-surface-container-low">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 class="font-headline text-4xl font-bold tracking-tight text-primary mb-4">Ecosistema Principal</h2>
                        <p class="text-on-surface-variant max-w-md">
                            Un stack de precisión para computación de alto rendimiento y flujo de datos en tiempo real.
                        </p>
                    </div>
                    <div class="font-label text-outline text-sm tracking-widest uppercase">
                        Protocolo: MQTT | REST | Protobuf
                    </div>
                </div>

                <!-- Hexágonos estáticos originales -->
                <div style="text-align: center;">
                    <StackBadgeHexagon text="PHP" color="#777bb3" color-light="#9b9fd8">
                        <NuxtImg
src="/images/technologies/php_60x60.webp" format="webp" width="60" height="60" quality="90"
                            title="Lenguaje de Programación PHP" alt="Lenguaje de Programación PHP" />
                    </StackBadgeHexagon>

                    <StackBadgeHexagon text="Laravel" color="#c54b4b" color-light="#d56565">
                        <NuxtImg
src="/images/technologies/laravel_60x60.webp" format="webp" width="60" height="60" quality="90"
                            title="Framework Laravel" alt="Framework Laravel" />
                    </StackBadgeHexagon>

                    <div class="inline-block">
                        <StackBadgeHexagon text="Vue" color="#2f3239" color-light="#454850">
                            <NuxtImg
src="/images/technologies/vuejs_60x60.webp" format="webp" width="60" height="60" quality="90"
                                title="Framework VueJs" alt="Framework VueJs" />
                        </StackBadgeHexagon>

                        <StackBadgeHexagon text="Javascript" color="#d7af21" color-light="#e9c853">
                            <NuxtImg
src="/images/technologies/javascript_60x60.webp" format="webp" width="60" height="60"
                                quality="90" title="Lenguaje de Programación Javascript"
                                alt="Lenguaje de Programación Javascript" />
                        </StackBadgeHexagon>

                        <StackBadgeHexagon text="PostgreSQL" color="#336791" color-light="#68ace4">
                            <NuxtImg
src="/images/technologies/postgresql_60x60.webp" format="webp" width="60" height="60"
                                quality="90" title="Bases de datos PostgreSQL" alt="Bases de datos PostgreSQL" />
                        </StackBadgeHexagon>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== PASIÓN OPEN SOURCE & IoT ===== -->
        <section class="py-32 px-8 overflow-hidden">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-4xl md:text-5xl font-headline font-bold mb-8 text-on-background">
                        Pasión por el <span class="text-tertiary">Código Abierto</span> &amp; IoT
                    </h2>
                    <p class="text-on-surface-variant text-lg leading-relaxed mb-6">
                        No solo escribo código; construyo ecosistemas. Mi compromiso con el Open Source me lleva a
                        desarrollar herramientas que democratizan el acceso al control de hardware mediante
                        protocolos como MQTT y Protobuf.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                        <div class="p-6 bg-surface-container-high rounded-lg border-l-2 border-secondary hover:bg-surface-container-highest transition-colors group">
                            <UiMaterialIcon class="text-secondary mb-2 block group-hover:scale-110 transition-transform" name="memory" />
                            <div class="font-headline font-bold text-lg mb-1">Hardware Agnóstico</div>
                            <p class="text-sm text-outline">Integración sin fisuras entre diversos controladores industriales.</p>
                        </div>
                        <div class="p-6 bg-surface-container-high rounded-lg border-l-2 border-tertiary hover:bg-surface-container-highest transition-colors group">
                            <UiMaterialIcon class="text-tertiary mb-2 block group-hover:scale-110 transition-transform" name="hub" />
                            <div class="font-headline font-bold text-lg mb-1">Estándares Abiertos</div>
                            <p class="text-sm text-outline">Defendiendo la interoperabilidad y soberanía tecnológica.</p>
                        </div>
                    </div>
                </div>
                <div class="relative group">
                    <div class="absolute -inset-4 bg-tertiary/10 rounded-xl blur-2xl group-hover:bg-tertiary/20 transition-all"/>
                    <div class="relative rounded-xl border border-outline-variant/30 shadow-2xl w-full aspect-[4/3] bg-surface-container-high flex items-center justify-center overflow-hidden">
                        <UiMaterialIcon class="text-9xl text-primary/20" name="developer_board" />
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== ESPECIALIZACIONES ===== -->
        <section class="py-24 px-8 bg-surface-container-lowest">
            <div class="max-w-7xl mx-auto">
                <div class="mb-20 text-center">
                    <h2 class="font-headline text-5xl font-black tracking-tighter mb-4">ESPECIALIZACIONES</h2>
                    <div class="w-24 h-1 bg-secondary mx-auto"/>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 border border-outline-variant/20 rounded-xl overflow-hidden">
                    <div class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors border-b md:border-b-0 md:border-r border-outline-variant/10">
                        <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UiMaterialIcon class="text-primary" name="hub" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">Sistemas Distribuidos IoT</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Diseño de redes mesh y brokers de alta disponibilidad para millones de dispositivos conectados usando protocolos MQTT y AMQP.
                        </p>
                        <div class="mt-auto px-4 py-1.5 border border-primary/30 rounded-full font-label text-[10px] tracking-widest text-primary uppercase">
                            Sinergia Hardware
                        </div>
                    </div>
                    <div class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors border-b md:border-b-0 md:border-r border-outline-variant/10">
                        <div class="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UiMaterialIcon class="text-tertiary" name="dns" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">Arquitectura Backend</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Construcción de microservicios escalables y APIs RESTful que priorizan seguridad, velocidad y documentación mantenible.
                        </p>
                        <div class="mt-auto px-4 py-1.5 border border-tertiary/30 rounded-full font-label text-[10px] tracking-widest text-tertiary uppercase">
                            Infraestructura Cloud
                        </div>
                    </div>
                    <div class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors">
                        <div class="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UiMaterialIcon class="text-secondary" name="terminal" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">Automatización de Sistemas</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Desarrollo de herramientas personalizadas y pipelines CI/CD para garantizar despliegues rápidos y ciclos de testing robustos para firmware y software.
                        </p>
                        <div class="mt-auto px-4 py-1.5 border border-secondary/30 rounded-full font-label text-[10px] tracking-widest text-secondary uppercase">
                            Ingeniería de Procesos
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== NÚCLEO TECNOLÓGICO ===== -->
        <section class="py-32 px-8">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <span class="font-label text-secondary tracking-widest text-xs uppercase mb-4 block">Stack Tecnológico</span>
                        <h2 class="text-4xl md:text-6xl font-headline font-black tracking-tighter">NÚCLEO TECNOLÓGICO</h2>
                    </div>
                    <div class="text-right">
                        <p class="text-outline text-sm font-label uppercase tracking-widest">Eficiencia y Escala</p>
                        <p class="text-outline-variant text-xs font-label tracking-tighter uppercase">v.2.4.0_Estable</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <!-- PHP/Laravel principal -->
                    <div class="md:col-span-2 md:row-span-2 p-10 bg-surface-container-high rounded-xl border border-outline-variant/20 flex flex-col justify-between group hover:border-primary/50 transition-all duration-500 shadow-xl">
                        <div>
                            <div class="flex items-center gap-4 mb-8">
                                <div class="w-16 h-16 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/30 text-primary">
                                    <UiMaterialIcon class="text-4xl" name="terminal" />
                                </div>
                                <h3 class="text-3xl font-headline font-bold">PHP &amp; Laravel</h3>
                            </div>
                            <p class="text-on-surface-variant text-lg leading-relaxed">
                                Arquitecturas backend de alto rendimiento, optimización de consultas SQL complejas
                                y sistemas empresariales escalables. Especialista en Laravel Octane para procesos
                                de alta concurrencia.
                            </p>
                        </div>
                        <div class="mt-8 flex flex-wrap gap-3">
                            <span class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20">Clean Code</span>
                            <span class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20">SOLID</span>
                            <span class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20">TDD</span>
                        </div>
                    </div>
                    <!-- Python -->
                    <div class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group">
                        <UiMaterialIcon class="text-tertiary mb-4 block group-hover:scale-110 transition-transform" name="integration_instructions" />
                        <h4 class="font-headline font-bold text-xl mb-2">Python</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">Automatización, procesamiento intensivo de datos e interfaz con hardware.</p>
                    </div>
                    <!-- Vue.js -->
                    <div class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group">
                        <UiMaterialIcon class="text-secondary mb-4 block group-hover:scale-110 transition-transform" name="layers" />
                        <h4 class="font-headline font-bold text-xl mb-2">Vue.js</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">Interfaces interactivas para dashboards IoT complejos en tiempo real.</p>
                    </div>
                    <!-- PostgreSQL -->
                    <div class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group">
                        <UiMaterialIcon class="text-primary mb-4 block group-hover:scale-110 transition-transform" name="database" />
                        <h4 class="font-headline font-bold text-xl mb-2">PostgreSQL</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">Diseño relacional y optimización de datos de series temporales.</p>
                    </div>
                    <!-- Bash & Ops -->
                    <div class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group">
                        <UiMaterialIcon class="text-outline mb-4 block group-hover:scale-110 transition-transform" name="settings_ethernet" />
                        <h4 class="font-headline font-bold text-xl mb-2">Bash &amp; Ops</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">Hardening de servidores, pipelines CI/CD y orquestación.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== CTA ===== -->
        <section class="py-32 px-8 relative">
            <div class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"/>
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <h2 class="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                    ¿Listo para construir la <span class="italic text-primary">infraestructura central</span> de tu próximo proyecto?
                </h2>
                <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <NuxtLink
                        to="/contact"
                        class="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black tracking-widest uppercase text-sm rounded transition-transform hover:scale-105"
                    >
                        Iniciar Contacto
                    </NuxtLink>
                    <div class="flex items-center gap-4 px-6 py-4 border border-outline-variant/30 rounded glass-panel">
                        <UiMaterialIcon class="text-tertiary" name="alternate_email" />
                        <span class="font-label text-sm text-on-surface-variant select-all">public@raupulus.dev</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== REDES SOCIALES (iconos originales) ===== -->
        <section class="py-20 px-8 border-t border-outline-variant/10">
            <div class="max-w-7xl mx-auto">
                <div class="block text-center">
                    <div class="mb-12">
                        <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-center mb-4">Redes Sociales</h2>
                        <div class="w-24 h-1 bg-tertiary mx-auto"/>
                    </div>

                    <div class="box-social-icons inline-block">
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsYoutube size="80px" :decored="true" />
                        </div>
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsLinkedin size="80px" :decored="true" />
                        </div>
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsTwitch size="80px" :decored="true" />
                        </div>
                    </div>

                    <div class="box-social-icons inline-block">
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsGitlab size="80px" :decored="true" />
                        </div>
                    </div>

                    <div class="box-social-icons inline-block">
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsGithub size="80px" :decored="true" />
                        </div>
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsMastodon size="80px" :decored="true" />
                        </div>
                        <div class="inline-block mx-4 my-[15px]">
                            <IconsTwitter size="80px" :decored="true" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
// SEO de la página principal
useHead({
    title: 'Raúl Caro Pastorino - Desarrollador Web Backend',
    meta: [
        { name: 'description', content: 'Portfolio de Raúl Caro Pastorino (@raupulus), Desarrollador Web Backend especializado en PHP/Laravel, IoT, Python y sistemas distribuidos.' },
        { name: 'keywords', content: 'Raúl Caro Pastorino, raupulus, desarrollador web, backend, PHP, Laravel, IoT, Python, Vue.js' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Raúl Caro Pastorino - Desarrollador Web Backend' },
        { property: 'og:description', content: 'Portfolio de Raúl Caro Pastorino (@raupulus), Desarrollador Web Backend especializado en PHP/Laravel, IoT, Python y sistemas distribuidos.' },
    ]
})
</script>

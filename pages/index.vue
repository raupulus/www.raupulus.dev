<template>
    <div class="circuit-pattern">
        <!-- ===== HERO ===== -->
        <section
            class="relative min-h-[80vh] flex items-center px-4 sm:px-8 pt-8 pb-16 sm:py-16 lg:py-0 overflow-hidden"
        >
            <div class="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container rounded-full blur-[128px]" />
                <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary-container rounded-full blur-[128px]" />
            </div>

            <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 z-10">
                <!-- Texto principal -->
                <div class="lg:col-span-8 flex flex-col justify-center">
                    <span class="font-label text-tertiary tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                        <span class="w-12 h-[1px] bg-tertiary" />
                        Desarrollador Full Stack Senior · Backend Laravel · IA aplicada
                    </span>
                    <h1
                        class="font-headline text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] text-on-surface mb-8"
                    >
                        Raúl Caro
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary"
                        >
                            Pastorino
                        </span>
                    </h1>
                    <p class="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                        Desarrollador web con más de 15 años de experiencia, especializado en backend PHP/Laravel,
                        PostgreSQL e IA aplicada en producción. También administro sistemas GNU/Linux y desarrollo
                        proyectos de IoT y hardware libre.
                    </p>
                    <div class="flex flex-wrap gap-4 sm:gap-6 mb-12">
                        <NuxtLink
                            to="/projects/"
                            class="px-8 py-4 bg-primary text-on-primary font-headline font-bold rounded hover:bg-primary-container transition-colors tracking-widest uppercase text-sm"
                        >
                            Ver Proyectos
                        </NuxtLink>
                        <NuxtLink
                            to="/about/"
                            class="px-8 py-4 border border-outline-variant hover:border-primary hover:bg-primary/10 transition-all rounded font-headline font-bold text-on-surface tracking-widest uppercase text-sm"
                        >
                            Sobre Mí
                        </NuxtLink>
                        <a
                            href="https://curriculum.raupulus.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver Currículum Vitae Online de Raúl Caro Pastorino (abre en nueva pestaña)"
                            aria-label="Ver Currículum Vitae Online de Raúl Caro Pastorino (abre en nueva pestaña)"
                            class="px-8 py-4 bg-surface-container-high border border-outline-variant/30 hover:border-primary text-on-surface font-headline font-bold text-sm tracking-widest uppercase rounded hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <span>CV Online</span>
                            <UiMaterialIcon name="open_in_new" class="text-primary text-base" />
                        </a>
                    </div>

                    <!-- Banda de métricas de impacto clave (P-05) -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-outline-variant/20">
                        <div>
                            <div class="font-headline text-2xl lg:text-3xl font-bold text-primary">+15 Años</div>
                            <div class="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                                Programando
                            </div>
                        </div>
                        <div>
                            <div class="font-headline text-2xl lg:text-3xl font-bold text-secondary">7 Años</div>
                            <div class="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                                Laravel en empresa
                            </div>
                        </div>
                        <div>
                            <div class="font-headline text-2xl lg:text-3xl font-bold text-tertiary">IA en Prod</div>
                            <div class="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                                RAG &amp; Agentes
                            </div>
                        </div>
                        <div>
                            <div class="font-headline text-2xl lg:text-3xl font-bold text-on-surface">100+</div>
                            <div class="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                                Repositorios FOSS
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Decoración derecha -->
                <div class="lg:col-span-4 flex items-center justify-center relative py-6 sm:py-8 lg:py-0">
                    <div class="relative w-full aspect-square max-w-sm sm:max-w-md">
                        <div
                            class="absolute inset-0 glass-panel rounded-xl border border-outline-variant/30 flex items-center justify-center p-8"
                        >
                            <div
                                class="w-full h-full relative border border-dashed border-tertiary/20 rounded-full flex items-center justify-center p-8 sm:p-12"
                            >
                                <div
                                    class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-tertiary animate-[pulse-glow_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(76,214,255,0.8)]"
                                />
                                <div
                                    class="w-full h-full border border-primary/40 rounded-full flex items-center justify-center"
                                >
                                    <UiMaterialIcon class="text-6xl sm:text-7xl text-primary" name="memory" />
                                </div>
                            </div>
                        </div>
                        <div
                            class="absolute -top-4 -right-2 sm:-right-4 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 border border-secondary/40 rounded-lg shadow-lg z-10"
                        >
                            <span class="font-label text-xs text-secondary tracking-widest uppercase"
                                >Open Source desde 2001</span
                            >
                        </div>
                        <div
                            class="absolute -bottom-5 sm:-bottom-6 -left-2 sm:-left-4 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 border border-tertiary/40 rounded-lg flex items-center gap-2 shadow-lg z-10"
                        >
                            <span class="w-2 h-2 rounded-full bg-tertiary" />
                            <span class="font-label text-xs text-on-surface tracking-widest uppercase"
                                >Debian GNU/Linux</span
                            >
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
                        <h2 class="font-headline text-4xl font-bold tracking-tight text-primary mb-4">
                            Mi Stack Principal
                        </h2>
                        <p class="text-on-surface-variant max-w-md">
                            Las tecnologías con las que trabajo a diario y en las que tengo más rodaje.
                        </p>
                    </div>
                    <div class="font-label text-outline text-sm tracking-widest uppercase">
                        Backend · APIs · Bases de datos
                    </div>
                </div>

                <!-- Hexágonos estáticos originales -->
                <div style="text-align: center">
                    <StackBadgeHexagon text="PHP" color="#777bb3" color-light="#9b9fd8">
                        <NuxtImg
                            src="/images/technologies/php_60x60.webp"
                            format="webp"
                            width="60"
                            height="60"
                            quality="90"
                            title="Lenguaje de Programación PHP"
                            alt="Lenguaje de Programación PHP"
                        />
                    </StackBadgeHexagon>

                    <StackBadgeHexagon text="Laravel" color="#c54b4b" color-light="#d56565">
                        <NuxtImg
                            src="/images/technologies/laravel_60x60.webp"
                            format="webp"
                            width="60"
                            height="60"
                            quality="90"
                            title="Framework Laravel"
                            alt="Framework Laravel"
                        />
                    </StackBadgeHexagon>

                    <div class="inline-block">
                        <StackBadgeHexagon text="Vue" color="#2f3239" color-light="#454850">
                            <NuxtImg
                                src="/images/technologies/vuejs_60x60.webp"
                                format="webp"
                                width="60"
                                height="60"
                                quality="90"
                                title="Framework VueJs"
                                alt="Framework VueJs"
                            />
                        </StackBadgeHexagon>

                        <StackBadgeHexagon text="Javascript" color="#d7af21" color-light="#e9c853">
                            <NuxtImg
                                src="/images/technologies/javascript_60x60.webp"
                                format="webp"
                                width="60"
                                height="60"
                                quality="90"
                                title="Lenguaje de Programación Javascript"
                                alt="Lenguaje de Programación Javascript"
                            />
                        </StackBadgeHexagon>

                        <StackBadgeHexagon text="PostgreSQL" color="#336791" color-light="#68ace4">
                            <NuxtImg
                                src="/images/technologies/postgresql_60x60.webp"
                                format="webp"
                                width="60"
                                height="60"
                                quality="90"
                                title="Bases de datos PostgreSQL"
                                alt="Bases de datos PostgreSQL"
                            />
                        </StackBadgeHexagon>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== PASIÓN OPEN SOURCE & IoT ===== -->
        <section class="py-32 px-8 overflow-hidden">
            <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span
                        class="font-label text-tertiary tracking-[0.25em] uppercase text-xs mb-3 flex items-center gap-2"
                    >
                        <span class="w-8 h-[1px] bg-tertiary" />
                        Ecosistema Maker &amp; FOSS
                    </span>
                    <h2 class="text-4xl md:text-5xl font-headline font-bold mb-6 text-on-background leading-tight">
                        Pasión por el <span class="text-tertiary">Código Abierto</span> &amp; IoT
                    </h2>
                    <p class="text-on-surface-variant text-lg leading-relaxed mb-6">
                        Publico mis proyectos como software libre desde 2001. Me encanta el mundo maker: estaciones
                        meteorológicas, monitores de energía, sensores... casi siempre con Raspberry Pi o ESP32,
                        conectados a mis propias APIs para recoger y consultar los datos en tiempo real.
                    </p>
                    <p class="text-on-surface-variant text-base leading-relaxed mb-8">
                        Todo el código, esquemas de conexión y diseños 3D están documentados y publicados en abierto
                        para que cualquiera pueda consultarlos, replicarlos o aprender del proceso.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <NuxtLink
                            to="/projects/"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded font-headline font-bold text-xs uppercase tracking-wider text-on-surface transition-all group"
                        >
                            <span>Ver Proyectos IoT</span>
                            <UiMaterialIcon
                                name="arrow_forward"
                                class="text-tertiary text-base group-hover:translate-x-1 transition-transform"
                            />
                        </NuxtLink>
                        <a
                            href="https://github.com/raupulus"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded font-headline font-bold text-xs uppercase tracking-wider text-on-surface transition-all group"
                        >
                            <span>GitHub / GitLab</span>
                            <UiMaterialIcon
                                name="open_in_new"
                                class="text-secondary text-base group-hover:scale-110 transition-transform"
                            />
                        </a>
                    </div>
                </div>

                <!-- Mosaico de tarjetas de hitos y hardware -->
                <div class="relative">
                    <div
                        class="absolute -inset-4 bg-gradient-to-tr from-tertiary/10 via-primary/5 to-secondary/10 rounded-2xl blur-2xl -z-10 pointer-events-none"
                    />
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Card 1: 20+ Años Open Source -->
                        <div
                            class="p-6 bg-surface-container-high rounded-xl border border-outline-variant/30 hover:border-secondary/50 hover:bg-surface-container-highest transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span
                                        class="font-label text-[11px] tracking-widest uppercase text-secondary font-bold"
                                        >Desde 2001</span
                                    >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    >
                                        <UiMaterialIcon name="schedule" class="text-secondary text-xl" />
                                    </div>
                                </div>
                                <div class="font-headline text-3xl font-extrabold text-on-surface mb-1">
                                    +20 <span class="text-base font-normal text-on-surface-variant">Años</span>
                                </div>
                                <div class="font-headline font-bold text-sm text-secondary mb-2">Software Libre</div>
                                <p class="text-xs text-on-surface-variant leading-relaxed">
                                    Más de dos décadas publicando código abierto, divulgando y colaborando con la
                                    comunidad.
                                </p>
                            </div>
                        </div>

                        <!-- Card 2: 100+ Repositorios Públicos -->
                        <div
                            class="p-6 bg-surface-container-high rounded-xl border border-outline-variant/30 hover:border-tertiary/50 hover:bg-surface-container-highest transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span
                                        class="font-label text-[11px] tracking-widest uppercase text-tertiary font-bold"
                                        >GitLab &amp; GitHub</span
                                    >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    >
                                        <UiMaterialIcon name="code_blocks" class="text-tertiary text-xl" />
                                    </div>
                                </div>
                                <div class="font-headline text-3xl font-extrabold text-on-surface mb-1">
                                    +100 <span class="text-base font-normal text-on-surface-variant">Repos</span>
                                </div>
                                <div class="font-headline font-bold text-sm text-tertiary mb-2">Código Público</div>
                                <p class="text-xs text-on-surface-variant leading-relaxed">
                                    APIs, scripts de sistema, firmware IoT y herramientas documentadas y mantenidas.
                                </p>
                            </div>
                        </div>

                        <!-- Card 3: ESP32 & Raspberry Pi -->
                        <div
                            class="p-6 bg-surface-container-high rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-highest transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span
                                        class="font-label text-[11px] tracking-widest uppercase text-primary font-bold"
                                        >Microcontroladores</span
                                    >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    >
                                        <UiMaterialIcon name="memory" class="text-primary text-xl" />
                                    </div>
                                </div>
                                <div class="font-headline text-2xl font-extrabold text-on-surface mb-1">
                                    ESP32 &amp; Pi
                                </div>
                                <div class="font-headline font-bold text-sm text-primary mb-2">Hardware &amp; IoT</div>
                                <p class="text-xs text-on-surface-variant leading-relaxed">
                                    Estaciones meteorológicas, sensores y monitores conectados por WiFi/LoRa a mis
                                    propias APIs.
                                </p>
                            </div>
                        </div>

                        <!-- Card 4: Electrónica & PCBs -->
                        <div
                            class="p-6 bg-surface-container-high rounded-xl border border-outline-variant/30 hover:border-secondary/50 hover:bg-surface-container-highest transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span
                                        class="font-label text-[11px] tracking-widest uppercase text-secondary font-bold"
                                        >Hardware propio</span
                                    >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                                    >
                                        <UiMaterialIcon name="view_in_ar" class="text-secondary text-xl" />
                                    </div>
                                </div>
                                <div class="font-headline text-2xl font-extrabold text-on-surface mb-1">
                                    Electrónica &amp; PCBs
                                </div>
                                <div class="font-headline font-bold text-sm text-secondary mb-2">Hardware propio</div>
                                <p class="text-xs text-on-surface-variant leading-relaxed">
                                    Diseño de placas PCB, integración de microcontroladores y nodos LoRa/Meshtastic con
                                    carcasas 3D a medida.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== ESPECIALIZACIONES ===== -->
        <section class="py-24 px-8 bg-surface-container-lowest">
            <div class="max-w-7xl mx-auto">
                <div class="mb-20 text-center">
                    <h2
                        class="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 break-words"
                    >
                        ESPECIALIZACIONES
                    </h2>
                    <div class="w-24 h-1 bg-secondary mx-auto" />
                </div>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-outline-variant/20 rounded-xl overflow-hidden"
                >
                    <div
                        class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors border-b lg:border-b-0 md:border-r border-outline-variant/10"
                    >
                        <div
                            class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                        >
                            <UiMaterialIcon class="text-primary" name="hub" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">Backend con Laravel</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Mi especialidad: APIs REST, paneles de gestión, pasarelas de pago e integración de servicios
                            e IA (RAG y agentes). De pequeños proyectos a nivel empresarial.
                        </p>
                        <div
                            class="mt-auto px-4 py-1.5 border border-primary/30 rounded-full font-label text-xs tracking-widest text-primary uppercase"
                        >
                            PHP · Laravel · PostgreSQL
                        </div>
                    </div>
                    <div
                        class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors border-b md:border-b-0 lg:border-r border-outline-variant/10"
                    >
                        <div
                            class="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                        >
                            <UiMaterialIcon class="text-tertiary" name="dns" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">IoT y Electrónica</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Dispositivos con Raspberry Pi, Pico y ESP32 que miden, registran y envían datos a mis APIs:
                            meteorología, energía, sensores ambientales y otros experimentos.
                        </p>
                        <div
                            class="mt-auto px-4 py-1.5 border border-tertiary/30 rounded-full font-label text-xs tracking-widest text-tertiary uppercase"
                        >
                            Python · MicroPython
                        </div>
                    </div>
                    <div
                        class="p-10 bg-surface flex flex-col items-start group hover:bg-surface-container-low transition-colors"
                    >
                        <div
                            class="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                        >
                            <UiMaterialIcon class="text-secondary" name="terminal" />
                        </div>
                        <h3 class="font-headline text-xl font-bold mb-4 tracking-tight">Sistemas y Automatización</h3>
                        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
                            GNU/Linux desde la terminal: servidores VPS, despliegues, copias de seguridad y scripts para
                            automatizar tareas repetitivas, en servidores y en mi día a día.
                        </p>
                        <div
                            class="mt-auto px-4 py-1.5 border border-secondary/30 rounded-full font-label text-xs tracking-widest text-secondary uppercase"
                        >
                            Linux · Bash · CI/CD
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== ÁREAS DE ESPECIALIDAD ===== -->
        <section class="py-32 px-8">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <span class="font-label text-secondary tracking-widest text-xs uppercase mb-4 block"
                            >Capacidades y solvencia técnica</span
                        >
                        <h2 class="text-4xl md:text-6xl font-headline font-black tracking-tighter">
                            ÁREAS DE ESPECIALIDAD
                        </h2>
                    </div>
                    <div class="text-right">
                        <p class="text-on-surface-variant text-sm font-label uppercase tracking-widest">
                            Aprendiendo siempre
                        </p>
                        <p class="text-on-surface-variant/80 text-xs font-label tracking-tighter uppercase">
                            Curioso por naturaleza
                        </p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Backend principal -->
                    <div
                        class="md:col-span-2 md:row-span-2 p-10 bg-surface-container-high rounded-xl border border-outline-variant/20 flex flex-col justify-between group hover:border-primary/50 transition-all duration-500 shadow-xl"
                    >
                        <div>
                            <div class="flex items-center gap-4 mb-8">
                                <div
                                    class="w-16 h-16 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/30 text-primary"
                                >
                                    <UiMaterialIcon class="text-4xl" name="hub" />
                                </div>
                                <h3 class="text-3xl font-headline font-bold">Backend &amp; Arquitectura</h3>
                            </div>
                            <p class="text-on-surface-variant text-lg leading-relaxed">
                                El corazón de mi trabajo: 7 años en empresa desarrollando con Laravel y PHP. APIs REST,
                                paneles a medida, pasarelas de pago, servicios de IA y optimización de bases de datos.
                            </p>
                        </div>
                        <div class="mt-8 flex flex-wrap gap-3">
                            <span
                                class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20"
                                >APIs REST</span
                            >
                            <span
                                class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20"
                                >Paneles a medida</span
                            >
                            <span
                                class="px-3 py-1 bg-surface-container-lowest text-primary text-[10px] font-label uppercase rounded border border-outline-variant/20"
                                >Optimización SQL</span
                            >
                        </div>
                    </div>
                    <!-- IA & Automatización -->
                    <div
                        class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group"
                    >
                        <UiMaterialIcon
                            class="text-tertiary mb-4 block group-hover:scale-110 transition-transform"
                            name="memory"
                        />
                        <h4 class="font-headline font-bold text-xl mb-2">IA &amp; Automatización</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">
                            Integración de modelos en producción: agentes, RAG, procesamiento de datos y scripts Python.
                        </p>
                    </div>
                    <!-- Frontend Reactivo -->
                    <div
                        class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group"
                    >
                        <UiMaterialIcon
                            class="text-secondary mb-4 block group-hover:scale-110 transition-transform"
                            name="layers"
                        />
                        <h4 class="font-headline font-bold text-xl mb-2">Frontend Reactivo</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">
                            Interfaces rápidas y accesibles con Vue 3, Nuxt y TypeScript, como este mismo portfolio.
                        </p>
                    </div>
                    <!-- PostgreSQL -->
                    <div
                        class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group"
                    >
                        <UiMaterialIcon
                            class="text-primary mb-4 block group-hover:scale-110 transition-transform"
                            name="database"
                        />
                        <h4 class="font-headline font-bold text-xl mb-2">Bases de Datos</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">
                            Diseño relacional eficiente, integridad, consultas complejas e indexación con PostgreSQL.
                        </p>
                    </div>
                    <!-- Sistemas & DevOps -->
                    <div
                        class="p-8 bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-all group"
                    >
                        <UiMaterialIcon
                            class="text-on-surface-variant mb-4 block group-hover:scale-110 transition-transform"
                            name="terminal"
                        />
                        <h4 class="font-headline font-bold text-xl mb-2">Sistemas &amp; DevOps</h4>
                        <p class="text-sm text-on-surface-variant leading-relaxed">
                            Administración de servidores Linux, redes, despliegues automatizados y scripting en Bash.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== CTA ===== -->
        <section class="py-32 px-8 relative">
            <div
                class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
            />
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <h2 class="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                    ¿Te interesa algo de lo que hago? <span class="italic text-primary">Hablemos</span>
                </h2>
                <p class="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">
                    Si tienes alguna duda sobre mis proyectos, quieres comentarme una idea o simplemente saludar, puedes
                    escribirme cuando quieras.
                </p>
                <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <NuxtLink
                        to="/contact/"
                        class="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black tracking-widest uppercase text-sm rounded transition-transform hover:scale-105"
                    >
                        Contactar
                    </NuxtLink>
                    <div class="flex items-center gap-4 px-6 py-4 border border-outline-variant/30 rounded glass-panel">
                        <UiMaterialIcon class="text-tertiary" name="alternate_email" />
                        <a
                            href="mailto:public@raupulus.dev"
                            class="font-label text-sm text-on-surface-variant hover:text-primary transition-colors select-all"
                            >public@raupulus.dev</a
                        >
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== REDES SOCIALES (iconos originales) ===== -->
        <section class="py-20 px-8 border-t border-outline-variant/10">
            <div class="max-w-7xl mx-auto">
                <div class="block text-center">
                    <div class="mb-12">
                        <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-center mb-4">
                            Redes Sociales
                        </h2>
                        <div class="w-24 h-1 bg-tertiary mx-auto" />
                    </div>

                    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                        <IconsYoutube size="80px" :decored="true" />
                        <IconsLinkedin size="80px" :decored="true" />
                        <IconsTwitch size="80px" :decored="true" />
                        <IconsGitlab size="80px" :decored="true" />
                        <IconsGithub size="80px" :decored="true" />
                        <IconsMastodon size="80px" :decored="true" />
                        <IconsTwitter size="80px" :decored="true" />
                        <IconsTelegram size="80px" :decored="true" />
                    </div>

                    <div class="mt-12 text-center">
                        <NuxtLink
                            to="/social/"
                            class="inline-flex items-center gap-2 px-6 py-3 border border-outline-variant/40 hover:border-primary hover:bg-primary/10 transition-all rounded font-headline font-bold text-sm text-on-surface tracking-widest uppercase group"
                        >
                            <span>Ver todos los perfiles</span>
                            <UiMaterialIcon
                                name="arrow_forward"
                                class="text-primary group-hover:translate-x-1 transition-transform"
                            />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    const config = useRuntimeConfig();
    const url = config.public.app.url;

    // SEO de la página principal
    useHead({
        title: 'Raúl Caro Pastorino | Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
        meta: [
            {
                name: 'description',
                content:
                    'Portfolio de Raúl Caro Pastorino (@raupulus), Desarrollador Full Stack Senior especializado en backend PHP/Laravel, PostgreSQL, IA aplicada y proyectos Open Source/IoT.',
            },
            {
                name: 'keywords',
                content:
                    'Raúl Caro Pastorino, raupulus, desarrollador full stack, backend, laravel, php, postgresql, inteligencia artificial, IA aplicada, IoT, Python, Vue.js',
            },
            { name: 'robots', content: 'index, follow' },
            { property: 'og:type', content: 'website' },
            {
                property: 'og:title',
                content: 'Raúl Caro Pastorino | Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
            },
            {
                property: 'og:description',
                content:
                    'Portfolio de Raúl Caro Pastorino (@raupulus), Desarrollador Full Stack Senior especializado en backend PHP/Laravel, PostgreSQL, IA aplicada y proyectos Open Source/IoT.',
            },
        ],
        link: [{ rel: 'canonical', href: `${url}/` }],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ProfilePage',
                    name: 'Raúl Caro Pastorino | Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
                    url: `${url}/`,
                    mainEntity: {
                        '@type': 'Person',
                        name: 'Raúl Caro Pastorino',
                        alternateName: 'raupulus',
                        jobTitle: 'Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
                        url: `${url}/`,
                        email: 'public@raupulus.dev',
                        sameAs: [
                            'https://github.com/raupulus',
                            'https://gitlab.com/raupulus',
                            'https://www.linkedin.com/in/raulcaropastorino',
                            'https://twitter.com/raupulus',
                            'https://mastodon.online/@raupulus',
                            'https://www.youtube.com/@raupulus',
                            'https://t.me/raupulus_diffusion',
                        ],
                    },
                }),
            },
        ],
    });
</script>

<script lang="ts" setup>
    import type { ContentType } from '@/types/ContentType';

    const props = defineProps({
        data: {
            type: Object as PropType<ContentType>,
            required: true,
        },
    });

    // Carga progresiva de imagen: primero la miniatura pequeña, luego la grande
    // (no el original: puede pesar varios MB). Se usa <img> y no <NuxtImg>: las
    // miniaturas ya vienen optimizadas en webp desde la API y, en el build
    // estático, IPX reescribe la URL remota contra el dominio de la web (404).
    const currentImgSrc = ref(imageUrl(props.data.image, 'small'));
    const onImageLoaded = () => {
        currentImgSrc.value = imageUrl(props.data.image, 'large');
    };

    const publishedAt = computed(() => formatDate(props.data.published_at ?? props.data.created_at));
</script>

<template>
    <article
        class="h-full group relative flex flex-col bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/40 transition-all duration-300"
    >
        <!-- Imagen del proyecto -->
        <div class="relative h-48 shrink-0 overflow-hidden bg-surface-container-lowest">
            <img
                v-if="currentImgSrc"
                :src="currentImgSrc"
                width="440"
                height="300"
                loading="lazy"
                decoding="async"
                :alt="'Portada del proyecto: ' + data.title"
                :title="data.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @load="onImageLoaded"
            />
            <!-- Overlay con tecnologías -->
            <div class="absolute bottom-0 left-0 right-0 p-3 flex flex-wrap gap-1 justify-end pointer-events-none">
                <template v-for="technology in data.technologies" :key="technology.slug">
                    <img
                        v-if="technology.image"
                        :src="technology.image"
                        :title="technology.name"
                        :alt="'Logotipo de ' + technology.name"
                        loading="lazy"
                        decoding="async"
                        width="20"
                        height="20"
                        class="w-5 h-5 object-contain rounded bg-surface-container-lowest/80 p-0.5"
                    />
                </template>
            </div>
        </div>

        <!-- Contenido -->
        <div class="flex flex-col flex-1 p-6">
            <!-- Fecha -->
            <div v-if="publishedAt" class="font-label text-[10px] text-outline uppercase tracking-widest mb-2">
                {{ publishedAt }}
            </div>

            <!-- Título -->
            <h3
                class="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-3 line-clamp-2"
            >
                <NuxtLink
                    :to="`/projects/${data.slug}/`"
                    class="after:absolute after:inset-0 after:z-0 focus:outline-none focus-visible:underline"
                >
                    {{ data.title }}
                </NuxtLink>
            </h3>

            <!-- Descripción -->
            <p class="text-sm text-on-surface-variant leading-relaxed line-clamp-3 flex-1 mb-4">
                {{ data.excerpt }}
            </p>

            <!-- Botón ver proyecto -->
            <div class="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                <span
                    class="font-label text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pointer-events-none"
                >
                    Ver Proyecto
                    <UiMaterialIcon class="text-sm" name="arrow_forward" />
                </span>

                <!-- Links externos del footer -->
                <div v-if="data.metadata" class="relative z-10 flex items-center gap-2">
                    <IconsYoutube
                        v-if="data.metadata.youtube"
                        :margin="0"
                        :url="data.metadata.youtube"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsEarth
                        v-if="data.metadata.web"
                        :margin="0"
                        :url="data.metadata.web"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsTwitter
                        v-if="data.metadata.twitter"
                        :margin="0"
                        :url="data.metadata.twitter"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsGitlab
                        v-if="data.metadata.gitlab"
                        :margin="0"
                        :url="data.metadata.gitlab"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsTelegram
                        v-if="data.metadata.telegram_channel"
                        :margin="0"
                        :url="data.metadata.telegram_channel"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsGithub
                        v-if="data.metadata.github"
                        :margin="0"
                        :url="data.metadata.github"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsLinkedin
                        v-if="data.metadata.linkedin"
                        :margin="0"
                        :url="data.metadata.linkedin"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsMastodon
                        v-if="data.metadata.mastodon"
                        :margin="0"
                        :url="data.metadata.mastodon"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                    <IconsTwitch
                        v-if="data.metadata.twitch"
                        :margin="0"
                        :url="data.metadata.twitch"
                        :grayscale="true"
                        display="block"
                        :legacy="true"
                    />
                </div>
            </div>
        </div>
    </article>
</template>

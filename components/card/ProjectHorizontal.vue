<script lang="ts" setup>
import type { ContentType } from '@/types/ContentType'

const props = defineProps({
    data: {
        type: Object as PropType<ContentType>,
        required: true
    },
})

const emit = defineEmits(['projecteventshow'])

// Carga progresiva de imagen: primero pequeña, luego grande
const currentImgSrc = ref(props.data.urlImageSmall)
const onImageLoaded = () => {
    currentImgSrc.value = props.data.urlImage
}
</script>

<template>
    <div
        class="group flex flex-col md:flex-row bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer"
        @click="emit('projecteventshow', data)"
    >
        <!-- Imagen del proyecto (izquierda en desktop) -->
        <div class="relative md:w-72 lg:w-96 h-56 md:h-auto shrink-0 overflow-hidden bg-surface-container-lowest">
            <NuxtImg
                :src="currentImgSrc"
                width="440"
                height="300"
                sizes="(max-width: 768px) 100vw, 384px"
                format="webp"
                loading="lazy"
                :alt="data.title"
                :title="data.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @load="onImageLoaded"
            />
            <!-- Tecnologías sobre la imagen -->
            <div class="absolute bottom-0 left-0 right-0 p-3 flex flex-wrap gap-1">
                <NuxtImg
                    v-for="technology in data.technologies"
                    :key="technology.name"
                    :src="technology.urlImageSmall"
                    :title="technology.name"
                    :alt="technology.name"
                    loading="lazy"
                    width="22"
                    height="22"
                    class="w-5 h-5 object-contain rounded bg-surface-container-lowest/80 p-0.5"
                />
            </div>
        </div>

        <!-- Contenido (derecha en desktop) -->
        <div class="flex flex-col flex-1 p-8">
            <!-- Fecha -->
            <div v-if="data.created_at_human" class="font-label text-[10px] text-outline uppercase tracking-widest mb-2">
                {{ data.created_at_human }}
            </div>

            <!-- Título -->
            <h3 class="font-headline text-2xl font-bold text-on-surface group-hover:text-primary transition-colors mb-4 line-clamp-2">
                {{ data.title }}
            </h3>

            <!-- Descripción -->
            <p class="text-sm text-on-surface-variant leading-relaxed line-clamp-4 flex-1 mb-6">
                {{ data.excerpt }}
            </p>

            <!-- Footer: botón + links externos -->
            <div class="pt-4 border-t border-outline-variant/10 flex items-center justify-between gap-4">
                <span class="font-label text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ver Proyecto
                    <UiMaterialIcon class="text-sm" name="arrow_forward" />
                </span>

                <!-- Links externos -->
                <div v-if="data.metadata" class="flex items-center gap-2 flex-wrap">
                    <IconsYoutube v-if="data.metadata.youtube" :margin="0" :url="data.metadata.youtube" :grayscale="true" display="block" :legacy="true" />
                    <IconsEarth v-if="data.metadata.web" :margin="0" :url="data.metadata.web" :grayscale="true" display="block" :legacy="true" />
                    <IconsTwitter v-if="data.metadata.twitter" :margin="0" :url="data.metadata.twitter" :grayscale="true" display="block" :legacy="true" />
                    <IconsGitlab v-if="data.metadata.gitlab" :margin="0" :url="data.metadata.gitlab" :grayscale="true" display="block" :legacy="true" />
                    <IconsTelegram v-if="data.metadata.telegram_channel" :margin="0" :url="data.metadata.telegram_channel" :grayscale="true" display="block" :legacy="true" />
                    <IconsGithub v-if="data.metadata.github" :margin="0" :url="data.metadata.github" :grayscale="true" display="block" :legacy="true" />
                    <IconsLinkedin v-if="data.metadata.linkedin" :margin="0" :url="data.metadata.linkedin" :grayscale="true" display="block" :legacy="true" />
                    <IconsMastodon v-if="data.metadata.mastodon" :margin="0" :url="data.metadata.mastodon" :grayscale="true" display="block" :legacy="true" />
                    <IconsTwitch v-if="data.metadata.twitch" :margin="0" :url="data.metadata.twitch" :grayscale="true" display="block" :legacy="true" />
                </div>
            </div>
        </div>
    </div>
</template>

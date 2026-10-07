<script lang="ts" setup>
    import type { ContentType } from '@/types/ContentType';

    const props = defineProps({
        data: {
            type: Object as PropType<ContentType>,
            required: true,
        },
    });

    // Carga progresiva de miniatura: primero la miniatura pequeña y luego grande en webp
    const currentImgSrc = ref(imageUrl(props.data.image, 'small'));
    const onImageLoaded = () => {
        currentImgSrc.value = imageUrl(props.data.image, 'large');
    };

    const publishedAt = computed(() => formatDate(props.data.published_at ?? props.data.created_at));

    // Enlace según Opción B: si conocemos la primera página la incluimos, de lo contrario
    // enlazamos al slug del contenido que redirigirá automáticamente a la página 1
    const postLink = computed(() => {
        const firstPageSlug = props.data.first_page?.slug || props.data.pages?.[0]?.slug;
        return firstPageSlug ? `/blog/${props.data.slug}/${firstPageSlug}/` : `/blog/${props.data.slug}/`;
    });
</script>

<template>
    <article
        class="h-full group relative flex flex-col bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg"
    >
        <!-- Imagen de portada -->
        <div class="relative h-48 shrink-0 overflow-hidden bg-surface-container-lowest">
            <img
                v-if="currentImgSrc"
                :src="currentImgSrc"
                width="440"
                height="300"
                loading="lazy"
                decoding="async"
                :alt="data.title"
                :title="data.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @load="onImageLoaded"
            >
            <div
                v-else
                class="w-full h-full flex items-center justify-center bg-surface-container-lowest text-outline-variant"
            >
                <UiMaterialIcon name="code_blocks" class="text-4xl" />
            </div>

            <!-- Badge flotante de páginas -->
            <div
                v-if="data.pages_count && data.pages_count > 1"
                class="absolute top-3 right-3 px-2.5 py-1 bg-surface-container-lowest/90 backdrop-blur rounded text-[10px] font-label font-bold text-secondary uppercase tracking-widest border border-outline-variant/30 flex items-center gap-1 shadow"
            >
                <UiMaterialIcon name="layers" class="text-xs" />
                {{ data.pages_count }} páginas
            </div>
        </div>

        <!-- Contenido textual -->
        <div class="flex flex-col flex-1 p-6">
            <!-- Metadata: Fecha y categoría -->
            <div
                class="flex items-center justify-between gap-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-3"
            >
                <span v-if="publishedAt">{{ publishedAt }}</span>
                <span
                    v-if="data.taxonomies?.categories?.[0]"
                    class="px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-bold border border-secondary/20"
                >
                    {{ data.taxonomies.categories[0].name }}
                </span>
            </div>

            <!-- Título del artículo -->
            <h3
                class="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-3 line-clamp-2"
            >
                <NuxtLink
                    :to="postLink"
                    class="after:absolute after:inset-0 after:z-0 focus:outline-none focus-visible:underline"
                >
                    {{ data.title }}
                </NuxtLink>
            </h3>

            <!-- Extracto -->
            <p v-if="data.excerpt" class="text-sm text-on-surface-variant leading-relaxed line-clamp-3 flex-1 mb-4">
                {{ data.excerpt }}
            </p>

            <!-- Pie de tarjeta con botón leer -->
            <div class="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                <span
                    class="font-label text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pointer-events-none"
                >
                    Leer Artículo
                    <UiMaterialIcon class="text-sm" name="arrow_forward" />
                </span>

                <span
                    v-if="data.views_count"
                    class="font-label text-[11px] text-on-surface-variant flex items-center gap-1"
                >
                    <UiMaterialIcon name="bolt" class="text-xs" />
                    {{ data.views_count }}
                </span>
            </div>
        </div>
    </article>
</template>

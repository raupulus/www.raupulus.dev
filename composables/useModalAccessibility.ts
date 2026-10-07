import { type Ref, watch, nextTick, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

/**
 * Composable para accesibilidad en ventanas modales (WCAG 2.1 AA):
 * - Bloqueo de scroll de fondo (scroll lock en document.body)
 * - Trampa de foco (focus trap dentro del contenedor modal)
 * - Restauración del foco al elemento que abrió el modal tras cerrarse
 */
export function useModalAccessibility(isOpen: Ref<boolean>, modalRef: Ref<HTMLElement | null>) {
    let previousActiveElement: HTMLElement | null = null;

    const lockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    const unlockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    };

    const trapFocus = (e: KeyboardEvent) => {
        if (!isOpen.value || !modalRef.value) return;
        if (e.key !== 'Tab') return;

        const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    watch(
        isOpen,
        async (open) => {
            if (open) {
                if (typeof document !== 'undefined') {
                    previousActiveElement = document.activeElement as HTMLElement | null;
                }
                lockScroll();
                await nextTick();
                if (modalRef.value) {
                    const first = modalRef.value.querySelector<HTMLElement>(
                        'button:not([disabled]), [tabindex="0"], a[href], input:not([disabled])',
                    );
                    first?.focus();
                }
            } else {
                unlockScroll();
                if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
                    previousActiveElement.focus();
                }
            }
        },
        { immediate: true },
    );

    if (getCurrentInstance()) {
        onMounted(() => {
            if (typeof window !== 'undefined') {
                window.addEventListener('keydown', trapFocus);
            }
        });

        onBeforeUnmount(() => {
            unlockScroll();
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', trapFocus);
            }
        });
    }
}

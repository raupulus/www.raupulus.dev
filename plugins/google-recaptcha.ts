import { VueReCaptcha } from 'vue-recaptcha-v3';
import type { IReCaptchaOptions } from 'vue-recaptcha-v3/dist/IReCaptchaOptions';

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    const options: IReCaptchaOptions = {
        siteKey: runtimeConfig.public.captcha.siteKey,
        loaderOptions: {
            useRecaptchaNet: true,
            autoHideBadge: true,
            explicitRenderParameters: {
                badge: 'bottomleft',
            },
        },
    };

    nuxtApp.vueApp.use(VueReCaptcha, options);
});

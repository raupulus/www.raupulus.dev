import { load, type ReCaptchaInstance } from 'recaptcha-v3';

export class RecaptchaAction {
    public static readonly login = new RecaptchaAction('login');
    public static readonly contact = new RecaptchaAction('contact');

    private constructor(public readonly name: string) {}
}

let recaptchaInstancePromise: Promise<ReCaptchaInstance> | null = null;

export default function useGoogleRecaptcha() {
    const config = useRuntimeConfig();

    const initRecaptcha = (): Promise<ReCaptchaInstance> | null => {
        if (import.meta.server) return null;
        if (!recaptchaInstancePromise) {
            const siteKey = config.public.captcha.siteKey;
            if (!siteKey) {
                console.warn('reCAPTCHA siteKey no configurado');
                return null;
            }
            recaptchaInstancePromise = load(siteKey, {
                useRecaptchaNet: true,
                autoHideBadge: true,
                explicitRenderParameters: {
                    badge: 'bottomleft',
                },
            });
        }
        return recaptchaInstancePromise;
    };

    const executeRecaptcha = async (action: RecaptchaAction): Promise<{ token: string }> => {
        const instance = await initRecaptcha();
        if (!instance) {
            throw new Error('reCAPTCHA no disponible');
        }

        const token = await instance.execute(action.name);
        if (!token) {
            throw new Error('Failed to execute reCAPTCHA');
        }

        return { token };
    };

    const showBadge = async () => {
        const instance = await initRecaptcha();
        instance?.showBadge();
    };

    const hideBadge = async () => {
        if (recaptchaInstancePromise) {
            const instance = await recaptchaInstancePromise;
            instance.hideBadge();
        }
    };

    return {
        initRecaptcha,
        executeRecaptcha,
        showBadge,
        hideBadge,
    };
}

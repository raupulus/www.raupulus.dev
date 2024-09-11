import { useReCaptcha } from 'vue-recaptcha-v3';

export class RecaptchaAction {
  public static readonly login = new RecaptchaAction('login');
  public static readonly contact = new RecaptchaAction('contact');

  private constructor(public readonly name: string) { }
}

export default () => {
  const recaptchaInstance = useReCaptcha();

  const executeRecaptcha = async (action: RecaptchaAction) => {
    await recaptchaInstance?.recaptchaLoaded();

    const token = await recaptchaInstance?.executeRecaptcha(action.name);

    // Check if token is successfully generated
    if (!token) {
      throw new Error('Failed to execute reCAPTCHA');
    }

    return { token };
  };

  return { executeRecaptcha };
};

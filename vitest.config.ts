import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                domEnvironment: 'happy-dom',
            },
        },
        exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],
    },
});

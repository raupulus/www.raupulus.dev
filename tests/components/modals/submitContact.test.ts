import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import SubmitContact from '~/components/modals/submitContact.vue';

mockComponent('UiMaterialIcon', {
    props: ['name'],
    template: '<span class="material-icon">{{ name }}</span>',
});

describe('Modal submitContact Component', () => {
    const mockFormData = {
        name: 'Usuario Prueba',
        email: 'public@raupulus.dev',
        subject: 'Consulta técnica',
        message: 'Hola, me gustaría información sobre un proyecto.',
    };

    it('paso 1: renderiza el resumen de los datos introducidos', async () => {
        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 1,
                dataForm: mockFormData,
            },
        });

        expect(wrapper.text()).toContain('Resumen de los datos introducidos');
        expect(wrapper.text()).toContain('Usuario Prueba');
        expect(wrapper.text()).toContain('public@raupulus.dev');
        expect(wrapper.text()).toContain('Consulta técnica');
        expect(wrapper.text()).toContain('Hola, me gustaría información sobre un proyecto.');
    });

    it('paso 1: extrae el valor cuando los campos son objetos reactivos con .value y no vuelca JSON', async () => {
        const nestedDataForm = {
            name: { value: 'Raúl Caro', valid: true, validations: { minLength: { value: 2 } } },
            email: { value: 'public@raupulus.dev', valid: true },
            subject: { value: 'Colaboración Open Source', valid: true },
            message: { value: 'Mensaje de prueba con salto de línea\ny detalles.', valid: true },
        };

        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 1,
                dataForm: nestedDataForm,
            },
        });

        expect(wrapper.text()).toContain('Raúl Caro');
        expect(wrapper.text()).toContain('public@raupulus.dev');
        expect(wrapper.text()).toContain('Colaboración Open Source');
        expect(wrapper.text()).toContain('Mensaje de prueba con salto de línea\ny detalles.');
        // Debe evitarse estrictamente el volcado de JSON de validaciones internas
        expect(wrapper.text()).not.toContain('"valid": true');
        expect(wrapper.text()).not.toContain('minLength');
    });

    it('paso 1: emite cancel y submit al pulsar sus respectivos botones', async () => {
        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 1,
                dataForm: mockFormData,
            },
        });

        const buttons = wrapper.findAll('button');
        const cancelBtn = buttons.find((b) => b.text().includes('Modificar datos'));
        const submitBtn = buttons.find((b) => b.text().includes('Confirmar y enviar'));

        expect(cancelBtn?.exists()).toBe(true);
        expect(submitBtn?.exists()).toBe(true);

        await cancelBtn!.trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();

        await submitBtn!.trigger('click');
        expect(wrapper.emitted('submit')).toBeTruthy();
    });

    it('paso 2: renderiza el indicador de carga y estado de proceso', async () => {
        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 2,
            },
        });

        expect(wrapper.text()).toContain('Procesando datos');
        expect(wrapper.text()).toContain('Validando la información del formulario');
    });

    it('paso 3: renderiza mensaje de éxito cuando se envía satisfactoriamente', async () => {
        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 3,
                messages: {
                    success: ['Mensaje recibido correctamente. Gracias por contactar.'],
                    errors: [],
                },
            },
        });

        expect(wrapper.text()).toContain('Mensaje enviado');
        expect(wrapper.text()).toContain('Mensaje recibido correctamente');
    });

    it('paso 3: renderiza lista de errores cuando el envío falla', async () => {
        const wrapper = await mountSuspended(SubmitContact, {
            props: {
                show: true,
                step: 3,
                messages: {
                    success: [],
                    errors: ['Error al procesar el captcha', 'Email inválido'],
                },
            },
        });

        expect(wrapper.text()).toContain('No se pudo enviar el mensaje');
        expect(wrapper.text()).toContain('Error al procesar el captcha');
        expect(wrapper.text()).toContain('Email inválido');
    });
});

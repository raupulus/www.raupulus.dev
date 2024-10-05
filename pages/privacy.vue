<template>
  <div class="box-privacy">
    <h1 style="text-align: center;">
      Política de
      <span class="text-primary font-bold">
        Privacidad
      </span>
    </h1>

    <p>
      En nombre de Rúl Caro Pastorino creador de este sitio web, accesible desde
      <NuxtLink to="/">
        del formulario de contacto,
      </NuxtLink>
      una de mis principales prioridades es la privacidad de nuestros visitantes.

      Esta Política de Privacidad contiene tipos de información que es recopilada y registrada principalmente
      para seguridad/estadística de intereses en las secciones y cómo la usamos.
    </p>

    <h2>1. Información que recopilamos</h2>

    <p>Podemos recopilar y almacenar la siguiente información personal:</p>

    <ul>
      <li><strong>Datos de contacto:</strong> tales como nombre, dirección de correo electrónico. Solo al contactar
        mediante el formulario de contacto por razones evidentes para poder identificar y responder manteniendo la
        comunicación que abres conmigo.</li>
      <li><strong>Datos de uso:</strong> información sobre cómo interactúas con nuestro sitio web a un nivel muy básico,
        como las páginas que visitas y los enlaces en los que haces clic con el único fin de detectar problemas de
        visibilidad o secciones poco interesantes en el sitio para mejorarlo.</li>
    </ul>

    <h2>2. Cómo usamos tu información</h2>
    <p>La información que recopilamos se utiliza de las siguientes maneras:</p>
    <ul>
      <li>Para mejorar la experiencia en nuestro sitio web.</li>
      <li>Para evitar mal uso del sitio web como envíos de correos ilegítimos por bots.</li>
      <li>Para responder a tus consultas y solicitudes.</li>
    </ul>

    <h2>3. Cookies y tecnologías similares</h2>
    <p>Nuestro sitio web utiliza cookies para mejorar la funcionalidad y el rendimiento del sitio. Las cookies son
      pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas ciertos sitios web.</p>

    <h2>4. Cómo protegemos tu información</h2>
    <p>Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger tus datos personales contra
      el acceso no autorizado, la alteración, la divulgación o la destrucción.</p>

    <h2>5. Compartir información con terceros</h2>
    <p>No vendo, intercambio ni transfiero tu información personal a terceros. Esto no incluye a terceros de
      confianza que nos asisten en la operación del sitio web, siempre que estas partes acuerden mantener esta
      información confidencial.</p>

    <h2>6. Enlaces a otros sitios web</h2>
    <p>Este sitio web puede contener enlaces a otros sitios web que no están operados por nosotros. No tenemos
      control sobre el contenido y las prácticas de privacidad de esos sitios.</p>

    <h2>7. Cambios a esta Política de Privacidad</h2>
    <p>Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Te notificaremos
      cualquier cambio publicando la nueva Política de Privacidad en esta página.</p>

    <h2>8. Contacto</h2>
    <p>
      Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos a través
      <NuxtLink to="/contact">
        del formulario de contacto
      </NuxtLink>
    </p>
  </div>
</template>

<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()

const url = runtimeConfig.public.app.url;
const title = 'Política de Privacidad - Raúl Caro Pastorino | Desarrollador Web Full Stack Backend';
const description = 'Lee la política de privacidad de Raúl Caro Pastorino para entender cómo se recopila, usa y protege tu información personal en este sitio web de portfolio profesional.';
const keywords = 'política de privacidad, Raúl Caro Pastorino, desarrollador web, privacidad, protección de datos, información personal';

useHead({
  title: title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url + '/privacy' },
    { property: 'og:image', content: url + '/social/privacy.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: url + '/social/privacy.webp' }
  ]
});
</script>

<style scoped></style>

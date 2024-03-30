<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://www.twitch.tv/raupulus'
    },
    size: {
        type: Number,
        required: false,
        default: 24
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Twitch'
    }
})
</script>

<template>
    <IconsGeneric :url="url" :title="title">
        <svg :width="size" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <g style="fill:#c084fc;fill-opacity:1">
                <path
                    d="M 237.0334,0.01825771 H 18.889525 C 8.5795947,-0.0980924 0.12482704,8.1605623 -0.001,18.470607 V 237.52409 c 0.12151905,10.31501 8.5756063,18.58184 18.890525,18.47361 H 237.0334 c 10.33533,0.12812 18.82252,-8.13824 18.9656,-18.47361 V 18.454802 C 255.85162,8.1243898 247.36374,-0.13379287 237.0334,7.9080706e-4"
                    style="fill:#c084fc;fill-opacity:1" />
            </g>
            <path
                d="M 186.68105,61.782508 H 169.9107 v 47.623812 h 16.77035 z m -46.09134,-0.204041 h -16.77037 v 47.645513 h 16.77037 z M 69.318963,16.863313 27.416948,56.551273 V 199.44876 h 50.285014 v 39.68793 l 41.906348,-39.68793 h 33.53638 l 75.43836,-71.44875 V 16.863313 Z M 211.81704,120.07717 178.2937,151.82061 h -33.53203 l -29.34704,27.78415 V 151.82061 H 77.701962 V 32.743705 H 211.81704 Z"
                style="fill:#ffffff;fill-opacity:1;stroke-width:0.434127" />
        </svg>
    </IconsGeneric>
</template>

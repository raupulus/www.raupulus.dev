<template>
    <section class="box-my-history">
        <div>
            <div>
                <h1>
                    Conoce <span>¡Mi Trayectoria!</span>
                </h1>
            </div>

            <div>
                <p>
                    Intento centrarme en backend aunque me gusta muchísimo javascript y vue.js
                </p>

                <p>
                    Me apasiona la electrónica (raspberry, arduino, esp32, esp8266, attiny, stm32)
                </p>

                <p>
                    Llevo programando como hobbie muchos años pero profesionalmente desde hace 4 años
                </p>
            </div>
        </div>

        <div class="box-my-history-img">

            <img class="my-history-img" src="@/assets/images/my-history-img.webp" alt="Test">

        </div>


    </section>
</template>

<style scoped>
.box-my-history {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 50px;

}

.box-my-history-img {
    width: 200px;
    height: 200px;
}

.my-history-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>

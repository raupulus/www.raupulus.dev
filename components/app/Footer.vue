<template>
    <footer class="footer-container">
        <div class="footer-box footer-box-left">
            <div class="make-with-love">
                <div>
                    Hecho con :D
                </div>

                <div>
                    Tech1, Tech2, Tech3
                </div>
            </div>

            <div>
                <div>
                    Mis Plataformas
                </div>

                <p>
                    My Api
                </p>

                <p>
                    Curriculum
                </p>

                <p>
                    La Guía Linux
                </p>
            </div>

            <div>
                <div>
                    Recursos
                </div>

                <p>
                    GitLab
                </p>

                <p>
                    GitHub
                </p>
            </div>
        </div>

        <div class="footer-box footer-box-right">
            <div>
                Explora mi sitio personal
            </div>

            <div>
                <BtnGeneric text="Explorar" />
            </div>
        </div>
    </footer>
</template>


<style lang="css" scoped>
.footer-container {
    display: grid;
    position: absolute;
    bottom: 0;
    width: 100%;
    min-height: 120px;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    color: #E6E6E6;
    padding: 10px;
    background-color: #1F2937;
    box-sizing: border-box;
}

.footer-box {
    align-self: center;
}

.footer-box-left {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 50px;
    justify-self: start;
}

.make-with-love {
    text-align: center;
    justify-self: center;
    align-self: center;
}

.footer-box-right {
    text-align: center;
    justify-self: end;
}
</style>

/**
 * This was my first JavaScript experiment. It was created between 2008 and 2009.
 */
(function (window) {
    'use strict';

    var document = window.document,
        Number = window.Number,
        display = document.getElementById('display'),
        displayWidth = 960,
        displayHeight = 400,
        intTiempo,
        intMove,
        contMove,
        onEvento,
        thatLevel;

    // Crear Escenario
    function crearEscenario() {
        var oEsc = document.createElement('div');
        oEsc.id = 'escenario';
        oEsc.ancho = 550;
        oEsc.alto = 550;
        oEsc.style.width = oEsc.ancho + 'px';
        oEsc.style.height = oEsc.alto + 'px';
        oEsc.style.backgroundImage = 'url(cubo.png)';
        oEsc.style.zIndex = -2;
        oEsc.style.position = 'absolute';
        // Centrado
        oEsc.arriba = (displayHeight - oEsc.alto) / 2;
        oEsc.izquierda = (displayWidth - oEsc.ancho) / 2;
        oEsc.style.top =  oEsc.arriba + 'px';
        oEsc.style.left = oEsc.izquierda + 'px';
        display.appendChild(oEsc);
    }

    // Crear Personaje
    function crearPersonaje() {
        var oPer = document.createElement('div');
        oPer.id = 'personaje';
        oPer.ancho = 50;
        oPer.alto = 50;
        oPer.style.width = oPer.ancho + 'px';
        oPer.style.height = oPer.alto + 'px';
        oPer.style.backgroundImage = 'url(personaje.png)';
        oPer.style.backgroundRepeat = 'no-repeat';
        oPer.style.position = 'absolute';
        // Centrado
        oPer.arriba = (displayHeight - oPer.alto) / 2;
        oPer.izquierda = (displayWidth - oPer.ancho) / 2;
        oPer.style.top =  oPer.arriba + 'px';
        oPer.style.left = oPer.izquierda + 'px';
        display.appendChild(oPer);
    }

    function correrCrono() {

        var contador = document.getElementById('tiempo'),
            hurry = document.getElementById('hurry'),
            tiempo = Number(contador.innerHTML) - 1;

        contador.innerHTML = tiempo;

        if (tiempo <= 5) {
            hurry.innerHTML = contador.innerHTML;

            if (tiempo === 0) {
                intTiempo = window.clearInterval(intTiempo);
                intMove = window.clearInterval(intMove);
                document.onkeypress = null;
                hurry.innerHTML = document.getElementById('puntos').innerHTML + ' fruits!';
            }
        }
    }

    function contarTiempo() {
        intTiempo = window.setInterval(correrCrono, 1000);
    }

    function Level() {
        thatLevel = this;

        /**
         * Escenario
         */
        this.oEscenario = document.getElementById('escenario');

        // Mover escenario
        this.moverEscenario = function (ar, iz) {
            // Personaje arriba = Escenario abajo
            if (ar > 0) {
                this.oEscenario.arriba += 5;
                this.oEscenario.style.top = this.oEscenario.arriba + 'px';
            // Personaje abajo = Escenario arriba
            } else if (ar < 0) {
                this.oEscenario.arriba -= 5;
                this.oEscenario.style.top = this.oEscenario.arriba + 'px';
            // Personaje izquierda = Escenario derecha
            } else if (iz > 0) {
                this.oEscenario.izquierda += 5;
                this.oEscenario.style.left = this.oEscenario.izquierda + 'px';
            // Personaje derecha = Escenario izquierda
            } else if (iz < 0) {
                this.oEscenario.izquierda -= 5;
                this.oEscenario.style.left = this.oEscenario.izquierda + 'px';
            }

            if (contMove < 10) {
                contMove += 1;
            } else {
                onEvento = 0;
                contMove = 1;
                intMove = window.clearInterval(intMove);
                // Si pisa la fruta
                if (thatLevel.oPersonaje.arriba === Number(thatLevel.oEscenario.arriba + thatLevel.oFruta.arriba) && thatLevel.oPersonaje.izquierda === Number(thatLevel.oEscenario.izquierda + thatLevel.oFruta.izquierda)) {
                    this.oEscenario.removeChild(document.getElementById('fruta'));
                    document.getElementById('puntos').innerHTML = Number(document.getElementById('puntos').innerHTML) + 1;
                    this.crearFruta();
                }
            }
        };

        // Ejecucion de movimiento de escenario
        this.moverEscExe = function (ar, iz) {
            onEvento = 1;
            contMove = 1;
            intMove = window.setInterval(function () { thatLevel.moverEscenario(ar, iz); }, 15);
        };

        /**
         * Personaje
         */
        this.oPersonaje = document.getElementById('personaje');
        this.oPersonaje.spriteX = 0;
        this.oPersonaje.spriteY = -100;
        this.actualizarSprite = function () {
            this.oPersonaje.style.backgroundPosition = this.oPersonaje.spriteX + 'px ' + this.oPersonaje.spriteY + 'px';
        };
        this.actualizarSprite();

        // Caminata
        this.pQuiet = function (posicionY, aDnd) {
            this.oPersonaje.spriteX = 0;
            this.oPersonaje.spriteY = posicionY;
            this.actualizarSprite();

            switch (aDnd) {
            case 'der':
                this.pDer(posicionY);
                window.setTimeout(function () { thatLevel.pDer(posicionY); }, 50);
                break;
            case 'izq':
                this.pIzq(posicionY);
                window.setTimeout(function () { thatLevel.pIzq(posicionY); }, 50);
                break;
            }
        };

        // Paso Derecho
        this.pDer = function (posicionY) {
            this.oPersonaje.spriteX = -50;
            this.oPersonaje.spriteY = posicionY;
            this.actualizarSprite();

            window.setTimeout(function () { thatLevel.pQuiet(posicionY, 'izq'); }, 50);
        };

        // Paso Izquierdo
        this.pIzq = function (posicionY) {
            this.oPersonaje.spriteX = -100;
            this.oPersonaje.spriteY = posicionY;
            this.actualizarSprite();

            window.setTimeout(function () { thatLevel.pQuiet(posicionY, 'end'); }, 50);
        };

        // Frutas
        this.crearFruta = function () {
            var oFru = document.createElement('div');
            oFru.id = 'fruta';
            oFru.style.width = '50px';
            oFru.style.height = '50px';
            // Fondo
            oFru.style.backgroundImage = 'url(frutas.png)';
            oFru.style.backgroundRepeat = 'no-repeat';
            oFru.style.position = 'relative';
            oFru.frutas = [0, -50, -100, -150];
            oFru.style.backgroundPosition = oFru.frutas[Math.floor(Math.random() * 5)] + 'px 0';
            // Posicion
            oFru.obtenerPos = function () {
                var aPos = [],
                    i = 0;

                for (i; i < 11; i += 1) {
                    aPos[i] = i * 50;
                }

                return aPos;
            };
            oFru.aPosiciones = oFru.obtenerPos();
            oFru.arriba = Number(oFru.aPosiciones[Math.floor(Math.random() * 11)]);
            oFru.izquierda = Number(oFru.aPosiciones[Math.floor(Math.random() * 11)]);
            oFru.style.top =  oFru.arriba + 'px';
            oFru.style.left = oFru.izquierda + 'px';
            this.oEscenario.appendChild(oFru);

            this.oFruta = document.getElementById('fruta');
        };
        this.crearFruta();
    }

    // Iniciar Game
    function iniciarGame() {

        crearEscenario();
        crearPersonaje();
        new Level();
        contarTiempo();

        onEvento = 0;

        // Keypress General (w=119 / d=100 / s=115 / a=97)
        document.onkeypress = function (event) {

            if (onEvento !== 0) { return; }

            var caract = event.keyCode;

            thatLevel.oPersonaje.spriteX = 0;

            switch (caract) {
            case 119: // Arriba
                thatLevel.oPersonaje.spriteY = 0;
                thatLevel.actualizarSprite();

                if (thatLevel.oPersonaje.arriba !== thatLevel.oEscenario.arriba) {
                    thatLevel.moverEscExe(50, 0);
                    thatLevel.pDer(0);
                }
                break;
            case 100: // Derecha
                thatLevel.oPersonaje.spriteY = -50;
                thatLevel.actualizarSprite();

                if ((thatLevel.oPersonaje.izquierda + thatLevel.oPersonaje.ancho) !== (thatLevel.oEscenario.izquierda + thatLevel.oEscenario.ancho)) {
                    thatLevel.moverEscExe(0, -50);
                    thatLevel.pDer(-50);
                }
                break;
            case 115: // Abajo
                thatLevel.oPersonaje.spriteY = -100;
                thatLevel.actualizarSprite();

                if ((thatLevel.oPersonaje.arriba + thatLevel.oPersonaje.alto) !== (thatLevel.oEscenario.arriba + thatLevel.oEscenario.alto)) {
                    thatLevel.moverEscExe(-50, 0);
                    thatLevel.pDer(-100);
                }
                break;
            case 97: // Izquierda
                thatLevel.oPersonaje.spriteY = -150;
                thatLevel.actualizarSprite();

                if (thatLevel.oPersonaje.izquierda !== thatLevel.oEscenario.izquierda) {
                    thatLevel.moverEscExe(0, 50);
                    thatLevel.pDer(-150);
                }
                break;
            }
        };
    }

    window.onload = iniciarGame;

}(this));
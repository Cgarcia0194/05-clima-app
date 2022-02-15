require('dotenv').config();
//importo las funciones de iquirer
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares
} = require('./helpers/inquirer');

const Busquedas = require('./models/busqueda');

const main = async () => {

    let opt = '';
    const busquedas = new Busquedas();

    do {
        //imprimir el menú
        opt = await inquirerMenu();

        switch (opt) {
            case 1: //buscar lugar
                //Se muestra el mensaje de ciudad onde se agrega el texto
                const busqueda = await leerInput('Ciudad: ');
                //busca los 5 lugares con la palabra que se ingresó
                const lugares = await busquedas.buscarCiudad(busqueda);

                //traigo el id del lugar seleccionado
                const idSeleccionado = await listadoLugares(lugares);
                if (idSeleccionado === 0) continue;

                //traigo el registro del lugar seleccionado con un find
                const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado);

                //guardar DB
                const guardar = busquedas.agregarHistorial(lugarSeleccionado.nombre);
                
                console.clear();

                //busca el clima del lugar que se escribió
                const climaLugar = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                console.log('Información de la ciudad: ');
                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Latitud: ', lugarSeleccionado.lat);
                console.log('Longitud: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', climaLugar.temp, '°C');
                console.log('Mínima: ', climaLugar.min, '°C');
                console.log('Máxima: ', climaLugar.max, '°C');
                console.log('¿Cómo está el clima?: ', climaLugar.desc.red, );
                if (guardar === false) {
                    console.log('NOTA: El lugar ya se ha guardado anteriormente en la BD, no se volverá a guardar'.underline.red);
                }
                break;
            case 2:
                busquedas.listadoHistorial.forEach((lugar, i) => {
                    console.log(`${i + 1}. ${lugar}`.blue);
                });
                break;
        }

        await pausa();
    } while (opt !== 0);

}

main();
const inquirer = require('inquirer');
require('colors');

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [{
            value: 1,
            name: `${'1.'.green} Buscar ciudad`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial de búsqueda`
        },
        {
            value: 0,
            name: '0. Salir'.red
        }
    ]
}];

/**
 * Función que sirve para mostrar el menú principal con las opciónes del programa
 * @returns 
 */
const inquirerMenu = async () => {

    console.log('*****************************************'.green);
    console.log('       Seleccione una opción'.yellow);
    console.log('*****************************************\n'.green);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;
};

/**
 * Función que sirve para pausar el programa y se creé el bulce de seguir interactuando con la app
 */
const pausa = async () => {
    const question = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${'ENTER'.blue} para continuar`
    }];

    console.log('\n\n');

    await inquirer.prompt(question);
};

/**
 * Función que sirve paara validar que se agregue algo cuando se registra una tarea
 * @param {*} message 
 * @returns 
 */
const leerInput = async (message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            return value.length == 0 ? 'Por favor ingresa un valor' : true;
        }
    }];

    const {desc} = await inquirer.prompt(question);

    return desc;
}

/**
 * Función que sirve para mostrar las tareas de la opción borrar tareas
 * @param {*} tareas 
 * @returns 
 */
const listadoLugares = async(lugares = []) => {

    const opciones = lugares.map((lugar,i) => {
        return {
            value: lugar.id,
            name: `${i + 1} ${lugar.nombre}`.green,
            index: i + 1
        }
    });

    opciones.unshift({
        value: 0,
        name: '0. Cancelar'.red,
        index: 0
    });

    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar: ',
        choices: opciones
    }]
    
    const {id} = await inquirer.prompt(preguntas);

    return id;
};

const mostrarListadoCheckList = async(tareas = []) => {

    const opciones = tareas.map((tarea,i) => {
        return {
            value: tarea.id,
            name: `${i + 1} ${tarea.descr}`.green,
            checked: tarea.completadoEn ? true : false
        }
    });

    const pregunta = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices: opciones
    }]
    
    const {ids} = await inquirer.prompt(pregunta);

    return ids;
};

/**
 * Función que sirve ara confirmar una acción
 * @param {*} mensaje 
 * @returns 
 */
const confirmar = async mensaje => {
    const pregunta = [{
        type: 'confirm',
        name: 'ok',
        message: mensaje
    }];

    const {ok} = await inquirer.prompt(pregunta);
    return ok;
}

//exporta las funciones del archivo con su nombre que tiene asignado desde aquí
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    mostrarListadoCheckList,
    confirmar
}
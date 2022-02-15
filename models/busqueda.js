const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    parametros = {
        'access_token': process.env.MAPBOX_KEY,
        'language': 'es',
        'limit': 5
    };
    parametrosClima = {
        units: 'metric',
        appid: process.env.OPENWEATHER_KEY,
        lang: 'es'
    }

    get listadoHistorial() {
        return this.historial;
    }

    constructor() {
        this.leerDB();
    }

    async buscarCiudad(lugar = '') {
        try {
            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
                params: this.parametros
            }).get(`${lugar}.json`);

            const resp = await instancia;

            return Object.keys(resp.data.features).length === 0 ? 'No hay información de la búsqueda' : resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })); //Retornar los lugares que coincidan con el lugar que se escribión   
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instancia = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.parametrosClima,
                    lat,
                    lon
                }
            }).get();

            const resp = await instancia;
            const {
                weather,
                main
            } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            return console.log(error);
        }
    }

    agregarHistorial(lugar = '') {
        //todo: no guardar dos lugares repetidos
        if (this.historial.includes(lugar)) {
            return false;
        } else {
            this.historial.unshift(lugar);
        }

        //grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) {
            this.historial = [];
        } else {
            const info = fs.readFileSync(this.dbPath, {
                encoding: 'utf-8'
            });

            this.historial = JSON.parse(info);
        }
    }

}

module.exports = Busquedas;
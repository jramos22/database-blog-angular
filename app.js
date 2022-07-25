'use strict'

//Cargar modulos de node para crear el servidor
const express = require('express');
const bodyParser = require('body-parser');

//Ejecutar epress(http)
const app = express();

//Cargar ficheros rutas
const article_routes = require('./routes/article');

//middleswares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas /cargar rutas
app.use('/api', article_routes);


//Exportar modulo (fichero actural)
module.exports = app;
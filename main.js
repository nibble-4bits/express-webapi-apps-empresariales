'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const CONFIG = require('./config');
const ROUTES = require('./routes/routes');
const INITIALIZE = require('./initialize');

const app = express();

app.use('/docs', express.static('repo_docs'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/api', ROUTES);

mongoose.connect(CONFIG.database.connectionString, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`);
    }
    else {
        console.log('Conexion a la base de datos establecida');

        app.listen(CONFIG.port, () => console.log(`Servidor corriendo en puerto ${CONFIG.port}`));
    }
});

INITIALIZE();
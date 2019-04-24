'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const CONFIG = require('./config');
const LOGIN = require('./controllers/login');
const COMMON_USER = require('./controllers/commonUser');
const ROUTES = require('./routes/routes');

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());

app.use('/api', ROUTES);

app.post('/fileupload', (req, res) => {
    //console.log(req.files);
    for (const fichero in req.files) {
        if (req.files.hasOwnProperty(fichero)) {
            const element = req.files[fichero];
            fs.writeFile(`E:\\REPO\\ficheroCopia.${element.name.split('.')[1]}`, element.data, err => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
});

mongoose.connect(CONFIG.database.connectionString, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`);
    }
    else {
        console.log('Conexion a la base de datos establecida');

        app.listen(CONFIG.port, () => console.log(`Servidor corriendo en puerto ${CONFIG.port}`));
    }
});
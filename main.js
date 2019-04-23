'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const CONFIG = require('./config');
const LOGIN = require('./controllers/login');

const app = express();

app.use(bodyParser.json());

// app.use(/\/(\w+\/?)+/, (req, res, next) => {
//     res.send(`Accediste a ${req.baseUrl}`);
//     next();
// });
app.post('/api/login', LOGIN.login);
app.get('/api/activateAccount/:usuarioId/:codigoSecreto', LOGIN.activateAccount)
app.post('/api/signup', LOGIN.signup);
app.post('/api/passwordRecovery', LOGIN.passwordRecovery);

mongoose.connect(CONFIG.database.connectionString, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`);
    }
    else {
        console.log('Conexion a la base de datos establecida');

        app.listen(CONFIG.port, () => console.log(`Servidor corriendo en puerto ${CONFIG.port}`));
    }
});
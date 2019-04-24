'use strict';

const express = require('express');

const CONFIG = require('../config');
const LOGIN = require('../controllers/login');
const COMMON_USER = require('../controllers/commonUser');
const AUTH = require('../middleware/auth');

const route = express.Router();

/* RUTAS GENERALES (todos los usuarios pueden acceder) */
route.post('/login', LOGIN.login);
route.post('/signup', LOGIN.signup);
route.post('/passwordRecovery', LOGIN.passwordRecovery);
route.get('/activateAccount/:usuarioId/:codigoSecreto', LOGIN.activateAccount)

/* RUTAS USUARIO COMUN */
route.get('/commonUser/getSolicitudes/:idUsuario'/*, AUTH*/, COMMON_USER.getAllSolicitudes);
route.post('/commonUser/sendSolicitud', COMMON_USER.addNewSolicitud);

module.exports = route;
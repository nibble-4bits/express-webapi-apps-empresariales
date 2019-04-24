'use strict';

const express = require('express');

const CONFIG = require('../config');
const LOGIN = require('../controllers/login');
const COMMON_USER = require('../controllers/commonUser');
const IT_USER = require('../controllers/ITUser');
const AUTH = require('../middleware/auth');

const route = express.Router();

/* RUTAS GENERALES (todos los usuarios pueden acceder) */
route.post('/login', LOGIN.login);
route.post('/signup', LOGIN.signup);
route.post('/passwordRecovery', LOGIN.passwordRecovery);
route.get('/activateAccount/:usuarioId/:codigoSecreto', LOGIN.activateAccount)

/* RUTAS USUARIO COMUN */
route.get('/commonUser/getSolicitudes/:idUsuario'/*, AUTH*/, COMMON_USER.getAllSolicitudes);
route.post('/commonUser/sendSolicitud'/*, AUTH*/, COMMON_USER.addNewSolicitud);

/* RUTAS USUARIO IT */
route.get('/itUser/getDocument/:idSolicitud', IT_USER.getDocument);

module.exports = route;
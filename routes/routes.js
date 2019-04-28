'use strict';

const express = require('express');

const CONFIG = require('../config');
const LOGIN = require('../controllers/login');
const COMMON_USER = require('../controllers/commonUser');
const IT_USER = require('../controllers/ITUser');
const MANAGER_USER = require('../controllers/gerenteITUser');
const AUTH = require('../middleware/auth');

const route = express.Router();

/* RUTAS GENERALES (todos los usuarios pueden acceder) */
route.post('/login', LOGIN.login);
route.post('/signup', LOGIN.signup);
route.post('/passwordRecovery', LOGIN.passwordRecovery);
route.get('/activateAccount/:usuarioId/:codigoSecreto', LOGIN.activateAccount)

/* RUTAS USUARIO COMUN */
route.get('/commonUser/getMySolicitudes/:idUsuario'/*, AUTH*/, COMMON_USER.getAllMySolicitudes);
route.post('/commonUser/sendSolicitud'/*, AUTH*/, COMMON_USER.addNewSolicitud);

/* RUTAS USUARIO IT */
route.get('/itUser/getUnattendedSolicitudes', IT_USER.getAllUnattendedSolicitudes);
route.get('/itUser/getMySolicitudes/:idUsuarioIT', IT_USER.getAllMySolicitudes);

/* RUTAS USUARIO GERENTE IT */
route.get('/managerUser/getSolicitudesByCommonUser/:nombre/:apellidos', MANAGER_USER.getSolicitudesByCommonUser);
route.get('/managerUser/getSolicitudesByITUser/:nombre/:apellidos', MANAGER_USER.getSolicitudesByITUser);
route.get('/managerUser/getSolicitudesByDateRange/:startDate/:endDate', MANAGER_USER.getSolicitudesByDateRange);
route.get('/managerUser/getSolicitudById/:idSolicitud', MANAGER_USER.getSolicitudById);

module.exports = route;
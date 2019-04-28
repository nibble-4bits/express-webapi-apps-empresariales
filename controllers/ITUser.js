'use strict';

const hsc = require('http-status-codes');
const randString = require('randomstring');

const USUARIO = require('../models/usuario');
const SOLICITUD = require('../models/solicitud');
const MAIL = require('../util/mail');
const CONFIG = require('../config');
const TASK_SCHEDULER = require('../util/taskScheduler');
const ERROR = require('../util/error');

const ITUserController = {
    getAllUnattendedSolicitudes: function (req, res) {
        // Solicitudes no atendidas son aquellas que aún no tienen una fecha en proceso 
        // y no tienen un Usuario IT que las esté atendiendo
        const query = {
            FechaEnProceso: null,
            UsuarioIT: null
        };

        SOLICITUD.modeloSolicitud.find(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar buscar solicitudes no atendidas',
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudesNoAtendidas: queryResult });
        });
    },
    getAllMySolicitudes: function (req, res) {
        const query = {
            UsuarioIT: {
                IdUsuarioIT: req.params.idUsuarioIT
            }
        };

        SOLICITUD.modeloSolicitud.find(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar buscar las solicitudes atendidas por usted',
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudesAtendidas: queryResult });
        });
    },
    addCommentToSolicitud: function (req, res) {
        
    },
    assignFechaEnProceso: function (req, res) {

    },
    assignFechaTerminado: function (req, res) {

    }
};

module.exports = ITUserController;
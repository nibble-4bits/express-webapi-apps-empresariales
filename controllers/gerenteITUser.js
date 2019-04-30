'use strict';

const hsc = require('http-status-codes');
const moment = require('moment');

const USUARIO = require('../models/usuario');
const SOLICITUD = require('../models/solicitud');
const ERROR = require('../util/error');

const gerenteUserController = {
    getSolicitudesByCommonUser: function (req, res) {
        let idUsuario = 0;

        const queryUsuario = {
            Nombre: req.params.nombre,
            Apellidos: req.params.apellidos
        };

        // Buscamos primero el Id del usuario en base a su nombre completo
        USUARIO.modeloUsuario.findOne(queryUsuario, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar buscar usuario',
                    `Error al buscar usuario en la base de datos: ${err}`);
            }

            idUsuario = queryResult._id;
        });

        const querySolicitud = {
            IdUsuario: idUsuario
        };

        // Despues buscamos las solicitudes en base al id del usuario
        SOLICITUD.modeloSolicitud.find(querySolicitud, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitudes del usuario ${idUsuario}`,
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudes: queryResult });
        });
    },
    getSolicitudesByITUser: function (req, res) {
        const queryUsuarioIT = {
            UsuarioIT: {
                NombreCompleto: `${req.params.nombre} ${req.params.apellidos}`
            }
        };

        // Buscamos las solicitudes en base al UsuarioIT que las atendió
        SOLICITUD.modeloSolicitud.find(queryUsuarioIT, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitudes del usuario IT: ${queryUsuarioIT.UsuarioIT}`,
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudes: queryResult });
        });
    },
    getSolicitudesByDateRange: function (req, res) {
        const startDate = moment(req.params.startDate).toDate();
        const endDate = moment(req.params.endDate).add(23, 'h').add(59, 'm').add(59, 's').toDate();

        const queryFecha = {
            FechaCreacion: {
                $gte: startDate,
                $lte: endDate
            }
        };

        SOLICITUD.modeloSolicitud.find(queryFecha, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitudes del ${startDate} al ${endDate}`,
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudes: queryResult });
        });
    },
    getSolicitudById: function (req, res) {
        // Buscamos en base al Id de la solicitud
        SOLICITUD.modeloSolicitud.findById(req.params.idSolicitud, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitud #${req.params.idSolicitud}`,
                    `Error al buscar solicitud en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitud: queryResult });
        });
    }
};

module.exports = gerenteUserController;
'use strict';

const hsc = require('http-status-codes');
const moment = require('moment');

const SOLICITUD = require('../models/solicitud');
const ERROR = require('../util/error');

const gerenteUserController = {
    getSolicitudesByCommonUser: function (req, res) {
        const querySolicitud = {
            'UsuarioComun.NombreCompleto': `${req.params.nombre} ${req.params.apellidos}`
        };

        // Despues buscamos las solicitudes en base al id del usuario
        SOLICITUD.modeloSolicitud.find(querySolicitud, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitudes del usuario ${req.params.nombre} ${req.params.apellidos}`,
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudes: queryResult });
        });
    },
    getSolicitudesByITUser: function (req, res) {
        const queryUsuarioIT = {
            'UsuarioIT.NombreCompleto': `${req.params.nombre} ${req.params.apellidos}`
        };

        // Buscamos las solicitudes en base al UsuarioIT que las atendió
        SOLICITUD.modeloSolicitud.find(queryUsuarioIT, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar solicitudes del usuario IT: $${req.params.nombre} ${req.params.apellidos}`,
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
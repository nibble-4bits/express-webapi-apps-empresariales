'use strict';

const hsc = require('http-status-codes');
const moment = require('moment');

const SOLICITUD = require('../models/solicitud');
const ERROR = require('../util/error');

const ITUserController = {
    getAllUnattendedSolicitudes: function (req, res) {
        // Solicitudes no atendidas son aquellas que no tienen un Usuario IT que las esté atendiendo
        const query = {
            'UsuarioIT.IdUsuarioIT': -1
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
            'UsuarioIT.IdUsuarioIT': req.params.idUsuarioIT,
            'FechaTerminado': { $eq: null } // solo traer aquellas solicitudes que no hayan sido terminadas
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
    assignSolicitud: function (req, res) {
        let updateQuery = {
            UsuarioIT: { IdUsuarioIT: req.body.idUsuarioIT, NombreCompleto: req.body.nombreCompleto },
        };

        SOLICITUD.modeloSolicitud.findByIdAndUpdate(req.body.idSolicitud, updateQuery, { new: true }, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar agregar comentario a la solicitud #${req.body.idSolicitud}`,
                    `Error al agregar comentario a la solicitud ${req.body.idSolicitud} en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ respuesta: queryResult });
        });
    },
    addCommentToSolicitud: function (req, res) {
        let updateQuery = {
            $push: {
                ComentariosIT: { Comentario: req.body.comentario, Fecha: new Date().toJSON() }
            }
        };

        SOLICITUD.modeloSolicitud.findByIdAndUpdate(req.body.idSolicitud, updateQuery, { new: true }, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar agregar comentario a la solicitud #${req.body.idSolicitud}`,
                    `Error al agregar comentario a la solicitud ${req.body.idSolicitud} en la base de datos: ${err}`);
            }

            res.status(hsc.CREATED).json({ respuesta: queryResult });
        });
    },
    assignFechaEnProceso: function (req, res) {
        let updateQuery;
        let fechaActual = new Date().toJSON();

        if (req.body.comentario) {
            updateQuery = {
                FechaEnProceso: fechaActual,
                $push: {
                    ComentariosIT: { Comentario: req.body.comentario, Fecha: fechaActual }
                }
            };
        }
        else {
            updateQuery = {
                FechaEnProceso: fechaActual
            };
        }

        SOLICITUD.modeloSolicitud.findByIdAndUpdate(req.body.idSolicitud, updateQuery, { new: true }, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar agregar comentario a la solicitud #${req.body.idSolicitud}`,
                    `Error al agregar comentario a la solicitud ${req.body.idSolicitud} en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ respuesta: queryResult });
        });
    },
    assignFechaTerminado: function (req, res) {
        let updateQuery;
        let fechaCreacion;
        let fechaActual = new Date().toJSON();

        SOLICITUD.modeloSolicitud.findById(req.body.idSolicitud, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar buscar la solicitud #${req.body.idSolicitud}`,
                    `Error al buscar la solicitud ${req.body.idSolicitud} en la base de datos: ${err}`);
            }

            if (!queryResult.FechaEnProceso) {
                return;
            }
            fechaCreacion = queryResult.FechaCreacion;
        });

        let fechaCreacionMoment = moment(fechaCreacion);
        let fechaActualMoment = moment(fechaActual);
        let duracion = fechaActualMoment.diff(fechaCreacionMoment, 'days') + 'd ' + 
                       (fechaActualMoment.diff(fechaCreacionMoment, 'hours') % 24) + 'h ' +
                       (fechaActualMoment.diff(fechaCreacionMoment, 'minutes') % 60) + 'm ' +
                       (fechaActualMoment.diff(fechaCreacionMoment, 'seconds') % 60) + 's';
        if (req.body.comentario) {
            updateQuery = {
                FechaTerminado: fechaActual,
                $push: {
                    ComentariosIT: { Comentario: req.body.comentario, Fecha: fechaActual }
                },
                Duracion: duracion
            };
        }
        else {
            updateQuery = {
                FechaTerminado: fechaActual,
                Duracion: duracion
            };
        }

        SOLICITUD.modeloSolicitud.findByIdAndUpdate(req.body.idSolicitud, updateQuery, { new: true }, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    `Error al intentar agregar comentario a la solicitud #${req.body.idSolicitud}`,
                    `Error al agregar comentario a la solicitud ${req.body.idSolicitud} en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ respuesta: queryResult });
        });
    }
};

module.exports = ITUserController;
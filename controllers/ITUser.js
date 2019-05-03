'use strict';

const hsc = require('http-status-codes');

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
        let fechaActual = new Date().toJSON();

        if (req.body.comentario) {
            updateQuery = {
                FechaTerminado: fechaActual,
                $push: {
                    ComentariosIT: { Comentario: req.body.comentario, Fecha: fechaActual }
                }
            };
        }
        else {
            updateQuery = {
                FechaTerminado: fechaActual
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
'use strict';

const hsc = require('http-status-codes');

const SOLICITUD = require('../models/solicitud');

const commonUserController = {
    getAllSolicitudes: function (req, res) {
        const query = {
            IdUsuario: req.params.idUsuario
        };

        SOLICITUD.modeloSolicitud.find(query, (err, queryResult) => {
            if (err) {
                res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al buscar solicitudes en la base de datos: ${err}` });
                return;
            }

            if (queryResult.length > 0) {
                res.status(hsc.OK).send({ solicitudes: queryResult });
            }
            else {
                res.status(hsc.NOT_FOUND).send({ respuesta: `No se encontraron solicitudes creadas por el usuario ${query.IdUsuario}` });
            }
        });
    },
    addNewSolicitud: function (req, res) {
        let nuevaSolicitud = new SOLICITUD.modeloSolicitud({
            IdUsuario: req.body.idUsuario,
            FechaCreacion: req.body.fechaCreacion,
            Razon: req.body.razon,
            //RutaDocumento: { type: String, default: null },
            Prioridad: req.body.prioridad
        });

        nuevaSolicitud.save((err, solicitudStored) => {
            if (err) {
                res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al guardar solicitud en la base de datos: ${err}` });
                return;
            }

            res.status(hsc.CREATED).send(solicitudStored);
        });
    }
};

module.exports = commonUserController;
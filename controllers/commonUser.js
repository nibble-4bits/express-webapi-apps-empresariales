'use strict';

const hsc = require('http-status-codes');

const SOLICITUD = require('../models/solicitud');
const FILE_UPLOAD = require('../util/fileUpload');
const ERROR = require('../util/error');

const commonUserController = {
    getAllMySolicitudes: function (req, res) {
        const query = {
            IdUsuario: req.params.idUsuario
        };

        SOLICITUD.modeloSolicitud.find(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar buscar sus solicitudes',
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            res.status(hsc.OK).json({ solicitudes: queryResult });
        });
    },
    addNewSolicitud: function (req, res) {
        const filePath = FILE_UPLOAD.uploadFile(req.files);

        let nuevaSolicitud = new SOLICITUD.modeloSolicitud({
            IdUsuario: req.body.idUsuario,
            FechaCreacion: req.body.fechaCreacion,
            Razon: req.body.razon,
            RutaDocumento: filePath,
            Prioridad: req.body.prioridad
        });

        nuevaSolicitud.save((err, solicitudStored) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar enviar su solicitud al servidor',
                    `Error al guardar solicitud en la base de datos: ${err}`);
            }

            res.status(hsc.CREATED).json({ solicitud: solicitudStored});
        });
    }
};

module.exports = commonUserController;
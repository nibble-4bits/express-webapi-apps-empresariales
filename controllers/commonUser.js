'use strict';

const hsc = require('http-status-codes');

const USUARIO = require('../models/usuario');
const SOLICITUD = require('../models/solicitud');
const FILE_UPLOAD = require('../util/fileUpload');
const MAIL = require('../util/mail');
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

        let emailsITStaff = [];
        USUARIO.modeloUsuario.find({ $or: [{ Tipo: USUARIO.tipoUsuario.IT }, { Tipo: USUARIO.tipoUsuario.IT_MANAGER }] }, 
            (err, queryResult) => {
                for (const usuario of queryResult) {
                    emailsITStaff.push(usuario.Email);
                }
        });

        nuevaSolicitud.save((err, solicitudStored) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar enviar su solicitud al servidor',
                    `Error al guardar solicitud en la base de datos: ${err}`);
            }

            // Se envía un correo a todo el personal de IT notificando la creación de una nueva solicitud
            MAIL.sendMailToManyHTML(emailsITStaff, 
                `El usuario ${solicitudStored.IdUsuario} ha creado una nueva solicitud`,
                `<h1>Información de la solicitud</h1>
                <p><b>Fecha de creación: </b>${new Date(solicitudStored.FechaCreacion).toLocaleString()}</p>
                <p><b>Razón: </b>${solicitudStored.Razon}</p>
                <p><b>Ruta del documento: </b>
                ${solicitudStored.RutaDocumento ? solicitudStored.RutaDocumento : 'No se subió ningún documento'}</p>
                <p><b>Prioridad: </b>${SOLICITUD.getPrioridadString(solicitudStored.Prioridad)}</p>`);
            res.status(hsc.CREATED).json({ solicitud: solicitudStored });
        });
    }
};

module.exports = commonUserController;
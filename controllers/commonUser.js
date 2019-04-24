'use strict';

const hsc = require('http-status-codes');
const randString = require('randomstring');
const fs = require('fs');
const aws = require('aws-sdk');

const SOLICITUD = require('../models/solicitud');
const CONFIG = require('../config');
const ERROR = require('../util/error');

const commonUserController = {
    getAllSolicitudes: function (req, res) {
        const query = {
            IdUsuario: req.params.idUsuario
        };

        SOLICITUD.modeloSolicitud.find(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar buscar sus solicitudes',
                    `Error al buscar solicitudes en la base de datos: ${err}`);
            }

            if (queryResult.length > 0) {
                res.status(hsc.OK).json({ solicitudes: queryResult });
            }
            else {
                res.status(hsc.NOT_FOUND).json({ respuesta: `No se encontraron solicitudes creadas por el usuario ${query.IdUsuario}` });
            }
        });
    },
    addNewSolicitud: function (req, res) {
        let filePath = null;

        for (const file in req.files) {
            if (req.files.hasOwnProperty(file)) {
                const archivo = req.files[file];
                if (CONFIG.uploadLocally) {
                    // Buscamos si el usuario envió algún archivo, 
                    // lo guardamos en la carpeta configurada como repositorio 
                    // y creamos la ruta que se guardará en base de datos
                    filePath = `${CONFIG.fileRepoPath}/${randString.generate()}.${archivo.name.split('.')[1]}`;
                    fs.writeFile(filePath, archivo.data, err => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    aws.config.update({
                        secretAccessKey: CONFIG.cloudCube.secretKey,
                        accessKeyId: CONFIG.cloudCube.accessKey,
                        region: 'us-east-1'
                    });

                    let s3 = new aws.S3();
                    let myBucket = 'a0ojbietvhmi';
                    let key = `public/${randString.generate()}.${archivo.name.split('.')[1]}`;
                    filePath = `${CONFIG.fileRepoPath}/${key}`;
			
                    let params = { Bucket: myBucket, Key: key, Body: archivo.data };
                    s3.putObject(params, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Successfully uploaded data to myBucket/myKey");
                        }
                    });
                }
            }
        }

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

            res.status(hsc.CREATED).json(solicitudStored);
        });
    }
};

module.exports = commonUserController;
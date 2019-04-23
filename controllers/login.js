'use strict';

const hsc = require('http-status-codes');
const randString = require('randomstring');

const USUARIO = require('../models/usuario');
const TOKEN = require('../util/token');
const MAIL = require('../util/mail');
const CONFIG = require('../config');
const TASK_SCHEDULER = require('../util/taskScheduler');

let arreglo = [];

const login = {
    login: function (req, res) {
        let query = {
            Email: req.body.email,
            Contrasena: req.body.contrasena
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al buscar usuario en la base de datos: ${err}` });
            }

            if (queryResult) {
                if (queryResult.Activo) { // si la cuenta fue activada, enviamos el JWT
                    res.status(hsc.OK).send({ token: TOKEN.createToken(queryResult) });
                }
                else { // sino, enviamos un mensaje que explica que la cuenta no ha sido activada
                    res.status(hsc.FORBIDDEN).send({ respuesta: "Su cuenta no ha sido activada" });
                }
            }
            else {
                res.status(hsc.NOT_FOUND).send({ respuesta: "El email y/o la contraseña no coinciden" });
            }
        });
    },
    signup: function (req, res) {
        // Creamos un nuevo modelo e inicializamos sus propiedades a las que hayamos recibido en el JSON del request
        let nuevoUsuario = new USUARIO.modeloUsuario();
        nuevoUsuario.Nombre = req.body.nombre;
        nuevoUsuario.Apellidos = req.body.apellidos;
        nuevoUsuario.Contrasena = req.body.contrasena;
        nuevoUsuario.Email = req.body.email;
        nuevoUsuario.Tipo = USUARIO.tipoUsuario.COMUN; // todos los usuarios que se registren son del tipo COMUN

        nuevoUsuario.save((err, usuarioStored) => {
            if (err) {
                res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al guardar nuevo usuario en la base de datos: ${err}` });
            }

            let objetoArreglo = { usuarioId: usuarioStored._id, codigoSecreto: randString.generate() };
            arreglo.push(objetoArreglo);

            // Programamos una tarea que se ejecutará una sola vez en 10 minutos
            TASK_SCHEDULER.scheduleTaskAndRunOnceIn10Minutes(() => {
                let indice = arreglo.findIndex(x => { return x.codigoSecreto == objetoArreglo.codigoSecreto });
                if (indice >= 0) {
                    arreglo.splice(indice, 1);
                }
            });

            let direccionConfirmacion = `${CONFIG.apiBaseURL}/activateAccount/${objetoArreglo.usuarioId}/${objetoArreglo.codigoSecreto}`;
            MAIL.sendMailHTML(usuarioStored.Email,
                'Su cuenta ha sido creada con éxito',
                `<h1>¡Genial!</h1>
                <p>Su nueva cuenta ha sido creada con éxito.</p>
                <p>Ahora debe activar su cuenta dando click en la siguiente dirección:<br/> 
                ${direccionConfirmacion}<br/> 
                (el enlace caducará 10 minutos después de enviado el correo)</p>
                <p>Su cuenta ha sido registrada con los siguientes datos:</p>
                <ul>
                    <li>Nombre: ${usuarioStored.Nombre}</li>
                    <li>Apellidos: ${usuarioStored.Apellidos}</li>
                    <li>Email: ${usuarioStored.Email}</li>
                    <li>Contraseña: ${usuarioStored.Contrasena.replace(/./g, '•')} (por razones de seguridad no mostramos su contraseña)</li>
                </ul>`
            );
            res.sendStatus(hsc.CREATED);
        });
    },
    passwordRecovery: function (req, res) {
        let query = {
            Email: req.body.email
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al buscar usuario en la base de datos: ${err}` });
            }

            if (queryResult) {
                MAIL.sendMailHTML(query.Email,
                    'Recuperación de contraseña',
                    `<h1>Recupere su contraseña</h1>
                    <p>Su contraseña es: ${queryResult.Contrasena}</p>
                    <p>Si usted no ha solicitado recuperar su contraseña, puede ignorar este correo</p>`);
                res.status(hsc.OK).send({ respuesta: "Se ha enviado su contraseña al correo" });
            }
            else {
                res.status(hsc.NOT_FOUND).send({ respuesta: "El correo electrónico introducido no existe" });
            }
        });
    },
    activateAccount: function (req, res) {
        let indice = arreglo.findIndex(x => {
            return x.usuarioId == req.params.usuarioId && x.codigoSecreto == req.params.codigoSecreto
        });

        if (indice >= 0) {
            arreglo.splice(indice, 1);

            USUARIO.modeloUsuario.findByIdAndUpdate(req.params.usuarioId, { Activo: true }, (err, queryResult) => {
                if (err) {
                    res.status(hsc.INTERNAL_SERVER_ERROR).send({ respuesta: `Error al actualizar usuario en la base de datos: ${err}` });
                }

                res.sendStatus(hsc.OK);
            });
        }
        else {
            res.send('El enlace para activar su cuenta ha caducado');
        }
    }
};

module.exports = login;
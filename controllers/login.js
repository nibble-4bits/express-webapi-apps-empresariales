'use strict';

const hsc = require('http-status-codes');
const randString = require('randomstring');

const USUARIO = require('../models/usuario');
const TOKEN = require('../util/token');
const MAIL = require('../util/mail');
const CRYPTOGRAPHY = require('../util/cryptography');
const CONFIG = require('../config');
const TASK_SCHEDULER = require('../util/taskScheduler');
const ERROR = require('../util/error');

let arregloUsuariosInactivos = [];

const loginController = {
    login: function (req, res) {
        const query = {
            Email: req.body.email,
            Contrasena: CRYPTOGRAPHY.encrypt(req.body.contrasena)
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res, 
                    'Error al intentar iniciar sesión', 
                    `Error al buscar usuario en la base de datos: ${err}`);
            }
            
            if (queryResult) {
                if (queryResult.Activo) { // si la cuenta fue activada, enviamos el JWT
                    res.status(hsc.OK).json({ token: TOKEN.createToken(queryResult) });
                }
                else { // sino, enviamos un mensaje que explica que la cuenta no ha sido activada
                    res.status(hsc.FORBIDDEN).json({ respuesta: "Su cuenta no ha sido activada" });
                }
            }
            else {
                res.status(hsc.NOT_FOUND).json({ respuesta: "El email y/o la contraseña no coinciden" });
            }
        });
    },
    signup: function (req, res) {
        // Creamos un nuevo modelo e inicializamos sus propiedades a las que hayamos recibido en el JSON del request
        let nuevoUsuario = new USUARIO.modeloUsuario({
            Nombre: req.body.nombre,
            Apellidos: req.body.apellidos,
            Contrasena: CRYPTOGRAPHY.encrypt(req.body.contrasena),
            Email: req.body.email,
            Tipo: USUARIO.tipoUsuario.COMUN
        });

        nuevoUsuario.save((err, usuarioStored) => {
            if (err) {
                return ERROR.sendErrorResponse(res, 
                    'Error al intentar registrar una nueva cuenta', 
                    `Error al guardar nuevo usuario en la base de datos: ${err}`);
            }

            const usuarioNoRegistrado = { usuarioId: usuarioStored._id, codigoSecreto: randString.generate() };
            arregloUsuariosInactivos.push(usuarioNoRegistrado);

            // Programamos una tarea que se ejecutará una sola vez en 10 minutos
            // Si el usuario no ha activado su cuenta después de 10 minutos, tendrá que volver a registrarse
            TASK_SCHEDULER.scheduleTaskAndRunOnceIn10Minutes(() => {
                const indice = arregloUsuariosInactivos.findIndex(x => { return x.codigoSecreto == usuarioNoRegistrado.codigoSecreto });
                if (indice >= 0) {
                    arregloUsuariosInactivos.splice(indice, 1); // lo eliminamos del arreglo
                    USUARIO.modeloUsuario.findByIdAndDelete(usuarioNoRegistrado.usuarioId); // eliminamos al usuario de la base de datos
                }
            });

            const direccionConfirmacion = `${CONFIG.apiBaseURL}/activateAccount/${usuarioNoRegistrado.usuarioId}/${usuarioNoRegistrado.codigoSecreto}`;
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
                    <li>Contraseña: ${req.body.contrasena.replace(/./g, '•')} 
                    (por razones de seguridad no mostramos su contraseña)</li>
                </ul>`
            );
            res.sendStatus(hsc.CREATED);
        });
    },
    passwordRecovery: function (req, res) {
        const query = {
            Email: req.body.email
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res, 
                    'Error al intentar buscar usuario en la base de datos', 
                    `Error al buscar usuario en la base de datos: ${err}`);
            }

            if (queryResult) {
                MAIL.sendMailHTML(query.Email,
                    'Recuperación de contraseña',
                    `<h1>Recupere su contraseña</h1>
                    <p>Su contraseña es: ${CRYPTOGRAPHY.decrypt(queryResult.Contrasena)}</p>
                    <p>Si usted no ha solicitado recuperar su contraseña, puede ignorar este correo</p>`);
                res.status(hsc.OK).json({ respuesta: "Se ha enviado su contraseña al correo" });
            }
            else {
                res.status(hsc.NOT_FOUND).json({ respuesta: "El correo electrónico introducido no existe" });
            }
        });
    },
    activateAccount: function (req, res) {
        const indice = arregloUsuariosInactivos.findIndex(x => {
            return x.usuarioId == req.params.usuarioId && x.codigoSecreto == req.params.codigoSecreto
        });

        if (indice >= 0) {
            arregloUsuariosInactivos.splice(indice, 1);

            USUARIO.modeloUsuario.findByIdAndUpdate(req.params.usuarioId, { Activo: true }, (err, queryResult) => {
                if (err) {
                    return ERROR.sendErrorResponse(res, 
                        'Error al intentar activar su cuenta', 
                        `Error al actualizar usuario en la base de datos: ${err}`);
                }

                res.status(hsc.OK).send('¡Su cuenta ha sido activada con éxito!');
            });
        }
        else {
            res.send('El enlace para activar su cuenta ha caducado');
        }
    }
};

module.exports = loginController;
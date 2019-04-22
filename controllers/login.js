const USUARIO = require('../models/usuario');
const TOKEN = require('../util/token');
const MAIL = require('../util/mail');

const login = {
    login: function (req, res) {
        let query = {
            Email: req.body.email,
            Contrasena: req.body.contrasena
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                res.status(500).send({ respuesta: `Error al buscar usuario en la base de datos: ${err}` });
            }

            if (queryResult) {
                res.status(200).send({ token: TOKEN.createToken(queryResult) });
            }
            else {
                res.status(404).send({ respuesta: "El email y/o la contraseña no coinciden" });
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
                res.status(500).send({ respuesta: `Error al guardar nuevo usuario en la base de datos: ${err}` });
            }

            let htmlCorreo = `<h1>¡Genial!</h1>
            <p>Su nueva cuenta ha sido creada con éxito</p>
            <p>Su cuenta ha sido registrada con los siguientes datos:</p>
            <ul>
                <li>Nombre: ${nuevoUsuario.Nombre}</li>
                <li>Apellidos: ${nuevoUsuario.Apellidos}</li>
                <li>Email: ${nuevoUsuario.Email}</li>
                <li>Contraseña: ${nuevoUsuario.Contrasena.replace(/./g, '•')} (por razones de seguridad no mostramos su contraseña)</li>
            </ul>`;
            MAIL.sendMailHTML(nuevoUsuario.Email,
                'Su cuenta ha sido creada con éxito',
                htmlCorreo
            );
            res.status(200).send({ usuario: usuarioStored });
        });
    },
    recoverPassword: function (req, res) {
        let query = {
            Email: req.body.email
        };

        USUARIO.modeloUsuario.findOne(query, (err, queryResult) => {
            if (err) {
                res.status(500).send({ respuesta: `Error al buscar usuario en la base de datos: ${err}` });
            }

            if (queryResult) {
                MAIL.sendMail(query.Email, 'Recuperación de contraseña', `Su contraseña es: ${queryResult.Contrasena}`);
                res.status(200).send({ respuesta: "Se ha enviado su contraseña al correo" });
            }
            else {
                res.status(404).send({ respuesta: "El email introducido no existe" });
            }
        });
    }
}

module.exports = login;
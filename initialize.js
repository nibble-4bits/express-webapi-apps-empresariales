'use strict';

const USUARIO = require('./models/usuario');
const CRYPTOGRAPHY = require('./util/cryptography');

function initialize() {
    USUARIO.modeloUsuario.findOne({ Tipo: USUARIO.tipoUsuario.IT }, (err, res) => {
        if (res) {
            return;
        }

        let usuarioIT = new USUARIO.modeloUsuario({
            Nombre: 'Jorge',
            Apellidos: 'Rangel Luna',
            Contrasena: CRYPTOGRAPHY.encrypt('usuarioIT'),
            Email: 'jorgearturo99@live.com.mx',
            Tipo: USUARIO.tipoUsuario.IT,
            Activo: true
        });
    
        usuarioIT.save((err, usuarioStored) => {
            if (err) {
                console.log(err);
            }
        });
    });

    USUARIO.modeloUsuario.findOne({ Tipo: USUARIO.tipoUsuario.IT_MANAGER }, (err, res) => {
        if (res) {
            return;
        }

        let managerIT = new USUARIO.modeloUsuario({
            Nombre: 'Luis',
            Apellidos: 'De Anda Cuellar',
            Contrasena: CRYPTOGRAPHY.encrypt('managerIT'),
            Email: 'andiyasha16@gmail.com',
            Tipo: USUARIO.tipoUsuario.IT_MANAGER,
            Activo: true
        });
    
        managerIT.save((err, usuarioStored) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

module.exports = initialize;
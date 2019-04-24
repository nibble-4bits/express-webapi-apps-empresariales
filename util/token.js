'use strict';

const jwt = require('jsonwebtoken');

const secretKey = 'LLAVE_SECRETA_API_REST';

const opcionesToken = {
    expiresIn: '30m' // el token expira a los 30 minutos
};

const jwtFunctions = {
    createToken: function (usuario) {
        return jwt.sign({
            Id: usuario._id,
            Nombre: usuario.Nombre,
            Apellidos: usuario.Apellidos,
            Email: usuario.Email,
            Tipo: usuario.Tipo
        },
        secretKey,
        opcionesToken);
    },
    validateToken: function (token) {
        try {
            let decodedToken = jwt.verify(token, secretKey);
            return decodedToken;
        }
        catch (err) {
            console.log(err.message);
            return undefined;
        }
    }
};

module.exports = jwtFunctions;
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
        let decodedToken = jwt.verify(token, secretKey);

        console.log(decodedToken);
    }
};

module.exports = jwtFunctions;
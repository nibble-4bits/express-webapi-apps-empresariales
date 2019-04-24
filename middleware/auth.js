'use strict';

const hsc = require('http-status-codes');

const TOKEN = require('../util/token');

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(hsc.UNAUTHORIZED).json({ respuesta: 'No tiene autorización para acceder al recurso solicitado' });
    }

    const jwt = req.headers.authorization.split(' ')[1];
    const decodedJWT = TOKEN.validateToken(jwt);

    if (decodedJWT) {
        next();
    }
    else {
        res.status(hsc.UNAUTHORIZED).json({ respuesta: 'Su token ha expirado o es inválido' });
    }
}

module.exports = isAuth
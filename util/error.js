'use strict';

const hsc = require('http-status-codes');

const errorFunctions = {
    /**
     * Una función que devuelve una respuesta con código de estatus 500 y un JSON que explica el error
     * @param {*} res El objeto 'res' de Express, que permite enviar la respuesta al cliente
     * @param {*} message Un mensaje de error para el usuario
     * @param {*} error Un mensaje de error para el desarrollador (un mensaje más descriptivo)
     */
    sendErrorResponse: function (res, message, error) {
        res.status(hsc.INTERNAL_SERVER_ERROR).json({ 
            respuesta: {
                statusCode: hsc.INTERNAL_SERVER_ERROR,
                message: message,
                error: error
            }
        });
    }
}

module.exports = errorFunctions;
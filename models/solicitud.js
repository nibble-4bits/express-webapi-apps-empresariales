'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

const SolicitudSchema = new mongoose.Schema({
    IdUsuario: Number,
    UsuarioIT: { type: Object, default: null }, // Ejemplo: { IdUsuarioIT: 1, NombreCompleto: "Miguel Hernández"}
    FechaCreacion: Date,
    FechaEnProceso: { type: Date, default: null },
    FechaTerminado: { type: Date, default: null },
    Razon: String,
    ComentariosIT: Array,
    RutaDocumento: { type: String, default: null },
    Prioridad: { type: Number, min: 0, max: 2 } // 0 - BAJA, 1 - MEDIA, 2 - ALTA
});

// Agregamos el plugin que permite que cada _id sea autoincrementable y numérico
SolicitudSchema.plugin(autoIncrement.plugin, { modelName: 'Solicitud' });

module.exports = {
    modeloSolicitud: mongoose.model('Solicitud', SolicitudSchema),
    prioridad: {
        BAJA: 0,
        MEDIA: 1,
        ALTA: 2
    }
};
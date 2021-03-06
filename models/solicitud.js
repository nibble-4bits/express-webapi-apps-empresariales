'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

const SolicitudSchema = new mongoose.Schema({
    UsuarioComun: { IdUsuarioComun: { type: Number }, NombreCompleto: { type: String } }, // Ejemplo: { IdUsuarioComun: 3, NombreCompleto: "Pedro De Anda"}
    UsuarioIT: { IdUsuarioIT: { type: Number, default: -1 }, NombreCompleto: { type: String, default: '' } }, // Ejemplo: { IdUsuarioIT: 1, NombreCompleto: "Miguel Hernández"}
    FechaCreacion: Date,
    FechaEnProceso: { type: Date, default: null },
    FechaTerminado: { type: Date, default: null },
    Razon: String,
    ComentariosIT: Array, // Ejemplo: { Comentario: "Ejemplo Comentario", Fecha: 2019-04-28T22:35:23.904Z }
    RutaDocumento: { type: String, default: null },
    Prioridad: { type: Number, min: 0, max: 2 }, // 0 - BAJA, 1 - MEDIA, 2 - ALTA
    Duracion: { type: String, default: null }
});

// Agregamos el plugin que permite que cada _id sea autoincrementable y numérico
SolicitudSchema.plugin(autoIncrement.plugin, { modelName: 'Solicitud' });

module.exports = {
    modeloSolicitud: mongoose.model('Solicitud', SolicitudSchema),
    prioridad: {
        BAJA: 0,
        MEDIA: 1,
        ALTA: 2
    },
    getPrioridadString: function (prioridadNumero) {
        if (prioridadNumero === 0) {
            return 'Baja';
        }
        else if (prioridadNumero === 1) {
            return 'Media';
        }
        else if (prioridadNumero === 2) {
            return 'Alta';
        }
        return 'Desconocida';
    }
};
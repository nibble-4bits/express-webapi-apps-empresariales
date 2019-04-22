'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

const UsuarioSchema = new mongoose.Schema({
    Nombre: String,
    Apellidos: String,
    Contrasena: String,
    Email: { type: String, unique: true },
    Tipo: Number // 0 - comun, 1 - IT, 2 - IT Manager
});

// Agregamos el plugin que permite que cada _id sea autoincrementable y numérico
UsuarioSchema.plugin(autoIncrement.plugin, {modelName: 'Usuario'});

module.exports = {
    modeloUsuario: mongoose.model('Usuario', UsuarioSchema),
    tipoUsuario: {
        COMUN: 0,
        IT: 1,
        IT_MANAGER: 2
    }
};
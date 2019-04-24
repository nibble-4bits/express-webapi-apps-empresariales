'use strict';

const hsc = require('http-status-codes');
const randString = require('randomstring');

const USUARIO = require('../models/usuario');
const SOLICITUD = require('../models/solicitud');
const MAIL = require('../util/mail');
const CONFIG = require('../config');
const TASK_SCHEDULER = require('../util/taskScheduler');
const ERROR = require('../util/error');

const ITUserControler = {
    getDocument: function (req, res) {
        
    },
    addCommentSolicitud: function (req, res) {

    },
    assignFechaEnProceso: function (req, res) {
        
    },
    assignFechaTerminado: function (req, res) {
        
    }
};

module.exports = ITUserControler;
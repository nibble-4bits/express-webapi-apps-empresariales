'use strict';

const cron = require('node-cron');

const taskSchedulerFunctions = {
    /**
     * Esta función ejecuta una función que se ejecutará una sola vez dentro de 10 minutos
     * @param {Function} taskToRun La función que está programada para ejecutarse en 10 minutos
     */
    scheduleTaskAndRunOnceIn10Minutes: function (taskToRun) {
        let task = new cron.schedule('* */10 * * * *', () => {
            taskToRun();
            task.destroy();
        });
    
        task.start();
    }
};

module.exports = taskSchedulerFunctions;
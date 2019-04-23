'use strict';

const mail = require('nodemailer');
const CONFIG = require('../config');

const transporter = mail.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: CONFIG.mail.fromEmail,
        pass: CONFIG.mail.password
    }
});

const mailFunctions = {
    sendMail: function (toEmail, mailSubject, mailBody) {
        const mailOptions = {
            from: CONFIG.mail.fromEmail,
            to: toEmail,
            subject: mailSubject,
            text: mailBody
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    sendMailHTML: function (toEmail, mailSubject, mailBody) {
        const mailOptions = {
            from: CONFIG.mail.fromEmail,
            to: toEmail,
            subject: mailSubject,
            html: mailBody
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    sendMailToMany: function (toEmails, mailSubject, mailBody) {
        const mailOptions = {
            from: CONFIG.mail.fromEmail,
            to: toEmails.join(', '),
            subject: mailSubject,
            text: mailBody
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    sendMailToManyHTML: function (toEmails, mailSubject, mailBody) {
        const mailOptions = {
            from: CONFIG.mail.fromEmail,
            to: toEmails.join(', '),
            subject: mailSubject,
            html: mailBody
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};

module.exports = mailFunctions;
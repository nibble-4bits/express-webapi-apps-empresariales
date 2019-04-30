'use strict';

const randString = require('randomstring');
const fs = require('fs');
const aws = require('aws-sdk');
const mimeTypes = require('mime-types');

const CONFIG = require('../config');

const fileUploadUtilController = {
    /**
     * Una función que sube un archivo a un repositorio local o remoto, dependiendo
     * de donde se despliegue la aplicación.
     * @param {Array<File>} files Un arreglo de archivos enviados por el cliente
     */
    uploadFile: function (files) {
        let filePath = null;

        for (const file in files) {
            if (files.hasOwnProperty(file)) {
                const archivo = files[file];
                const fileExtension = archivo.name.split('.')[1];

                if (CONFIG.uploadLocally === 'true') {
                    // Buscamos si el usuario envió algún archivo, 
                    // lo guardamos en la carpeta configurada como repositorio 
                    // y creamos la ruta que se guardará en base de datos
                    filePath = `${CONFIG.fileRepoPath}/${randString.generate()}.${fileExtension}`;
                    fs.writeFile(filePath, archivo.data, err => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    let s3 = new aws.S3({
                        secretAccessKey: CONFIG.cloudCube.secretKey,
                        accessKeyId: CONFIG.cloudCube.accessKey,
                        region: 'us-east-1'
                    });
                    let myBucket = 'cloud-cube';
                    let key = `a0ojbietvhmi/public/${randString.generate()}.${fileExtension}`;
                    filePath = `${CONFIG.fileRepoPath}/${key}`;

                    let params = { 
                        Bucket: myBucket, 
                        Key: key,
                        ContentDisposition: 'inline', // para que el archivo se abra en el navegador y no sea descargado
                        ContentType: mimeTypes.lookup(fileExtension),
                        ContentLength: archivo.data.length, 
                        Body: archivo.data 
                    };
                    
                    // Subimos nuestro archivo a nuestro Bucket en AWS S3
                    s3.putObject(params, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Successfully uploaded data to myBucket/myKey");
                        }
                    });
                }
            }
        }
        return filePath;
    }
};

module.exports = fileUploadUtilController;
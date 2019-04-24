'use strict';

module.exports = {
    port: process.env.PORT,
    mail: {
        fromEmail: process.env.FROM_EMAIL,
        password: process.env.EMAIL_PASSWORD
    },
    database: {
        connectionString: process.env.MONGODB_URI
    },
    apiBaseURL: process.env.BASE_URL,
    fileRepoPath: process.env.FILE_REPO_PATH,
    uploadLocally: process.env.UPLOAD_LOCALLY,
    cloudCube: {
        accessKey: process.env.CLOUDCUBE_ACCESS_KEY_ID,
        secretKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
        url: process.env.CLOUDCUBE_URL
    }
};
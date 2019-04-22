module.exports = {
    port: process.env.PORT || 3000,
    mail: {
        fromEmail: process.env.FROM_EMAIL || 'master.programmer.delasalle@gmail.com',
        password: process.env.EMAIL_PASSWORD || 'Programacion1'
    },
    database: {
        connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/appEmpresariales'
    }
};
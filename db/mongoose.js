let mongoose = require('mongoose');


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});

module.exports = { mongoose };
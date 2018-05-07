// Requires
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

// Inicializar variables
let app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server: \x1b[32m%s\x1b[0m', 'online');
});
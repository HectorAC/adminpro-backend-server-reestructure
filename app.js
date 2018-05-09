// Requires
let express = require('express');
let bodyParser = require('body-parser');

// Inicializar variables
let app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mongoose
const mongoose = require('./db/mongoose');

// Server index config 
// let serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

const routes = require('./routes.js');

// Rutas
app.use('/', routes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server: \x1b[32m%s\x1b[0m', 'online');
});
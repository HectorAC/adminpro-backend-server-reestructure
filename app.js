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

// Importar rutas
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');
let hospitalRoutes = require('./routes/hospital');
let medicoRoutes = require('./routes/medico');
let busquedaRoutes = require('./routes/busqueda');
let uploadRoutes = require('./routes/upload');
let imagenesRoutes = require('./routes/imagenes');

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server: \x1b[32m%s\x1b[0m', 'online');
});
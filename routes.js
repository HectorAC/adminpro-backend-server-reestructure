let express = require('express');
let fileUpload = require('express-fileupload');
let router = express.Router();

let app = express();
// default options
app.use(fileUpload());

let appRoutes = require('./routes/app');
let loginRoutes = require('./routes/login');
let usuarioRoutes = require('./routes/usuario');
let medicoRoutes = require('./routes/medico');
let hospitalRoutes = require('./routes/hospital');
let busquedaRoutes = require('./routes/busqueda');
let uploadRoutes = require('./routes/upload');
let imagenesRoutes = require('./routes/imagenes');

let mdAutenticacion = require('./middlewares/autenticacion');

//--------------------APP----------------------//
router.route('/').get(appRoutes.get);
//--------------------LOGIN----------------------//
let login = '/login';
router.route(login + '/google').post(loginRoutes.googleSign);
router.route(login).post(loginRoutes.postSign);
//--------------------USUARIO----------------------//
let usuario = '/usuario';
router.route(usuario).get(usuarioRoutes.get);
router.route(usuario).post(mdAutenticacion.verificaToken, usuarioRoutes.post);
router.route(usuario + '/:id').put(mdAutenticacion.verificaToken, usuarioRoutes.put);
router.route(usuario + '/:id').delete(mdAutenticacion.verificaToken, usuarioRoutes.delete);
//--------------------MEDICO----------------------//
let medico = '/medico';
router.route(medico).get(medicoRoutes.get);
router.route(medico).post(mdAutenticacion.verificaToken, medicoRoutes.post);
router.route(medico + '/:id').put(mdAutenticacion.verificaToken, medicoRoutes.put);
router.route(medico + '/:id').delete(mdAutenticacion.verificaToken, medicoRoutes.delete);
// //--------------------HOSPITAL----------------------//
let hospital = '/hospital';
router.route(hospital).get(hospitalRoutes.get);
router.route(hospital).post(mdAutenticacion.verificaToken, hospitalRoutes.post);
router.route(hospital + '/:id').put(mdAutenticacion.verificaToken, hospitalRoutes.put);
router.route(hospital + '/:id').delete(mdAutenticacion.verificaToken, hospitalRoutes.delete);
// //--------------------BUSQUEDA----------------------//
let busqueda = '/busqueda';
router.route(busqueda + '/todo/:busqueda').get(busquedaRoutes.all);
router.route(busqueda + '/coleccion/:tabla/:busqueda').get(busquedaRoutes.get);
// //--------------------UPLOAD----------------------//
router.route('/upload/:tipo/:id').put(fileUpload(), uploadRoutes.put);
// //--------------------IMAGENES----------------------//
router.route('/:tipo/:img').get(imagenesRoutes.get);

module.exports = router;
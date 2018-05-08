let express = require('express');

let fileUpload = require('express-fileupload');
let fs = require('fs');

let app = express();

let { Hospital } = require('../models/hospital');
let { Medico } = require('../models/medico');
let Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //tipos de colección
    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección no valida',
            errors: { message: 'Colección no valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }


    // Obtener nombre del archivo
    let archivo = req.files.imagen;
    let cutFile = archivo.name.split('.');
    let extensionFile = cutFile.pop().toLowerCase();

    // Extensiones permitidas
    let validExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExt.indexOf(extensionFile) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            extensionFile,
            errors: { message: 'Las extensiones válidas son ' + validExt.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionFile}`;

    // Mover archivo del temporal a un path
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res)
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, '-password').then(usuario => {

            if (!usuario) {
                return res.status(404).json({ ok: false, mensaje: 'usuario no encontrado' });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(404).json({ ok: false, mensaje: 'medico no encontrado' });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(404).json({ ok: false, mensaje: 'hospital no encontrado' });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });

        });
    }
}


module.exports = app;
let { Hospital } = require('../models/hospital');
let { Medico } = require('../models/medico');
let Usuario = require('../models/usuario');

module.exports = {
    all: (req, res, next) => {

        let busqueda = req.params.busqueda;
        let regExp = new RegExp(busqueda, 'i');

        Promise.all([
                buscarHospitales(busqueda, regExp),
                buscarMedicos(busqueda, regExp),
                buscarUsuarios(busqueda, regExp)
            ])
            .then(respuesta => {
                let [hospitales, medicos, usuarios] = respuesta;

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    medicos: medicos,
                    usuarios: usuarios
                });
            })
            .catch(err => {
                res.status(500).json({
                    ok: false,
                    message: 'Error realizando la busqueda',
                    errors: err,
                    param: req.params.busqueda
                })
            });
    },
    // ===============================
    //  Busqueda por colección
    // ===============================
    get: (req, res) => {

        let busqueda = req.params.busqueda;
        let tabla = req.params.tabla;
        let regExp = new RegExp(busqueda, 'i');
        let promesa;

        switch (tabla) {
            case 'hospitales':
                promesa = buscarHospitales(busqueda, regExp);
                break;
            case 'usuarios':
                promesa = buscarUsuarios(busqueda, regExp);
                break;
            case 'medicos':
                promesa = buscarMedicos(busqueda, regExp);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los tipos de busqueda solo son: usuarios medicos y hospitales',
                    error: { message: 'Tipo de tabla/colección no válido' }
                });
        }

        promesa.then(data => {
            res.status(200).json({
                ok: true,
                [tabla]: data
            });
        }).catch(err => {
            res.status(500).json({
                ok: false,
                message: 'Error realizando la busqueda',
                errors: err
            })
        });

    }
}

function buscarHospitales(busqueda, regExp) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regExp })
            .populate('usuario', 'nombre email')
            .then(hospitales => {
                resolve(hospitales);
            }).catch(err => {
                reject('Error al cargar hospitales', err);
            });
    });
}

function buscarMedicos(busqueda, regExp) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regExp })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .then(medicos => {
                resolve(medicos);
            }).catch(err => {
                reject('Error al cargar medicos', err);
            });
        // .exec((err, medicos) => {
        //     if (err) {
        //         reject('Error al cargar hospitales', err);
        //     } else {
        //         resolve(medicos);
        //     }
        // });
    });
}


function buscarUsuarios(busqueda, regExp) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, '-password')
            .or([{ 'nombre': regExp }, { 'email': regExp }])
            .then(usuarios => { resolve(usuarios) })
            .catch(err => reject('error al cargar usuarios', err));

    });
}
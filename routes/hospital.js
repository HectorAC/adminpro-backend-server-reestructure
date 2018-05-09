let { ObjectID } = require('mongodb');
let bcrypt = require('bcryptjs');
let { Hospital } = require('../models/hospital');

// Rutas

// ===============================
// Obtener todos los hospitales
// ===============================
module.exports = {
    get: (req, res) => {

        let desde = req.query.desde || 0;
        desde = Number(desde);

        Hospital.find({})
            .populate('usuario', 'nombre email')
            .limit(5)
            .skip(desde)
            .then((hospitales) => {
                Hospital.count({}, (err, conteo) => {
                    res.status(200).send({
                        ok: true,
                        hospitales,
                        total: conteo
                    })
                });
            }).catch(e => {
                res.status(500).send({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                })
            });
    },

    // ===============================
    // Crear un nuevo hospital
    // ===============================
    post: (req, res) => {

        let body = req.body;

        let hospital = new Hospital({
            nombre: body.nombre,
            usuario: req.usuario._id
        });

        hospital.save().then((hospitalGuardado) => {
            res.status(201).json({
                ok: true,
                hospitalGuardado,
                usuario: req.usuario
            })
        }).catch(e => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error guadando hospital',
                errors: e.errors
            });
        });
    },

    // ===============================
    // Actualizar un hospital
    // ===============================
    put: (req, res) => {

        let id = req.params.id;
        let body = req.body;

        if (!ObjectID.isValid(req.params.id)) {
            return res.status(404).json({ error: 'El id no es correcto' });
        }

        Hospital.findByIdAndUpdate(id, {
            nombre: body.nombre,
            usuario: req.usuario._id
        }).then((hospitalActualizado) => {
            if (!hospitalActualizado) {
                res.status(404).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                });
            }
            res.status(200).json({
                ok: true,
                hospitalActualizado
            })
        }).catch((error) => {
            res.status(500).json({
                ok: false,
                error
            })
        });
    },
    // ===============================
    //  Eliminar hospital
    // ===============================
    delete: (req, res) => {

        let id = req.params.id;
        let body = req.body;

        if (!ObjectID.isValid(req.params.id)) {
            return res.status(404).json({ error: 'El id no es correcto' });
        }

        Hospital.findByIdAndRemove(id)
            .then((hospitalBorrado) => {
                if (!hospitalBorrado) {
                    res.status(404).json({
                        ok: false
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospitalBorrado
                })
            }).catch((err) => {
                res.status(200).json({
                    error: e.message
                });
            });
    }
}
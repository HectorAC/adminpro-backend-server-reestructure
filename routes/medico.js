let express = require('express');
const { ObjectID } = require('mongodb');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let { Medico } = require('../models/medico');


// ===============================
// Obtener todos los medicos
// ===============================
app.get('/', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .limit(5)
        .skip(desde)
        .populate('hospital')
        .populate('usuario', 'nombre email')
        .then((medicos) => {
            Medico.count({}, (err, conteo) => {
                res.status(200).send({
                    ok: true,
                    medicos,
                    total: conteo
                })
            });
        }).catch(e => {
            res.status(500).send({
                ok: false,
                mensaje: 'Error cargando medicos',
                errors: err
            });

        });
});

// ===============================
// Crear un nuevo medico
// ===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save().then((medicoGuardado) => {
        res.status(201).json({
            ok: true,
            medicoGuardado
        })
    }).catch(e => {
        res.status(400).json({
            ok: false,
            mensaje: 'Error guadando medico',
            errors: e.errors
        });
    });
})

// ===============================
// Actualizar medico
// ===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).json({ error: 'El id no es correcto' });
    }

    Medico.findByIdAndUpdate(id, {
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    }).then((medicoActualizado) => {
        if (!medicoActualizado) {
            res.status(404).json({
                ok: false,
                mensaje: 'Error actualizando usuario'
            });
        }
        res.status(200).json({
            ok: true,
            medicoActualizado
        })
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        })
    });
});

// ===============================
//  Eliminar medico
// ===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).json({ error: 'El id no es correcto' });
    }

    Medico.findByIdAndRemove(id)
        .then((medicoBorrado) => {
            if (!medicoBorrado) {
                res.status(404).json({
                    ok: false
                });
            }
            res.status(200).json({
                ok: true,
                medicoBorrado
            })
        }).catch((err) => {
            res.status(200).json({
                error: e.message
            });
        });
})

module.exports = app;
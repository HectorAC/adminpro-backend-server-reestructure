let express = require('express');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;
let app = express();
let Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            })
        }


        // Crear token!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            mensaje: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    })


})

module.exports = app;
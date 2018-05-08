let jwt = require('jsonwebtoken');
let SEED = require('../config/config').SEED;

// ===============================
// Verificar token
// ===============================
exports.verificaToken = function(req, res, next) {

    // esto seria para mandarlo por parametro usuario?token=
    // let token = req.query.token;

    let token = req.header('x-auth');

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // Añadimos el usuario para poder tenerlo en el req de las llamadas
        req.usuario = decoded.usuario;

        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // })
    });


}
let express = require('express');
let app = express();

// Rutas
module.exports = {
    get: (req, res, next) => {

        res.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente'
        });

    }
};
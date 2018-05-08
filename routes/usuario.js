let express = require('express');
let bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Usuario = require('../models/usuario');

// Rutas

// ===============================
// Obtener todos los usuarios
// ===============================
app.get('/', (req, res, next) => {

    // localhost:3000/usuario?desde=5
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Usuario.find({}, '-password')
    Usuario.find({}, 'nombre email img role')
        .limit(5)
        .skip(desde)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });

    // Prueba de mongoose-pagination
    // Usuario.paginate({}, {
    //     select: '-password',
    //     offset: desde,
    //     limit: 5
    // }).then(usuarios => {
    //     res.json(usuarios)
    // }).catch(err => {
    //     res.json(err);
    // });


});

// ===============================
// Crear un nuevo usuario
// ===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err.errors
            });
        }

        res.status(201).json({
            ok: true,
            usuarioGuardado: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

    // Otra forma 
    // usuario.save().then((doc) => {
    //     //Send the doc back
    //     res.send(doc);
    // }).catch((e) => {
    //     res.status(400).send(e.message);
    // });
});


// ===============================
// Actualizar usuario
// ===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }

    Usuario.findById(id, '-password')
        .exec(
            (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error actualizando usuario',
                        errors: err
                    });
                }



                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El usuario con el id ' + id + ' no existe',
                        errors: { message: 'No existe ese usuario con ese ID' }
                    })
                }

                usuario.nombre = body.nombre;
                usuario.email = body.email;
                usuario.rol = body.rol;

                usuario.save((err, usuarioGuardado) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error actualizando usuario',
                            errors: err.errors
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado
                    });

                })
            });

    //Otras formas        

    // Usuario.findOneAndUpdate(id, {
    //         $set: body
    //     }, {
    //         new: true,
    //         select: '-password'
    //     })
    //     .then((todo) => {
    //         if (!todo) {
    //             return res.status(404).send();
    //         }
    //         res.status(200).send({
    //             ok: true,
    //             todo
    //         });
    //     }).catch((e) => {
    //         res.status(400).send(e.message);
    //     })

    // Usuario.findByIdAndUpdate(id, {
    //         $set: body
    //     }, {
    //         new: true
    //     })
    //     .then((todo) => {
    //         if (!todo) {
    //             return res.status(404).send();
    //         }
    //         res.status(200).send({
    //             ok: true,
    //             todo
    //         });
    //     }).catch((e) => {
    //         res.status(400).send(e.message);
    //     })
});

// ===============================
//  Eliminar usuario
// ===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuarioBorrado: usuarioBorrado
        });
    });

    // Otra forma
    // Usuario.findOneAndRemove({
    //     _id: id
    // }, {
    //     select: '-password'
    // }).then((usuario) => {
    //     if (!usuario) {
    //         return res.status(404).send({ ok: false });
    //     }
    //     //Send the doc back
    //     res.status(200).send({ usuario });
    // }).catch((e) => {
    //     res.status(200).send(e.message);
    // });

})
module.exports = app;
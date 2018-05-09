let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        uppercase: true,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    google: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

// Forma para no devolver el password
// usuarioSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     return userObject;
// };

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
usuarioSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Usuario', usuarioSchema);
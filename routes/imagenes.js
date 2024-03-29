const path = require('path');
const fs = require('fs');
// Rutas

module.exports = {
    get: (req, res, next) => {

        let tipo = req.params.tipo;
        let img = req.params.img;
        let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen)
        } else {
            let pathNotImage = path.resolve(__dirname, `../assets/no-img.jpg`);
            res.sendFile(pathNotImage)
        }
    }
}
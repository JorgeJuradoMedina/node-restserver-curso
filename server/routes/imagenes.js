const express = require('express');
const fs = require('fs');

// declaramos el path
const path = require('path');

const { verificatokenimg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificatokenimg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);

    } else {
        // path absoluto de la imagen
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
            // en esta parte de la seccion se observca que la funcion puede ser obsoleta y queda de la siguiente manera
            // sendFile
            // sendfile
            // res.sendfile('./server/assets/no-image.jpg');
        res.sendFile(noImagePath);

    }


})

module.exports = app;
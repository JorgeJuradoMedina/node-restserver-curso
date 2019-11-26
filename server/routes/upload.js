const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// llamar el esquema de usuarios para hacer un regsitro en la base de daots
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');

const path = require('path');


// fucion transformalos carchivos que se suban y les agrega un nombre
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // conficion que revisa si hay un archico cargado
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            })
    }

    // validar tipos

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    // Este sera el nombre que se le colocara con un POST
    let archivo = req.files.archivo;
    // sirve para separar el nombre del archivo 
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extenciones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // cambiar nombre al archivo
    // new Date().getMilliseconds() sirve para de algun modo borrar o burlar la memoria cache del navegador web
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        // Aqui se carga la imagen
        /* en esta seccion 
        se comenta y llamamos a la funcion que queremos que 
        cargue la imagen y por consigueinte se comenta
        esta linea
         */
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
        if (tipo === 'usuarios') {
            imagenUsario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);

        }
    });
});

function imagenUsario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la Base de datos'
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la Base de datos'
                }
            });
        }
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, prodcutoGuardado) => {

            res.json({
                ok: true,
                producto: prodcutoGuardado,
                img: nombreArchivo
            })
        });
    });
}


function borraArchivo(nombreImagen, tipo) {
    // variable para revisar el path de la imagen y hacer la condicion de carga de la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        // sirve para borrar archivos pero debemos 
        // tener cuidado ya que si no tenemos cuidado podemos borrar archivos
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;
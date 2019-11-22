require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// sirve para mandar segmentos del path y armar la direccion correcta
const path = require('path');
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // habilitar la carpeta public para que sea visible y se pueda acceder
app.use(express.static(path.resolve(__dirname, '../public')));



//configuracion del index
app.use(require('./routes/index'));

//app.use(require('./routes/usuario'));
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
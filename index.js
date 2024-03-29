require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/config');
const cors = require('cors');

//crear el servidor de express
const app = express();

//configurar CORS
app.use(cors());

//folder publico
app.use(express.static('public'));

//lectura y parseo del body
app.use( express.json());

//base de datos
dbConnection();

//rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Server corriendo en puerto ' + process.env.PORT)
});
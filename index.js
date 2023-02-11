require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/config');
const cors = require('cors');

//crear el servidor de express
const app = express();

//configurar CORS
app.use(cors());

//lectura y parseo del body
app.use( express.json());

//base de datos
dbConnection();

//rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Server corriendo en puerto ' + process.env.PORT)
});
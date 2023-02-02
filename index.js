require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/config');
const cors = require('cors');

//crear el servidor de express
const app = express();

//configurar CORS
app.use(cors());

//base de datos
dbConnection();

//rutas
app.get('/', (req, res) => {
    console.log('Hello World');
    res.json({
        Ok: true,
        msg: 'Hello World'
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server corriendo en puerto ' + process.env.PORT)
});
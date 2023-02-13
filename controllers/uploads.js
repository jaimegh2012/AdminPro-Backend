const { request, response } = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = async(req = request, res = response) => {

    const {id, tipo} = req.params;

    const tipos = ['hospitales', 'medicos', 'usuarios'];
    if (!tipos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo deber ser usurio, medico u hospital'
        })
    }

    //validar que exista la imagen
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'Imagen no enviada'
        })
    }

    //procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension no permitida'
        })
    }

    //generar nombre archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //generar ruta archivo
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen
    file.mv(path, function(err) {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo mover la imagen'
            })
        }

        //actualizar imagen en db
        actualizarImagen(tipo, id, path, nombreArchivo);
    
        res.json({
            ok: true,
            tipo,
            id,
            nombreArchivo,
            path
        })
    });
    

}


const retornarImagen = (req = request, res = response) => {
    const {tipo, foto} = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    
    //validar si la imagen existe
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    retornarImagen
}
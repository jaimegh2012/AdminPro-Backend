const { request, response } = require("express");
const Hospital = require("../models/hospital");
const Usuario = require("../models/usuario");
const Medico = require("../models/medico");



const getTodo = async(req = request, res = response) => {

    const termino = req.params.busqueda;

    const regex = new RegExp(termino, 'i');

    
    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({nombre: regex}),
        Hospital.find({nombre: regex}),
        Medico.find({nombre: regex}),
    ]);

    res.json({
        ok: true,
        termino,
        usuarios,
        hospitales,
        medicos
    })
}
const getDocumentoColeccion = async(req = request, res = response) => {


    const tabla = req.params.tabla;
    const termino = req.params.busqueda;

    const regex = new RegExp(termino, 'i');

    let data = [];
    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({nombre: regex});
            break;
        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                .populate('usuario', 'nombre img');
            break;
        case 'medicos':
            data = await Medico.find({nombre: regex})
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            break;
        default:
            return res.status(401).json({
                ok: false,
                msg: 'La tabla deber ser usuarios hospitales o medicos'
            })
    }


    res.json({
        ok: true,
        data
    })
}

module.exports = {
    getTodo,
    getDocumentoColeccion
}
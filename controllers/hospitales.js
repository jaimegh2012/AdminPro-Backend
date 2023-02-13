const { request, response } = require("express");
const Hospital = require('../models/hospital');


const getHospitales = async(req = request, res = response) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img'); 

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req = request, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });
    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            msg: 'crear Hospitales'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

const actualizarHospital = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'actualizar Hospitales'
    })
}

const borrarHospital = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'borrar Hospitales'
    })
}




module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
const { request, response } = require("express");
const Medico = require('../models/medico');


const getMedicos = async(req = request, res = response) => {
    
    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre');
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req = request, res = response) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDb = await medico.save();

        res.json({
            ok: true,
            msg: 'crear Medico',
            medicoDb
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

const actualizarMedico = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'actualizar Medico'
    })
}

const borrarMedico = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'borrar Medico'
    })
}




module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
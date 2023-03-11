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

const actualizarMedico = async(req = request, res = response) => {

    try {

        const id = req.params.id;
        const uid = req.uid;

        const medicoDb = await Medico.findById(id);

        if (!medicoDb) {
            res.status(404).json({
                ok: false,
                msg: 'medico por id no encontrado'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            msg: 'medico actualizado',
            medico: medicoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, Hable con el admin'
        });
    }
}

const borrarMedico = async(req = request, res = response) => {

    try {

        const id = req.params.id;

        const medicoDb = await Medico.findById(id);

        if (!medicoDb) {
            res.status(404).json({
                ok: false,
                msg: 'medico por id no encontrado'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'medico eliminado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, Hable con el admin'
        });
    }
}




module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
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

const actualizarHospital = async(req = request, res = response) => {

    try {
        
        const id = req.params.id;
        const uid = req.uid;

        const hospitalDb = await Hospital.findById(id);

        if (!hospitalDb) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        //new es para que regrese el ultimo documento actualizado
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true})

        res.json({
            ok: true,
            msg: 'actualizar Hospitales',
            uid,
            hospital: hospitalActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, hable con el admin'
        })
    }
}

const borrarHospital = async(req = request, res = response) => {

    try {
        
        const id = req.params.id;

        const hospitalDb = await Hospital.findById(id);

        if (!hospitalDb) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, hable con el admin'
        })
    }
}




module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
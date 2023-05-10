const { request, response } = require("express");
const jwt = require('jsonwebtoken');
const usuario = require("../models/usuario");



const validarJWT = (req = request, res = response, next) => {

    const token = req.header('x-token');
    console.log(token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        console.log(uid);

        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
}


const validarADMIN_ROLE = async (req = request, resp = response, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.rol != 'ADMIN_ROLE') {
            return resp.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado para realizar esta accion'
            });
        }

        next();
        
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}


const validarADMIN_ROLEoMismoUsuario = async (req = request, resp = response, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try {
        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.rol === 'ADMIN_ROLE' || uid === id) {
            next();
        }else{
            return resp.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado para realizar esta accion'
            });
        }

        
    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLEoMismoUsuario
}
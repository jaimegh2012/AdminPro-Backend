const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");




const login = async(req = request, res = response) =>{

    try {

        const {email, password} = req.body;
        //validar email

        const usuarioDB = await Usuario.findOne({email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //validar password

        const passwordValida = bcrypt.compareSync(password, usuarioDB.password);

        if (!passwordValida) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            });
        }

        //generar jwt
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            msg: 'Login',
            usuarioDB,
            token
        })
        
    } catch (error) {
        console.log({error});
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrado'
        })
    }
}

module.exports = {
    login,
}
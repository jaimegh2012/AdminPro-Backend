const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const { verifyGoogle } = require("../helpers/google-verify");




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


const googleSingIn = async(req = request, res = response) => {

    try {
        const {email, name, picture} = await verifyGoogle(req.body.token);

        const userDb = await Usuario.findOne({email});

        let user;

        if (!userDb) {
            user = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            user = userDb;
            user.google = true;
        }

        await user.save();

        //generar jwt
        const token = await generarJWT(user.id)

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token no es correcto'
        });
        
    }
}

const renewToken = async(req = request, res = response) => {

    try {
        const uid = req.uid;
         //generar jwt
         const token = await generarJWT(uid)

        res.json({
            ok: true,
            uid,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'El token no ha sido renovado'
        })
    }
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}
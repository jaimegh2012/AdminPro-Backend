const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const  usuarios = await Usuario.find();
    res.json({
        Ok: true,
        usuarios,
        uid: req.uid //mandado desde el middleware validar token
    })
};

const postUsuarios = async(req = request, res = response) => {

    try {    
        const {email, password} = req.body;

        const emailExiste = await Usuario.findOne({email});

        if (emailExiste) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya esta en uso'
            })
        }
    
        const usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
    
        const usuarioNuevo = await usuario.save();

        //generar jwt
        const token = await generarJWT(usuarioNuevo.id)
    
        res.json({
            Ok: true,
            usuario,
            token
        })
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'ha ocurrido un error'
        })
        
    }

};

const putUsuarios = async(req = request, res = response) => {

    const uid = req.params.id;

    try {    

        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        const {password, email, ...campos} = req.body;

        if (usuarioDb.email !== email) {
            const emailExiste = await Usuario.findOne({email});
            if (emailExiste) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email ya está en uso'
                });
            }

        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        
        res.json({
            Ok: true,
            usuarioActualizado
        })
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'ha ocurrido un error'
        })
        
    }

};


const borrarUsuario = async(req = request, res = response) => {
    const uid  = req.params.id;

    try {

        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usario el este id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
}


module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    borrarUsuario
}
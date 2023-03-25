const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;

    // const  usuarios = await Usuario.find({}, 'nombre rol google')
    //                                 .skip(desde)
    //                                 .limit(5);

    // const cantidadUsuarios = await Usuario.count();

    const [usuarios, cantidadUsuarios] = await Promise.all([
        Usuario.find({}, 'nombre img rol google')
                .skip(desde)
                .limit(5),
        Usuario.count()
    ]);

    res.json({
        Ok: true,
        usuarios,
        cantidadUsuarios,
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

        if (!usuarioDb.google) {
            campos.email = email;
        }else if(usuarioDb.email != email){
            return res.status(404).json({
                ok: false,
                msg: 'No esta permitido cambiar el email a un usuario Google'
            })
        }
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
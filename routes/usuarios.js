
/*
    ruta: /api/usuarios
*/

const {Router} = require('express');
const {getUsuarios, postUsuarios, putUsuarios, borrarUsuario} = require('../controllers/usuarios');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLEoMismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post('/',
    [
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('password', 'La password es requerida').not().isEmpty(),
        check('email', 'El email es requerido').not().isEmpty().isEmail(),
        validarCampos
    ],
    postUsuarios
);

router.put('/:id',
    [
        validarJWT,
        validarADMIN_ROLEoMismoUsuario,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('email', 'El email es requerido').not().isEmpty().isEmail(),
        check('rol', 'El rol es requerido').not().isEmpty(),
        validarCampos
    ],
    putUsuarios
);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);

module.exports = router;
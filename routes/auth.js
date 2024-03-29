/*
    ruta: /api/login
*/

const {Router} = require('express');
const { check } = require('express-validator');
const {login, googleSingIn, renewToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();



router.post('/',
    [
        check('email', 'El email es requerido').isEmail(),
        check('password', 'La password es requerida').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post('/google',
    [
        check('token', 'El token es requerido').not().isEmpty(),
        validarCampos
    ],
    googleSingIn
)

router.get('/renew',
    validarJWT,
    renewToken
)



module.exports = router;
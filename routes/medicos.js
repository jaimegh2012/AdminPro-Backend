
/*
    ruta: /api/medicos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getMedicos);
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El id hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El id hospital debe ser válido').isMongoId(),
        check('usuario', 'El id usuario debe ser válido').isMongoId(),
    ],
    actualizarMedico
);

router.delete('/:id',
    validarJWT,
    borrarMedico
);

module.exports = router;
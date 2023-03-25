


/*
    ruta: /api/upload/:tipo/:id
*/

const {Router} = require('express');
const {check} = require('express-validator');
const expressFileUpload = require('express-fileupload');
const { fileUpload, retornarImagen } = require('../controllers/uploads');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use(expressFileUpload());

router.post('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornarImagen);

module.exports = router;


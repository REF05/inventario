const express = require('express');
const router  = express.Router();
const controller = require('../controllers/inventarioController');
const md = require('../middleware/auth');

router.get('/', md.requireAdmin, controller.listar);
router.post('/cambiar/:id', md.requireAdmin, controller.cambiarEstatus);
router.post('/entrada', md.requireAdmin, controller.aumentarInventario);


router.get('/agregar', md.requireAdmin, controller.mostrarFormAgregar);
router.post('/agregar', md.requireAdmin, controller.agregarProducto);


router.get('/alma', md.requireAlmacenista, controller.listarAlma);

module.exports = router;

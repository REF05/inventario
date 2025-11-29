const express = require('express');
const router = express.Router();
const controller = require('../controllers/salidasController');
const md = require('../middleware/auth');

router.get('/', md.requireAlmacenista, controller.listar);
router.post('/sacar', md.requireAlmacenista, controller.sacar);

module.exports = router;
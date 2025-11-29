const express = require('express');
const router  = express.Router();
const controller = require('../controllers/historialController');
const md = require('./../middleware/auth');

router.get('/', md.requireAdmin, controller.listar);

module.exports = router;
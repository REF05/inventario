const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.get('/login', controller.loginForm);
router.post('/login', controller.autenticar);
router.get('/logout', controller.logout);

module.exports = router;
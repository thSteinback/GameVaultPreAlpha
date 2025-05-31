const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/cadastro', authController.showCadastro);
router.post('/cadastro', authController.cadastro);

module.exports = router;

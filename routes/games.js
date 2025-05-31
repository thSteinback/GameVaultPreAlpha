const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', gamesController.listarJogos);
router.get('/favoritos', isAuthenticated, gamesController.listarFavoritos);
router.post('/favoritos/:id', isAuthenticated, gamesController.toggleFavorito);

module.exports = router;

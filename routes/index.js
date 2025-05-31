const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

router.get('/', gamesController.home);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/perfil', isAuthenticated, userController.showPerfil);
router.post('/perfil/avatar', isAuthenticated, upload.single('avatar'), userController.updateAvatar);
router.post('/perfil/banner', isAuthenticated, upload.single('banner'), userController.updateBanner);
router.get('/outro/:id', isAuthenticated, userController.showOutroPerfil);

module.exports = router;

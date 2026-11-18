const router = require('express').Router();
const category = require('../controllers/categoryController');
const kios = require('../controllers/kiosController');
const menu = require('../controllers/menuController');
const favorite = require('../controllers/favoriteController');

router.get('/categories', category.getAll);

router.get('/kios', kios.getAll);
router.get('/kios/:id', kios.getById);

router.get('/menus', menu.getAll);
router.get('/menus/:id', menu.getById);

router.get('/favorites', favorite.getAll);
router.post('/favorites', favorite.add);
router.delete('/favorites/:menuId', favorite.remove);

module.exports = router;

const router = require('express').Router();
const Favorite = require('../controllers/favoriteController');

router.get('/', Favorite.getAll);
router.post('/', Favorite.add);
router.delete('/:menuId', Favorite.remove);

module.exports = router;

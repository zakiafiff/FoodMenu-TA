const router = require('express').Router();

router.use('/categories', require('./categoryRoutes'));
router.use('/kios', require('./kiosRoutes'));
router.use('/menus', require('./menuRoutes'));
router.use('/favorites', require('./favoriteRoutes'));

module.exports = router;
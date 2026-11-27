const router = require('express').Router();
const Menu = require('../controllers/menuController');

router.get('/', Menu.getAll);
router.get('/:id', Menu.getById);
router.post('/', Menu.create);
router.put('/:id', Menu.update);
router.patch('/:id/stock', Menu.updateStock);
router.delete('/:id', Menu.remove);

module.exports = router;
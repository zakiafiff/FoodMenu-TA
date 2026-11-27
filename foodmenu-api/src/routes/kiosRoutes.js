const router = require('express').Router();
const Kios = require('../controllers/kiosController');

router.get('/', Kios.getAll);
router.get('/:id', Kios.getById);

module.exports = router;

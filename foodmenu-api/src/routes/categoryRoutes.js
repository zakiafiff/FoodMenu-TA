const router = require('express').Router();
const Category = require('../controllers/categoryController');

router.get('/', Category.getAll);

module.exports = router;

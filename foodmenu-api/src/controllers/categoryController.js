const Category = require('../models/categoryModel');

exports.getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Category.getAll() });
  } catch (err) { next(err); }
};

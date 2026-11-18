const Menu = require('../models/menuModel');

exports.getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Menu.getAll(req.query) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Menu.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

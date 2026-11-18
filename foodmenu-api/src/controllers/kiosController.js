const Kios = require('../models/kiosModel');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Kios.getAll({ search: req.query.search, area: req.query.area });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Kios.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Kios tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

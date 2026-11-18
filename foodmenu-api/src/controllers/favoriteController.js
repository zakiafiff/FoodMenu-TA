const Favorite = require('../models/favoriteModel');
const Menu = require('../models/menuModel');

// GET /api/favorites?device_id=xxx  -> daftar menu favorit lengkap
exports.getAll = async (req, res, next) => {
  try {
    const { device_id } = req.query;
    if (!device_id) return res.status(400).json({ success: false, message: 'device_id wajib diisi' });
    const ids = await Favorite.getByDevice(device_id);
    const data = ids.length ? await Menu.getByIds(ids) : [];
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// POST /api/favorites  body: { device_id, menu_id }
exports.add = async (req, res, next) => {
  try {
    const { device_id, menu_id } = req.body;
    if (!device_id || !menu_id) {
      return res.status(400).json({ success: false, message: 'device_id dan menu_id wajib diisi' });
    }
    await Favorite.add(device_id, Number(menu_id));
    res.status(201).json({ success: true, message: 'Ditambahkan ke favorit' });
  } catch (err) { next(err); }
};

// DELETE /api/favorites/:menuId?device_id=xxx
exports.remove = async (req, res, next) => {
  try {
    const { device_id } = req.query;
    if (!device_id) return res.status(400).json({ success: false, message: 'device_id wajib diisi' });
    await Favorite.remove(device_id, Number(req.params.menuId));
    res.json({ success: true, message: 'Dihapus dari favorit' });
  } catch (err) { next(err); }
};

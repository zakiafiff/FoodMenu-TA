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

exports.create = async (req, res) => {
  try {
    const { name, price, kios_id, category_id } = req.body;
    if (!name || price === undefined || !kios_id || !category_id) {
      return res.status(400).json({ success: false, message: 'name, price, kios_id, dan category_id wajib diisi' });
    }
    const data = await Menu.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Menu.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/menus/:id/stock  body: { "amount": -1 } atau { "stock": 20 }
exports.updateStock = async (req, res) => {
  try {
    const { amount, stock } = req.body;
    if (amount === undefined && stock === undefined) {
      return res.status(400).json({ success: false, message: 'Isi amount (perubahan) atau stock (nilai baru)' });
    }
    const data = await Menu.adjustStock(req.params.id, { amount, stock });
    if (!data) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Menu.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    res.json({ success: true, message: 'Menu berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
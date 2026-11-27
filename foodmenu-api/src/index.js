require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'FoodMenu API',
    description: 'Katalog Menu Kantin Teknik Universitas Diponegoro',
    version: '1.0.0',
    endpoints: [
      'GET /api/categories',
      'GET /api/kios?search=&area=',
      'GET /api/kios/:id',
      'GET /api/menus?search=&category_id=&kios_id=&sort=terpopuler|termurah|rating&popular=true&limit=',
      'GET /api/menus/:id',
      'PATCH /api/menus/:id/stock',
      'POST /api/menus/:id/buy',
      'GET /api/favorites?device_id=',
      'POST /api/favorites',
      'DELETE /api/favorites/:menuId?device_id=',
    ],
  });
});

app.use('/api', routes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan server' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`FoodMenu API berjalan di http://localhost:${PORT}`));
}

module.exports = app;

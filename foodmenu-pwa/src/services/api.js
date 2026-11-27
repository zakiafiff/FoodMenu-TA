import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const http = axios.create({ baseURL: API_URL, timeout: 10000 });

const CACHE_PREFIX = 'fm_cache:';
const keyOf = (path, params) => CACHE_PREFIX + path + '?' + JSON.stringify(params || {});

// GET dengan fallback localStorage saat offline / server error (pola Modul 5)
async function cachedGet(path, params) {
  const key = keyOf(path, params);
  try {
    const res = await http.get(path, { params });
    const data = res.data.data;
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* storage penuh */ }
    return { data, fromCache: false };
  } catch (err) {
    const raw = localStorage.getItem(key);
    if (raw) return { data: JSON.parse(raw), fromCache: true };
    throw err;
  }
}

const clean = (p = {}) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v != null));

export const getCategories = () => cachedGet('/categories');
export const getMenus = (params) => cachedGet('/menus', clean(params));
export const getMenu = (id) => cachedGet(`/menus/${id}`);
export const getKiosList = (params) => cachedGet('/kios', clean(params));
export const getKios = (id) => cachedGet(`/kios/${id}`);
export const buyMenu = (id, quantity = 1) =>
  http.post(`/menus/${id}/buy`, { quantity }).then((r) => r.data.data);

// Favorit: disinkronkan ke API secara "best effort" (aplikasi tetap jalan saat offline)
export const syncAddFavorite = (deviceId, menuId) =>
  http.post('/favorites', { device_id: deviceId, menu_id: menuId }).catch(() => {});
export const syncRemoveFavorite = (deviceId, menuId) =>
  http.delete(`/favorites/${menuId}`, { params: { device_id: deviceId } }).catch(() => {});

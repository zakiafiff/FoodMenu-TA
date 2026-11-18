import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { syncAddFavorite, syncRemoveFavorite } from '../services/api';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'fm_favorites';

function getDeviceId() {
  let id = localStorage.getItem('fm_device_id');
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random().toString(16).slice(2);
    localStorage.setItem('fm_device_id', id);
  }
  return id;
}

export function FavoritesProvider({ children }) {
  // items: { [menuId]: menuObject } -> tersimpan offline, tetap tampil tanpa internet
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const deviceId = useMemo(getDeviceId, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isFavorite = (id) => !!items[id];

  const toggle = (menu) => {
    if (items[menu.id]) {
      syncRemoveFavorite(deviceId, menu.id);
      setItems((prev) => { const next = { ...prev }; delete next[menu.id]; return next; });
    } else {
      syncAddFavorite(deviceId, menu.id);
      setItems((prev) => ({ ...prev, [menu.id]: menu }));
    }
  };

  const list = Object.values(items);
  return (
    <FavoritesContext.Provider value={{ list, count: list.length, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

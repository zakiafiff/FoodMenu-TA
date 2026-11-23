import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuRow from '../components/MenuRow';
import { Chips, EmptyState, ErrorState, SearchBar, SkeletonList } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getCategories, getMenus } from '../services/api';

const SORTS = [
  { value: 'terpopuler', label: '🔥 Terpopuler' },
  { value: 'termurah', label: '💸 Termurah' },
  { value: 'rating', label: '⭐ Rating Tertinggi' },
];

const SORTERS = {
  terpopuler: (a, b) => Number(b.review_count) - Number(a.review_count),
  termurah: (a, b) => Number(a.price) - Number(b.price),
  rating: (a, b) => Number(b.rating) - Number(a.rating),
};

export default function MenuList() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'terpopuler';
  const [search, setSearch] = useState(params.get('search') || '');

  const setParam = (key, val) => {
    const p = new URLSearchParams(params);
    if (val) p.set(key, val); else p.delete(key);
    setParams(p, { replace: true });
  };

  const cats = useFetch(() => getCategories(), []);
  // Ambil semua menu SEKALI, lalu cari/filter/urutkan di perangkat,
  // sehingga semua pilihan tetap berjalan saat offline.
  const menus = useFetch(() => getMenus({}), []);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (menus.data || []).filter(
      (m) =>
        (!category || String(m.category_id) === String(category)) &&
        (!q || m.name.toLowerCase().includes(q) || (m.description || '').toLowerCase().includes(q)),
    );
    return [...list].sort(SORTERS[sort] || SORTERS.terpopuler);
  }, [menus.data, search, category, sort]);

  const catItems = [{ value: '', label: 'Semua' }, ...(cats.data || []).map((c) => ({ value: c.id, label: c.name }))];

  return (
    <div className="space-y-3">
      <div className="px-4">
        <h1 className="font-display text-2xl font-bold">Daftar Menu</h1>
        <p className="text-sm text-on-surface-variant">{menus.data ? `${shown.length} menu ditemukan` : 'Memuat menu...'}</p>
      </div>
      <div className="px-4 md:max-w-xl">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari menu atau deskripsi..." />
      </div>
      <Chips items={SORTS} value={sort} onChange={(v) => setParam('sort', v === 'terpopuler' ? '' : v)} />
      <Chips items={catItems} value={category} onChange={(v) => setParam('category', v)} />

      {menus.loading ? <SkeletonList count={5} />
        : menus.error ? <ErrorState onRetry={menus.reload} />
        : shown.length === 0 ? (
          <EmptyState title="Menu tidak ditemukan" text="Coba kata kunci atau kategori lain." />
        ) : (
          <div className="grid gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((m) => <MenuRow key={m.id} menu={m} />)}
          </div>
        )}
    </div>
  );
}
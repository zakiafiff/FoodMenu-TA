import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuRow from '../components/MenuRow';
import { Chips, EmptyState, ErrorState, SearchBar, SkeletonList } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getCategories, getMenus } from '../services/api';

const SORTS = [
  { value: 'terpopuler', label: 'Terpopuler' },
  { value: 'termurah', label: 'Termurah' },
  { value: 'rating', label: 'Rating Tertinggi' },
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
    <div className="space-y-3.5 pt-2">
      <div className="flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Daftar Menu</h1>
          <p className="text-xs text-on-surface-variant">{menus.data ? `${shown.length} menu tersedia` : 'Memuat menu...'}</p>
        </div>
        <div className="flex flex-1 gap-2 md:max-w-lg">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari menu atau deskripsi..." />
          <select value={sort} onChange={(e) => setParam('sort', e.target.value === 'terpopuler' ? '' : e.target.value)}
            aria-label="Urutkan menu"
            className="h-11 shrink-0 rounded-xl border border-outline-variant/70 bg-surface-lowest px-3 text-xs font-semibold text-on-surface outline-none focus:border-primary dark:bg-surface-low">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <Chips items={catItems} value={category} onChange={(v) => setParam('category', v)} />

      {menus.loading ? <SkeletonList count={6} />
        : menus.error ? <ErrorState onRetry={menus.reload} />
        : shown.length === 0 ? (
          <EmptyState title="Menu tidak ditemukan" text="Coba kata kunci atau kategori lain." />
        ) : (
          <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((m) => <MenuRow key={m.id} menu={m} />)}
          </div>
        )}
    </div>
  );
}
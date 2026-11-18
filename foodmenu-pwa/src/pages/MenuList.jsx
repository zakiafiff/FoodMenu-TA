import { useEffect, useState } from 'react';
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

export default function MenuList() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'terpopuler';
  const [search, setSearch] = useState(params.get('search') || '');
  const [debounced, setDebounced] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(params);
    if (val) p.set(key, val); else p.delete(key);
    setParams(p, { replace: true });
  };

  const cats = useFetch(() => getCategories(), []);
  const menus = useFetch(
    () => getMenus({ search: debounced, category_id: category, sort }),
    [debounced, category, sort],
  );
  const catItems = [{ value: '', label: 'Semua' }, ...(cats.data || []).map((c) => ({ value: c.id, label: c.name }))];

  return (
    <div className="space-y-3">
      <div className="px-4">
        <h1 className="font-display text-2xl font-bold">Daftar Menu</h1>
        <p className="text-sm text-on-surface-variant">{menus.data ? `${menus.data.length} menu ditemukan` : 'Memuat menu...'}</p>
      </div>
      <div className="px-4 md:max-w-xl">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari menu atau deskripsi..." />
      </div>
      <Chips items={SORTS} value={sort} onChange={(v) => setParam('sort', v === 'terpopuler' ? '' : v)} />
      <Chips items={catItems} value={category} onChange={(v) => setParam('category', v)} />

      {menus.loading ? <SkeletonList count={5} />
        : menus.error ? <ErrorState onRetry={menus.reload} />
        : menus.data.length === 0 ? (
          <EmptyState title="Menu tidak ditemukan" text="Coba kata kunci atau kategori lain." />
        ) : (
          <div className="grid gap-3 px-4 md:grid-cols-2 xl:grid-cols-3">
            {menus.data.map((m) => <MenuRow key={m.id} menu={m} />)}
          </div>
        )}
    </div>
  );
}

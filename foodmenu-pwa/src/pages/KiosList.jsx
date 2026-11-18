import { useEffect, useState } from 'react';
import KiosCard from '../components/KiosCard';
import { Chips, EmptyState, ErrorState, SearchBar, SkeletonList } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getKiosList } from '../services/api';

export default function KiosList() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, loading, error, reload } = useFetch(() => getKiosList({ search: debounced }), [debounced]);

  const areas = [...new Set((data || []).map((k) => k.area).filter(Boolean))];
  const areaItems = [{ value: '', label: `Semua Area (${data?.length ?? 0})` }, ...areas.map((a) => ({ value: a, label: a }))];
  const shown = (data || []).filter((k) => !area || k.area === area);

  return (
    <div className="space-y-3">
      <div className="px-4">
        <h1 className="font-display text-2xl font-bold">Kios Kantin Teknik</h1>
        <p className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="h-2 w-2 rounded-full bg-tertiary" />{data ? `${data.filter((k) => k.is_open).length} kios sedang buka` : 'Memuat kios...'}
        </p>
      </div>
      <div className="px-4 md:max-w-xl"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama kios atau spesialisasi..." /></div>
      {data && <Chips items={areaItems} value={area} onChange={setArea} />}

      {loading ? <SkeletonList count={3} />
        : error ? <ErrorState onRetry={reload} />
        : shown.length === 0 ? <EmptyState title="Kios tidak ditemukan" text="Coba kata kunci atau area lain." />
        : <div className="grid gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">{shown.map((k) => <KiosCard key={k.id} kios={k} />)}</div>}
    </div>
  );
}

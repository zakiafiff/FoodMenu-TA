import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuFeatured from '../components/MenuFeatured';
import MenuRow from '../components/MenuRow';
import { Chips, ErrorState, Icon, SearchBar, SectionTitle, SkeletonList } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { getCategories, getMenus } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const cats = useFetch(() => getCategories(), []);
  const popular = useFetch(() => getMenus({ popular: 'true', sort: 'rating' }), []);
  const reco = useFetch(() => getMenus({ sort: 'rating', limit: 5 }), []);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/menu?search=${encodeURIComponent(q.trim())}` : '/menu');
  };
  const chipItems = [{ value: '', label: 'Semua' }, ...(cats.data || []).map((c) => ({ value: c.id, label: c.name }))];
  const paketId = cats.data?.find((c) => c.name === 'Paket Hemat')?.id;

  if (popular.error && reco.error) return <ErrorState onRetry={() => { popular.reload(); reco.reload(); cats.reload(); }} />;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 px-4 pt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Kantin Fakultas Teknik</p>
          <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight">Mau makan apa hari ini?</h1>
        </div>
        <form onSubmit={submit} className="flex w-full gap-2 md:max-w-md">
          <SearchBar value={q} onChange={setQ} placeholder="Cari nasi geprek, soto, es teh..." />
          <Link to="/menu" aria-label="Filter menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-outline-variant/70 bg-surface-lowest text-on-surface transition hover:bg-surface-container active:scale-95 dark:bg-surface-low">
            <Icon name="tune" className="text-[18px]" />
          </Link>
        </form>
      </section>

      <Chips items={chipItems} value="" onChange={(v) => navigate(v ? `/menu?category=${v}` : '/menu')} />

      <section className="px-4">
        <Link to={paketId ? `/menu?category=${paketId}` : '/menu'}
          className="group flex flex-col justify-between gap-3 rounded-2xl bg-zinc-900 px-5 py-4 text-white transition hover:bg-zinc-800 dark:border dark:border-zinc-800 md:flex-row md:items-center md:px-6 md:py-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Hemat
              </span>
              <span className="text-xs text-zinc-400">Khusus Mahasiswa Teknik</span>
            </div>
            <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">Paket Hemat Mulai Rp10.000</h2>
          </div>
          <span className="inline-flex h-10 w-fit shrink-0 items-center gap-1.5 rounded-xl bg-primary-container px-4 text-xs font-bold text-white transition group-hover:brightness-110">
            Lihat Paket <Icon name="chevron_right" className="text-[16px]" />
          </span>
        </Link>
      </section>

      <section className="space-y-2.5">
        <SectionTitle icon="star" title="Menu Favorit" to="/menu" />
        {popular.loading ? <SkeletonList count={1} /> : (
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {(popular.data || []).map((m) => <MenuFeatured key={m.id} menu={m} />)}
          </div>
        )}
      </section>

      <section className="space-y-2.5">
        <SectionTitle icon="thumb_up" title="Rekomendasi Hari Ini" to="/menu" />
        {reco.loading ? <SkeletonList count={3} /> : (
          <div className="grid gap-3 px-4 md:grid-cols-2 lg:grid-cols-3">
            {(reco.data || []).map((m) => <MenuRow key={m.id} menu={m} />)}
          </div>
        )}
      </section>
    </div>
  );
}

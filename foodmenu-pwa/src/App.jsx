import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DetailLayout, MainLayout } from './components/Layout';
import Splash from './components/Splash';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import KiosDetail from './pages/KiosDetail';
import KiosList from './pages/KiosList';
import MenuDetail from './pages/MenuDetail';
import MenuList from './pages/MenuList';
import Profile from './pages/Profile';
import { EmptyState } from './components/ui';

export default function App() {
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('fm_splash_seen'));
  const done = useCallback(() => { sessionStorage.setItem('fm_splash_seen', '1'); setSplash(false); }, []);

  return (
    <div className="relative min-h-screen bg-surface">
      {splash && <Splash onDone={done} />}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/kios" element={<KiosList />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<DetailLayout />}>
          <Route path="/menu/:id" element={<MenuDetail />} />
          <Route path="/kios/:id" element={<KiosDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<EmptyState icon="explore_off" title="Halaman tidak ditemukan" />} />
        </Route>
      </Routes>
    </div>
  );
}

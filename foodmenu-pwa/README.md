# FoodMenu - Katalog Menu Kantin Teknik Undip (PWA)

Progressive Web App untuk melihat menu dan kios Kantin Fakultas Teknik Universitas Diponegoro.
Stack: React + Vite, React Router, Tailwind CSS, Axios, vite-plugin-pwa. Data dari REST API buatan sendiri (repo `foodmenu-api`).

## Fitur
- 8 halaman: Splash, Beranda, Daftar Menu, Detail Menu, Daftar Kios, Detail Kios, Favorit, Profil/About
- Bottom Navigation Bar (Beranda, Daftar Menu, Kios Kantin, Profil)
- 2 list + detail: Menu -> Detail Menu, Kios -> Detail Kios
- Cari, filter kategori, urutkan (terpopuler / termurah / rating)
- Favorit tersimpan offline (localStorage + sinkron ke API)
- Dark mode (default) dan light mode
- Installable (manifest + service worker), banner offline, tombol Install

## Menjalankan
```bash
npm install
cp .env.example .env     # isi VITE_API_URL
npm run dev              # http://localhost:5173
```
Tes PWA/offline: `npm run build && npm run preview`.

## Ubah data profil
Edit `src/config/profile.js` (nama, NIM, jurusan, link GitHub).

## Deploy
Import repo di Vercel (framework Vite), isi Environment Variable `VITE_API_URL` (contoh `https://foodmenu-api.vercel.app/api`), lalu Deploy.

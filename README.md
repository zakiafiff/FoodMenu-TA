# FoodMenu - Katalog Menu Kantin Teknik Universitas Diponegoro

> **Kantin Teknik Undip di Genggamanmu.**
> Progressive Web App (PWA) untuk melihat menu, harga, ketersediaan, dan profil kios di Kantin Fakultas Teknik Universitas Diponegoro. Bisa di-install di HP maupun laptop dan tetap bisa dibuka saat offline.

Tugas Akhir Praktikum Pemrograman Perangkat Bergerak (PPB) - Platform **PWA**.

| | |
|---|---|
| **Nama** | Zaki Afif |
| **NIM** | 21120124140110 |
| **Jurusan** | Teknik Komputer, Universitas Diponegoro |

## Tautan

| | Link |
|---|---|
| Aplikasi (PWA) | https://food-menu-ta-jukh.vercel.app |
| API | https://food-menu-ta.vercel.app/api |
| Repository | https://github.com/zakiafiff/FoodMenu-TA |

## Fitur

- **Daftar Menu** dengan pencarian, filter kategori, dan urutan (terpopuler, termurah, rating tertinggi)
- **Detail Menu**: harga, rating, deskripsi, label (Halal, Pedas, dan lain-lain), dan kios penjual
- **Daftar Kios** dan **Detail Kios** beserta daftar menunya
- **Favorit** yang tersimpan di perangkat dan disinkronkan ke API
- **Dark mode** (default) dan light mode
- **PWA**: bisa di-install, banner offline, dan data menu yang pernah dibuka tetap tampil tanpa internet
- **Responsif**: bottom navigation untuk HP, tampilan lebar untuk laptop

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, vite-plugin-pwa |
| Backend | Node.js, Express, `@supabase/supabase-js`, dotenv |
| Database | Supabase (PostgreSQL) |
| Deploy | Vercel (dua project, API dan PWA) |
| Desain | Google Stitch |

## Arsitektur

```
PWA (React)  -->  REST API (Express)  -->  Database (Supabase)
  tampilan         endpoint + logika         tabel data
```

Frontend tidak terhubung langsung ke database. Frontend hanya memanggil API, dan API yang mengambil data dari Supabase, sehingga kunci database hanya ada di server.

## Struktur Folder

```
FoodMenu-TA/
├── foodmenu-api/                # Backend (mengikuti pola Modul 1)
│   ├── sql/                     # Skema tabel dan data awal
│   ├── src/
│   │   ├── config/              # Koneksi Supabase
│   │   ├── models/              # Query ke database
│   │   ├── controllers/         # Logika request dan response
│   │   ├── routes/              # Pemetaan URL ke controller
│   │   └── index.js             # Titik masuk server
│   ├── .env.example
│   └── vercel.json
└── foodmenu-pwa/                # Frontend
    ├── public/                  # Logo dan ikon PWA
    └── src/
        ├── components/          # Layout, bottom nav, kartu, ikon
        ├── pages/               # Halaman aplikasi
        ├── context/             # Tema dan favorit
        ├── hooks/               # Online, install PWA, fetch
        ├── services/api.js      # Pemanggilan API
        └── config/profile.js    # Data profil
```

## Halaman Aplikasi

| Halaman | File |
|---|---|
| Splash | `components/Splash.jsx` |
| Beranda | `pages/Home.jsx` |
| Daftar Menu | `pages/MenuList.jsx` |
| Detail Menu | `pages/MenuDetail.jsx` |
| Daftar Kios | `pages/KiosList.jsx` |
| Detail Kios | `pages/KiosDetail.jsx` |
| Favorit | `pages/Favorites.jsx` |
| Profil / About | `pages/Profile.jsx` |

## Database

| Tabel | Isi |
|---|---|
| `categories` | Kategori menu |
| `kios` | Data kios: lokasi, jam buka, rating, status |
| `menus` | Data menu: harga, rating, foto, ketersediaan (relasi ke `kios` dan `categories`) |
| `favorites` | Menu favorit per perangkat |

Skema ada di `foodmenu-api/sql/01_schema.sql` dan data awal di `foodmenu-api/sql/02_seed.sql`.

## Endpoint API

Base URL: `https://food-menu-ta.vercel.app/api`

| Method | Endpoint | Keterangan |
|---|---|---|
| GET, POST | `/categories` | Daftar dan tambah kategori |
| GET, PUT, DELETE | `/categories/:id` | Detail, ubah, hapus kategori |
| GET, POST | `/kios` | Daftar dan tambah kios (`?search=&area=`) |
| GET, PUT, DELETE | `/kios/:id` | Detail (beserta menunya), ubah, hapus kios |
| GET, POST | `/menus` | Daftar dan tambah menu |
| GET, PUT, DELETE | `/menus/:id` | Detail, ubah, hapus menu |
| GET | `/favorites?device_id=` | Favorit milik perangkat |
| POST | `/favorites` | Tambah favorit (`device_id`, `menu_id`) |
| DELETE | `/favorites/:menuId?device_id=` | Hapus favorit |

Parameter `GET /menus`: `search`, `category_id`, `kios_id`, `sort` (`terpopuler`, `termurah`, `rating`), `popular=true`, dan `limit`.

Contoh response:

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Nasi Ayam Geprek Sambal Korek", "price": 15000, "rating": 4.9 }
  ]
}
```

Koleksi pengujian Postman ada di file `FoodMenu-API.postman_collection.json`. Ubah variabel `base_url` ke `http://localhost:3000` (lokal) atau `https://food-menu-ta.vercel.app` (deploy).

## Menjalankan di Komputer Lokal

Prasyarat: Node.js 18 atau lebih baru, dan akun Supabase.

### 1. Database
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi `foodmenu-api/sql/01_schema.sql`, lalu `foodmenu-api/sql/02_seed.sql`.
3. Salin **Project URL** dan **service_role key** dari Project Settings, API.

### 2. API
```bash
cd foodmenu-api
cp .env.example .env     # isi SUPABASE_URL dan SUPABASE_KEY
npm install
npm run dev              # http://localhost:3000
```

### 3. PWA
```bash
cd foodmenu-pwa
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev              # http://localhost:5180
```

> File `.env` berisi kunci rahasia dan tidak ikut diunggah ke GitHub (sudah masuk `.gitignore`).

## Deploy

Satu repo di-deploy sebagai dua project Vercel:

| Project | Root Directory | Environment Variables |
|---|---|---|
| API | `foodmenu-api` | `SUPABASE_URL`, `SUPABASE_KEY` |
| PWA | `foodmenu-pwa` | `VITE_API_URL` (contoh: `https://food-menu-ta.vercel.app/api`) |

Setelah mengubah environment variable, lakukan **Redeploy**.

## Cara Install Aplikasi

- **Laptop (Chrome/Edge):** klik ikon install di ujung address bar.
- **Android (Chrome):** menu titik tiga, lalu **Install app** atau tombol install di halaman Profil.
- **iPhone (Safari):** tombol Share, lalu **Add to Home Screen**.

## Pemenuhan Ketentuan Tugas Akhir

| Ketentuan | Implementasi |
|---|---|
| API sendiri sesuai Modul 1 | Express + Supabase, struktur models, controllers, routes |
| Bottom Navigation Bar | `components/Layout.jsx` (Beranda, Daftar Menu, Kios Kantin, Profil) |
| Minimal 5 halaman | 8 halaman |
| 2 halaman list dengan detail | Menu ke Detail Menu, Kios ke Detail Kios |
| Halaman Profile/About | `pages/Profile.jsx` |
| Source code di GitHub | Repository ini |
| PWA di free hosting | Vercel |

---

Dibuat untuk Tugas Akhir Praktikum, Fakultas Teknik Universitas Diponegoro.

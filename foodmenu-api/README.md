# FoodMenu API

REST API untuk aplikasi **FoodMenu - Katalog Menu Kantin Teknik Universitas Diponegoro**.
Stack: Node.js, Express, Supabase (PostgreSQL). Struktur: `models / controllers / routes` (mengikuti Modul 1).

## Endpoint
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/categories` | Daftar kategori |
| GET | `/api/kios?search=&area=` | Daftar kios (+ `menu_count`) |
| GET | `/api/kios/:id` | Detail kios + daftar menunya |
| GET | `/api/menus?search=&category_id=&kios_id=&sort=&popular=&limit=` | Daftar menu. `sort` = `terpopuler` / `termurah` / `rating` |
| GET | `/api/menus/:id` | Detail menu (+ kios & kategori) |
| GET | `/api/favorites?device_id=` | Favorit milik perangkat |
| POST | `/api/favorites` | Body: `{ "device_id": "...", "menu_id": 1 }` |
| DELETE | `/api/favorites/:menuId?device_id=` | Hapus favorit |

## Menjalankan lokal
1. Supabase > SQL Editor: jalankan `sql/01_schema.sql`, lalu `sql/02_seed.sql`.
2. `cp .env.example .env`, isi `SUPABASE_URL` dan `SUPABASE_KEY` (service_role key, Project Settings > API).
3. `npm install` lalu `npm run dev`
4. Buka http://localhost:3000/api/menus

## Deploy (Vercel)
Push ke GitHub, import di Vercel, tambahkan Environment Variables `SUPABASE_URL` dan `SUPABASE_KEY`, lalu Deploy.
Jangan pernah commit file `.env`.

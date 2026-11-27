-- ============================================================
-- Migration: Tambah kolom stock ke tabel menus
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tambah kolom stock (default NULL = tidak dilacak)
alter table menus
  add column if not exists stock int default null;

-- 2. Set stok awal untuk semua menu yang tersedia = 10
update menus set stock = 10 where is_available = true;

-- 3. Menu yang sudah tidak tersedia (is_available = false) = stok 0
update menus set stock = 0 where is_available = false;

-- Verifikasi hasilnya:
select id, name, is_available, stock from menus order by id;

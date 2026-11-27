-- FoodMenu - Skema database (jalankan di Supabase > SQL Editor)
drop table if exists favorites cascade;
drop table if exists menus cascade;
drop table if exists kios cascade;
drop table if exists categories cascade;

create table categories (
  id serial primary key,
  name text not null unique,
  icon text
);

create table kios (
  id serial primary key,
  name text not null,
  specialty text,
  description text,
  location text,
  area text,
  open_time text,
  close_time text,
  is_open boolean default true,
  rating numeric(2,1) default 0,
  review_count int default 0,
  avg_serve_time text,
  image_url text,
  created_at timestamptz default now()
);

create table menus (
  id serial primary key,
  kios_id int not null references kios(id) on delete cascade,
  category_id int not null references categories(id),
  name text not null,
  description text,
  price int not null,
  original_price int,
  rating numeric(2,1) default 0,
  review_count int default 0,
  image_url text,
  is_available boolean default true,
  is_popular boolean default false,
  tags text[] default '{}',
  prep_time text,
  stock int default null,
  created_at timestamptz default now()
);

-- Favorit disimpan per perangkat (tanpa login)
create table favorites (
  id serial primary key,
  device_id text not null,
  menu_id int not null references menus(id) on delete cascade,
  created_at timestamptz default now(),
  unique (device_id, menu_id)
);

create index on menus (kios_id);
create index on menus (category_id);
create index on favorites (device_id);

-- API memakai service role key, jadi RLS aktif tanpa policy publik (data aman).
alter table categories enable row level security;
alter table kios enable row level security;
alter table menus enable row level security;
alter table favorites enable row level security;

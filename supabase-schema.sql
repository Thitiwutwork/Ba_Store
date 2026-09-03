-- ==============================================================================
-- BA STORE - Supabase Cloud Database Setup Script
-- ==============================================================================
-- วิธีใช้งาน:
-- 1. เข้าสู่ระบบ https://supabase.com แล้วสร้าง Project ใหม่ (ฟรี)
-- 2. ไปที่เมนู "SQL Editor" ด้านซ้ายมือ
-- 3. คัดลอกโค้ดทั้งหมดในไฟล์นี้ไปวาง แล้วกดปุ่ม "Run"
-- 4. ไปที่เมนู "Project Settings" -> "Data API" (หรือ "API") แล้วคัดลอก:
--    - Project URL (เช่น https://xyzcompany.supabase.co)
--    - anon public Key (เช่น eyJhbGciOi...)
--    นำมากรอกในหน้า Admin ตั้งค่าร้านค้า แล้วกด "บันทึก" ได้ทันที!
-- ==============================================================================

-- 1. สร้างตาราง store_data สำหรับเก็บข้อมูลสินค้า โปรโมชั่น และข้อมูลร้านค้า
create table if not exists public.store_data (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. เปิดระบบความปลอดภัย Row Level Security (RLS)
alter table public.store_data enable row level security;

-- 3. อนุญาตให้ทุกคนอ่านข้อมูลได้ (เพื่อให้ลูกค้าทุกคนเข้ามาดูสินค้าและราคาล่าสุดได้)
drop policy if exists "Public Read Store Data" on public.store_data;
create policy "Public Read Store Data"
  on public.store_data
  for select
  using (true);

-- 4. อนุญาตให้บันทึกและอัปเดตข้อมูลได้ (สำหรับระบบจัดการร้านค้า Admin)
drop policy if exists "Allow Insert Store Data" on public.store_data;
create policy "Allow Insert Store Data"
  on public.store_data
  for insert
  with check (true);

drop policy if exists "Allow Update Store Data" on public.store_data;
create policy "Allow Update Store Data"
  on public.store_data
  for update
  using (true);

-- 5. เปิดระบบ Realtime เพื่อกระจายข้อมูลอัปเดตไปยังหน้าจอของลูกค้าทุกคนทันที
alter publication supabase_realtime add table public.store_data;

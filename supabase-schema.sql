-- ==============================================================================
-- BA STORE - Supabase Relational Database Setup & Migration Script
-- ==============================================================================
-- วิธีใช้งาน:
-- 1. เข้าสู่ระบบ https://supabase.com แล้วไปที่ Project ของคุณ
-- 2. ไปที่เมนู "SQL Editor" ด้านซ้ายมือ
-- 3. คัดลอกโค้ดทั้งหมดในไฟล์นี้ไปวาง แล้วกดปุ่ม "Run" สีเขียว
-- 4. ไปที่ "Table Editor" คุณจะพบตารางแยกย่อย 3 ตารางเหมือน Excel:
--    - products: ตารางสินค้าแยกตามแถว (ชื่อ, ราคา, สเปก, สถานะ)
--    - promotions: ตารางโปรโมชั่น (โปร 1 แอพ/โค้ด, โปรแพ็กคู่, โปรคอมโบ 3 แอพ)
--    - store_settings: ตารางตั้งค่าร้านค้า (ชื่อร้าน, LINE, รหัสผ่าน Admin)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. สร้างตาราง products (สินค้าแยกแต่ละรายการ)
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text default 'ทั้งหมด',
  price text,
  price_label text,
  price_period text,
  has_second_price boolean default false,
  second_price text,
  second_price_label text,
  tag text,
  tag_color text default 'pink',
  in_stock boolean default true,
  devices text,
  resolution text,
  package_details text,
  sub_detail text,
  icon text,
  order_link text,
  prices jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. สร้างตาราง promotions (โปรโมชั่นแยกแต่ละรายการ)
-- ------------------------------------------------------------------------------
create table if not exists public.promotions (
  id text primary key,
  name text not null,
  tag text,
  tag_color text default 'rose',
  promo_type text default 'dual',
  app_count int default 2,
  app1_name text,
  app1_icon text,
  app1_devices text,
  app1_resolution text,
  app2_name text,
  app2_icon text,
  app2_devices text,
  app2_resolution text,
  has_app3 boolean default false,
  app3_name text,
  app3_icon text,
  app3_devices text,
  app3_resolution text,
  original_price text,
  promo_price text,
  price_period text,
  in_stock boolean default true,
  stock_status text default 'ready',
  stock_status_text text,
  package_details text,
  order_link text,
  prices jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. สร้างตาราง store_settings (ข้อมูลการตั้งค่าร้านค้า & รหัส Admin)
-- ------------------------------------------------------------------------------
create table if not exists public.store_settings (
  id text primary key default 'main',
  store_name text default 'BA STORE',
  badge_text text default 'รับตัดแอพราคาส่ง',
  description text,
  sub_description text,
  opening_hours text default 'เปิด 09:00 - 23:00 น.',
  announcement text,
  banner_url text,
  banner_fit text default 'auto',
  banner_position text default 'center',
  logo_url text,
  line_id text,
  line_url text,
  admin_password text default '1234',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. ย้ายข้อมูลเดิมจาก store_data เข้าตารางใหม่โดยอัตโนมัติ (Data Migration)
-- ------------------------------------------------------------------------------
do $$
begin
  -- 4.1 ย้ายสินค้าจาก store_data.products
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'store_data') then
    insert into public.products (
      id, name, category, price, price_label, price_period,
      has_second_price, second_price, second_price_label,
      tag, tag_color, in_stock, devices, resolution,
      package_details, sub_detail, icon, order_link, prices, updated_at
    )
    select 
      p->>'id' as id,
      coalesce(p->>'name', '') as name,
      coalesce(p->>'category', 'ทั้งหมด') as category,
      p->>'price' as price,
      p->>'priceLabel' as price_label,
      p->>'pricePeriod' as price_period,
      coalesce((p->>'hasSecondPrice')::boolean, false) as has_second_price,
      p->>'secondPrice' as second_price,
      p->>'secondPriceLabel' as second_price_label,
      p->>'tag' as tag,
      coalesce(p->>'tagColor', 'pink') as tag_color,
      coalesce((p->>'inStock')::boolean, true) as in_stock,
      p->>'devices' as devices,
      p->>'resolution' as resolution,
      p->>'packageDetails' as package_details,
      p->>'subDetail' as sub_detail,
      p->>'icon' as icon,
      p->>'orderLink' as order_link,
      coalesce(p->'prices', '[]'::jsonb) as prices,
      now() as updated_at
    from public.store_data s,
    lateral jsonb_array_elements(s.data) as p
    where s.key = 'products'
    on conflict (id) do update set
      name = excluded.name,
      category = excluded.category,
      price = excluded.price,
      price_label = excluded.price_label,
      price_period = excluded.price_period,
      tag = excluded.tag,
      in_stock = excluded.in_stock,
      devices = excluded.devices,
      resolution = excluded.resolution,
      package_details = excluded.package_details,
      prices = excluded.prices,
      icon = excluded.icon,
      updated_at = now();

    -- 4.2 ย้ายโปรโมชั่นจาก store_data.promotions
    insert into public.promotions (
      id, name, tag, tag_color, promo_type, app_count,
      app1_name, app1_icon, app1_devices, app1_resolution,
      app2_name, app2_icon, app2_devices, app2_resolution,
      has_app3, app3_name, app3_icon, app3_devices, app3_resolution,
      original_price, promo_price, price_period, in_stock,
      stock_status, stock_status_text, package_details, order_link, prices, updated_at
    )
    select 
      p->>'id' as id,
      coalesce(p->>'name', '') as name,
      p->>'tag' as tag,
      coalesce(p->>'tagColor', 'rose') as tag_color,
      coalesce(p->>'promoType', 'dual') as promo_type,
      coalesce((p->>'appCount')::int, 2) as app_count,
      p->>'app1Name' as app1_name,
      p->>'app1Icon' as app1_icon,
      p->>'app1Devices' as app1_devices,
      p->>'app1Resolution' as app1_resolution,
      p->>'app2Name' as app2_name,
      p->>'app2Icon' as app2_icon,
      p->>'app2Devices' as app2_devices,
      p->>'app2Resolution' as app2_resolution,
      coalesce((p->>'hasApp3')::boolean, false) as has_app3,
      p->>'app3Name' as app3_name,
      p->>'app3Icon' as app3_icon,
      p->>'app3Devices' as app3_devices,
      p->>'app3Resolution' as app3_resolution,
      p->>'originalPrice' as original_price,
      p->>'promoPrice' as promo_price,
      p->>'pricePeriod' as price_period,
      coalesce((p->>'inStock')::boolean, true) as in_stock,
      coalesce(p->>'stockStatus', 'ready') as stock_status,
      p->>'stockStatusText' as stock_status_text,
      p->>'packageDetails' as package_details,
      p->>'orderLink' as order_link,
      coalesce(p->'prices', '[]'::jsonb) as prices,
      now() as updated_at
    from public.store_data s,
    lateral jsonb_array_elements(s.data) as p
    where s.key = 'promotions'
    on conflict (id) do update set
      name = excluded.name,
      promo_price = excluded.promo_price,
      updated_at = now();

    -- 4.3 ย้ายการตั้งค่าร้านจาก store_data.settings
    insert into public.store_settings (
      id, store_name, badge_text, description, sub_description,
      opening_hours, announcement, banner_url, banner_fit, banner_position,
      logo_url, line_id, line_url, admin_password, updated_at
    )
    select 
      'main' as id,
      coalesce(s.data->>'storeName', 'BA STORE') as store_name,
      s.data->>'badgeText' as badge_text,
      s.data->>'description' as description,
      s.data->>'subDescription' as sub_description,
      s.data->>'openingHours' as opening_hours,
      s.data->>'announcement' as announcement,
      s.data->>'bannerUrl' as banner_url,
      coalesce(s.data->>'bannerFit', 'auto') as banner_fit,
      coalesce(s.data->>'bannerPosition', 'center') as banner_position,
      s.data->>'logoUrl' as logo_url,
      s.data->>'lineId' as line_id,
      s.data->>'lineUrl' as line_url,
      coalesce(s.data->>'adminPassword', s.data->>'adminPin', '1234') as admin_password,
      now() as updated_at
    from public.store_data s
    where s.key = 'settings'
    on conflict (id) do update set
      store_name = excluded.store_name,
      admin_password = excluded.admin_password,
      updated_at = now();
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 5. เปิดระบบความปลอดภัย Row Level Security (RLS)
-- ------------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.promotions enable row level security;
alter table public.store_settings enable row level security;

-- อนุญาตให้อ่านได้สาธารณะ (เพื่อให้ลูกค้าหน้าร้านดึงข้อมูลไปแสดงได้)
drop policy if exists "Public Read Products" on public.products;
create policy "Public Read Products" on public.products for select using (true);

drop policy if exists "Public Read Promotions" on public.promotions;
create policy "Public Read Promotions" on public.promotions for select using (true);

drop policy if exists "Public Read Store Settings" on public.store_settings;
create policy "Public Read Store Settings" on public.store_settings for select using (true);

-- อนุญาตให้เพิ่ม แก้ไข ลบข้อมูลได้ (สำหรับระบบจัดการหลังบ้าน)
drop policy if exists "Allow Anon All Products" on public.products;
create policy "Allow Anon All Products" on public.products for all using (true) with check (true);

drop policy if exists "Allow Anon All Promotions" on public.promotions;
create policy "Allow Anon All Promotions" on public.promotions for all using (true) with check (true);

drop policy if exists "Allow Anon All Store Settings" on public.store_settings;
create policy "Allow Anon All Store Settings" on public.store_settings for all using (true) with check (true);

-- ------------------------------------------------------------------------------
-- 6. เปิด Realtime สำหรับตารางใหม่ทั้งหมด
-- ------------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.products;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.promotions;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.store_settings;
exception when others then null;
end $$;

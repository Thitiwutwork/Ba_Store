import { DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS, DEFAULT_PROMOTIONS } from '../data/initialData';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

const PRODUCTS_KEY = 'BA_STORE_PRODUCTS_V1';
const SETTINGS_KEY = 'BA_STORE_SETTINGS_V1';
const PROMOTIONS_KEY = 'BA_STORE_PROMOTIONS_V1';

// ----------------------------------------------------------------------------
// Data Mappers between Frontend Objects and Relational Database Columns
// ----------------------------------------------------------------------------

export function productToRow(p, idx) {
  return {
    id: p.id,
    name: p.name || '',
    category: p.category || 'ทั้งหมด',
    price: (p.price != null && p.price !== '') ? String(p.price) : '',
    price_label: p.priceLabel || p.price_label || '',
    price_period: p.pricePeriod || p.price_period || '',
    has_second_price: Boolean(p.hasSecondPrice ?? p.has_second_price),
    second_price: (p.secondPrice != null && p.secondPrice !== '') ? String(p.secondPrice) : ((p.second_price != null && p.second_price !== '') ? String(p.second_price) : ''),
    second_price_label: p.secondPriceLabel || p.second_price_label || '',
    tag: p.tag || '',
    tag_color: p.tagColor || p.tag_color || 'pink',
    in_stock: p.inStock !== false && p.in_stock !== false,
    devices: p.devices || '',
    resolution: p.resolution || '',
    package_details: p.packageDetails || p.package_details || '',
    sub_detail: p.subDetail || p.sub_detail || '',
    icon: p.icon || '',
    order_link: p.orderLink || p.order_link || '',
    prices: Array.isArray(p.prices) ? p.prices : [],
    sort_order: typeof idx === 'number' ? idx : (typeof p.sortOrder === 'number' ? p.sortOrder : (typeof p.sort_order === 'number' ? p.sort_order : 0)),
    updated_at: new Date().toISOString()
  };
}

export function rowToProduct(row) {
  const prices = Array.isArray(row.prices) ? row.prices : [];
  const stockStatus = row.stock_status || row.stockStatus || (
    prices.length > 0 && prices.every((p) => p.status === 'out_of_stock')
      ? 'out_of_stock'
      : prices.length > 0 && prices.every((p) => p.status === 'not_ready')
      ? 'not_ready'
      : (row.in_stock === false || row.inStock === false)
      ? 'out_of_stock'
      : 'ready'
  );
  const stockStatusText = row.stock_status_text || row.stockStatusText || (stockStatus === 'not_ready' ? 'ไม่พร้อมส่ง' : stockStatus === 'out_of_stock' ? 'สินค้าหมด' : 'พร้อมส่ง');

  return {
    id: row.id,
    name: row.name || '',
    category: row.category || 'ทั้งหมด',
    price: row.price || '',
    priceLabel: row.priceLabel || row.price_label || '',
    pricePeriod: row.pricePeriod || row.price_period || '',
    hasSecondPrice: Boolean(row.hasSecondPrice ?? row.has_second_price),
    secondPrice: row.secondPrice || row.second_price || '',
    secondPriceLabel: row.secondPriceLabel || row.second_price_label || '',
    tag: row.tag || '',
    tagColor: row.tagColor || row.tag_color || 'pink',
    inStock: row.in_stock !== false && row.inStock !== false && stockStatus !== 'out_of_stock',
    stockStatus,
    stockStatusText,
    devices: row.devices || '',
    resolution: row.resolution || '',
    packageDetails: row.packageDetails || row.package_details || '',
    subDetail: row.subDetail || row.sub_detail || '',
    icon: row.icon || '',
    orderLink: row.orderLink || row.order_link || '',
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : (typeof row.sort_order === 'number' ? row.sort_order : 0),
    prices
  };
}

export function promoToRow(p) {
  return {
    id: p.id,
    name: p.name || '',
    tag: p.tag || '',
    tag_color: p.tagColor || p.tag_color || 'rose',
    promo_type: p.promoType || p.promo_type || (p.appCount === 1 ? 'single' : p.hasApp3 ? 'triple' : 'dual'),
    app_count: p.appCount || p.app_count || (p.apps ? p.apps.length : p.promoType === 'single' ? 1 : p.promoType === 'triple' ? 3 : 2),
    app1_name: p.app1Name || p.app1_name || (p.apps?.[0]?.name) || '',
    app1_icon: p.app1Icon || p.app1_icon || (p.apps?.[0]?.icon) || '',
    app1_devices: p.app1Devices || p.app1_devices || (p.apps?.[0]?.devices) || '',
    app1_resolution: p.app1Resolution || p.app1_resolution || (p.apps?.[0]?.resolution) || '',
    app2_name: p.app2Name || p.app2_name || (p.apps?.[1]?.name) || '',
    app2_icon: p.app2Icon || p.app2_icon || (p.apps?.[1]?.icon) || '',
    app2_devices: p.app2Devices || p.app2_devices || (p.apps?.[1]?.devices) || '',
    app2_resolution: p.app2Resolution || p.app2_resolution || (p.apps?.[1]?.resolution) || '',
    has_app3: Boolean(p.hasApp3 || p.has_app3 || (p.apps && p.apps.length >= 3)),
    app3_name: p.app3Name || p.app3_name || (p.apps?.[2]?.name) || '',
    app3_icon: p.app3Icon || p.app3_icon || (p.apps?.[2]?.icon) || '',
    app3_devices: p.app3Devices || p.app3_devices || (p.apps?.[2]?.devices) || '',
    app3_resolution: p.app3Resolution || p.app3_resolution || (p.apps?.[2]?.resolution) || '',
    original_price: p.originalPrice || p.original_price || '',
    promo_price: p.promoPrice || p.promo_price || '',
    price_period: p.pricePeriod || p.price_period || '',
    in_stock: p.inStock !== false && p.in_stock !== false,
    stock_status: p.stockStatus || p.stock_status || 'ready',
    stock_status_text: p.stockStatusText || p.stock_status_text || '',
    package_details: p.packageDetails || p.package_details || '',
    order_link: p.orderLink || p.order_link || '',
    prices: Array.isArray(p.prices) ? p.prices : [],
    updated_at: new Date().toISOString()
  };
}

export function rowToPromo(row) {
  const apps = Array.isArray(row.apps) && row.apps.length > 0
    ? row.apps
    : [
        ...(row.app1_name || row.app1Name || row.app1_icon || row.app1Icon ? [{ id: 'app-1', name: row.app1_name || row.app1Name || '', icon: row.app1_icon || row.app1Icon || '', devices: row.app1_devices || row.app1Devices || '', resolution: row.app1_resolution || row.app1Resolution || '' }] : []),
        ...(row.app2_name || row.app2Name || row.app2_icon || row.app2Icon ? [{ id: 'app-2', name: row.app2_name || row.app2Name || '', icon: row.app2_icon || row.app2Icon || '', devices: row.app2_devices || row.app2Devices || '', resolution: row.app2_resolution || row.app2Resolution || '' }] : []),
        ...((row.has_app3 || row.hasApp3) && (row.app3_name || row.app3Name || row.app3_icon || row.app3Icon) ? [{ id: 'app-3', name: row.app3_name || row.app3Name || '', icon: row.app3_icon || row.app3Icon || '', devices: row.app3_devices || row.app3Devices || '', resolution: row.app3_resolution || row.app3Resolution || '' }] : [])
      ];

  return {
    id: row.id,
    name: row.name || '',
    tag: row.tag || '',
    tagColor: row.tagColor || row.tag_color || 'rose',
    promoType: row.promoType || row.promo_type || (apps.length === 1 ? 'single' : apps.length === 2 ? 'dual' : apps.length === 3 ? 'triple' : 'combo'),
    appCount: row.appCount || row.app_count || apps.length || 2,
    apps,
    app1Name: row.app1Name || row.app1_name || (apps[0]?.name) || '',
    app1Icon: row.app1Icon || row.app1_icon || (apps[0]?.icon) || '',
    app1Devices: row.app1Devices || row.app1_devices || (apps[0]?.devices) || '',
    app1Resolution: row.app1Resolution || row.app1_resolution || (apps[0]?.resolution) || '',
    app2Name: row.app2Name || row.app2_name || (apps[1]?.name) || '',
    app2Icon: row.app2Icon || row.app2_icon || (apps[1]?.icon) || '',
    app2Devices: row.app2Devices || row.app2_devices || (apps[1]?.devices) || '',
    app2Resolution: row.app2Resolution || row.app2_resolution || (apps[1]?.resolution) || '',
    hasApp3: Boolean(row.hasApp3 || row.has_app3 || apps.length >= 3),
    app3Name: row.app3Name || row.app3_name || (apps[2]?.name) || '',
    app3Icon: row.app3Icon || row.app3_icon || (apps[2]?.icon) || '',
    app3Devices: row.app3Devices || row.app3_devices || (apps[2]?.devices) || '',
    app3Resolution: row.app3Resolution || row.app3_resolution || (apps[2]?.resolution) || '',
    originalPrice: row.originalPrice || row.original_price || '',
    promoPrice: row.promoPrice || row.promo_price || '',
    pricePeriod: row.pricePeriod || row.price_period || '',
    inStock: row.in_stock !== false && row.inStock !== false,
    stockStatus: row.stockStatus || row.stock_status || 'ready',
    stockStatusText: row.stockStatusText || row.stock_status_text || '',
    packageDetails: row.packageDetails || row.package_details || '',
    orderLink: row.orderLink || row.order_link || '',
    prices: Array.isArray(row.prices) ? row.prices : []
  };
}

export function settingsToRow(s) {
  return {
    id: 'main',
    store_name: s.storeName || 'BA STORE',
    badge_text: s.badgeText || '',
    description: s.description || '',
    sub_description: s.subDescription || '',
    opening_hours: s.openingHours || '',
    announcement: s.announcement || '',
    banner_url: s.bannerUrl || '',
    banner_fit: s.bannerFit || 'auto',
    banner_position: s.bannerPosition || 'center',
    logo_url: s.logoUrl || '',
    line_id: s.lineId || '',
    line_url: s.lineUrl || '',
    admin_password: s.adminPassword || s.adminPin || '',
    updated_at: new Date().toISOString()
  };
}

export function rowToSettings(row) {
  return {
    storeName: row.store_name || row.storeName || 'BA STORE',
    badgeText: row.badge_text !== undefined ? row.badge_text : (row.badgeText || ''),
    description: row.description !== undefined ? row.description : '',
    subDescription: row.sub_description !== undefined ? row.sub_description : (row.subDescription || ''),
    openingHours: row.opening_hours !== undefined ? row.opening_hours : (row.openingHours || ''),
    announcement: row.announcement !== undefined ? row.announcement : '',
    bannerUrl: row.banner_url || row.bannerUrl || '',
    bannerFit: row.banner_fit || row.bannerFit || 'auto',
    bannerPosition: row.banner_position || row.bannerPosition || 'center',
    logoUrl: row.logo_url || row.logoUrl || '',
    lineId: row.line_id !== undefined ? row.line_id : (row.lineId || ''),
    lineUrl: row.line_url !== undefined ? row.line_url : (row.lineUrl || ''),
    otpUrl: row.otp_url !== undefined ? row.otp_url : (row.otpUrl || 'https://ba-store-otp.vercel.app/'),
    badge1Title: row.badge1_title !== undefined ? row.badge1_title : (row.badge1Title !== undefined ? row.badge1Title : 'ได้วันใช้งานครบ 100%'),
    badge1Sub: row.badge1_sub !== undefined ? row.badge1_sub : (row.badge1Sub !== undefined ? row.badge1Sub : ''),
    badge2Title: row.badge2_title !== undefined ? row.badge2_title : (row.badge2Title !== undefined ? row.badge2Title : 'ใช้เวลาตัดไม่นาน'),
    badge2Sub: row.badge2_sub !== undefined ? row.badge2_sub : (row.badge2Sub !== undefined ? row.badge2Sub : ''),
    badge3Title: row.badge3_title !== undefined ? row.badge3_title : (row.badge3Title !== undefined ? row.badge3Title : 'ดูแลตลอดการใช้งาน'),
    badge3Sub: row.badge3_sub !== undefined ? row.badge3_sub : (row.badge3Sub !== undefined ? row.badge3Sub : ''),
    adminPassword: row.admin_password || row.adminPassword || '',
    adminPin: row.admin_password || row.adminPassword || ''
  };
}

// ----------------------------------------------------------------------------
// Local Storage Operations with Cloud Sync
// ----------------------------------------------------------------------------

// Timestamps of last local actions to prevent self-echo race conditions & rubberbanding
const lastLocalSaveTime = {
  products: 0,
  promotions: 0,
  settings: 0
};

export const storage = {
  getProducts: () => {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored products:', e);
    }
    return DEFAULT_PRODUCTS;
  },

  saveProducts: (products) => {
    try {
      lastLocalSaveTime.products = Date.now();
      const withSort = products.map((p, idx) => ({ ...p, sortOrder: idx }));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(withSort));
      // Auto-sync to Cloud in background
      storage.saveCloudProducts(withSort).catch((err) => {
        console.warn('Background cloud sync for products failed:', err);
      });
      return true;
    } catch (e) {
      console.error('Failed to save products:', e);
      return false;
    }
  },

  getPromotions: () => {
    try {
      const stored = localStorage.getItem(PROMOTIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored promotions:', e);
    }
    return DEFAULT_PROMOTIONS;
  },

  savePromotions: (promotions) => {
    try {
      lastLocalSaveTime.promotions = Date.now();
      const withSort = promotions.map((p, idx) => ({ ...p, sortOrder: idx }));
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(withSort));
      // Auto-sync to Cloud in background
      storage.saveCloudPromotions(withSort).catch((err) => {
        console.warn('Background cloud sync for promotions failed:', err);
      });
      return true;
    } catch (e) {
      console.error('Failed to save promotions:', e);
      return false;
    }
  },

  getSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_STORE_SETTINGS,
            ...parsed,
            bannerUrl: parsed.bannerUrl || DEFAULT_STORE_SETTINGS.bannerUrl,
            logoUrl: parsed.logoUrl || DEFAULT_STORE_SETTINGS.logoUrl,
            adminPassword: parsed.adminPassword || parsed.adminPin || DEFAULT_STORE_SETTINGS.adminPassword
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse stored settings:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  },

  saveSettings: (settings) => {
    try {
      lastLocalSaveTime.settings = Date.now();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      // Auto-sync to Cloud in background
      storage.saveCloudSettings(settings).catch((err) => {
        console.warn('Background cloud sync for settings failed:', err);
      });
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // Supabase Cloud Database Operations
  // --------------------------------------------------------------------------

  /**
   * Save products to relational table 'products' (and backup to 'store_data')
   */
  saveCloudProducts: async (products) => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // 1. Try upserting to relational 'products' table
      const rows = products.map((p, idx) => productToRow(p, idx));
      const { error: prodErr } = await client
        .from('products')
        .upsert(rows, { onConflict: 'id' });

      if (prodErr && prodErr.code !== '42P01') {
        console.warn('Error saving to products table:', prodErr);
      }

      // 2. Clean up removed products if table exists
      if (!prodErr) {
        const currentIds = products.map((p) => p.id);
        const { data: remoteRows } = await client.from('products').select('id');
        if (remoteRows && Array.isArray(remoteRows)) {
          const toDelete = remoteRows.filter((r) => !currentIds.includes(r.id)).map((r) => r.id);
          if (toDelete.length > 0) {
            await client.from('products').delete().in('id', toDelete);
          }
        }
      }

      // 3. Backup to store_data table
      const cleanProducts = products.map((p, idx) => rowToProduct({ ...productToRow(p, idx), ...p }));
      await client.from('store_data').upsert(
        { key: 'products', data: cleanProducts, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

      return true;
    } catch (err) {
      console.error('saveCloudProducts failed:', err);
      return false;
    }
  },

  /**
   * Save promotions to relational table 'promotions' (and backup to 'store_data')
   */
  saveCloudPromotions: async (promotions) => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // 1. Upsert to relational 'promotions' table
      const rows = promotions.map(promoToRow);
      const { error: promoErr } = await client
        .from('promotions')
        .upsert(rows, { onConflict: 'id' });

      if (promoErr && promoErr.code !== '42P01') {
        console.warn('Error saving to promotions table:', promoErr);
      }

      // 2. Clean up removed promotions if table exists
      if (!promoErr) {
        const currentIds = promotions.map((p) => p.id);
        const { data: remoteRows } = await client.from('promotions').select('id');
        if (remoteRows && Array.isArray(remoteRows)) {
          const toDelete = remoteRows.filter((r) => !currentIds.includes(r.id)).map((r) => r.id);
          if (toDelete.length > 0) {
            await client.from('promotions').delete().in('id', toDelete);
          }
        }
      }

      // 3. Backup to store_data table
      const cleanPromos = promotions.map((p) => rowToPromo({ ...promoToRow(p), ...p }));
      await client.from('store_data').upsert(
        { key: 'promotions', data: cleanPromos, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

      return true;
    } catch (err) {
      console.error('saveCloudPromotions failed:', err);
      return false;
    }
  },

  /**
   * Save store settings to relational table 'store_settings' (and backup to 'store_data')
   */
  saveCloudSettings: async (settings) => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // 1. Upsert to relational 'store_settings' table
      const row = settingsToRow(settings);
      const { error: settingsErr } = await client
        .from('store_settings')
        .upsert([row], { onConflict: 'id' });

      if (settingsErr && settingsErr.code !== '42P01') {
        console.warn('Error saving to store_settings table:', settingsErr);
      }

      // 2. Backup to store_data table
      await client.from('store_data').upsert(
        { key: 'settings', data: settings, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

      return true;
    } catch (err) {
      console.error('saveCloudSettings failed:', err);
      return false;
    }
  },

  /**
   * Fetch all store data from Supabase Cloud
   * Tries relational tables first (products, promotions, store_settings), then falls back to store_data
   */
  fetchCloudData: async () => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // Try querying dedicated relational tables + store_data
      const [prodsRes, promosRes, settingsRes, storeDataRes] = await Promise.all([
        client.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        client.from('promotions').select('*').order('created_at', { ascending: true }),
        client.from('store_settings').select('*').limit(1),
        client.from('store_data').select('key, data')
      ]);

      const hasRelationalProducts = !prodsRes.error && Array.isArray(prodsRes.data) && prodsRes.data.length > 0;
      const hasRelationalPromos = !promosRes.error && Array.isArray(promosRes.data);
      const hasRelationalSettings = !settingsRes.error && Array.isArray(settingsRes.data) && settingsRes.data.length > 0;
      const storeDataMap = {};
      if (storeDataRes && Array.isArray(storeDataRes.data)) {
        storeDataRes.data.forEach((r) => {
          if (r.key && r.data) storeDataMap[r.key] = r.data;
        });
      }

      if (hasRelationalProducts || hasRelationalPromos || hasRelationalSettings || Object.keys(storeDataMap).length > 0) {
        const result = {};
        if (hasRelationalProducts) {
          const prods = prodsRes.data.map(rowToProduct);
          if (storeDataMap.products && Array.isArray(storeDataMap.products)) {
            const storeMap = new Map(storeDataMap.products.map((p) => [p.id, p]));
            result.products = prods.map((p) => {
              const s = storeMap.get(p.id);
              if (!s) return p;
              return {
                ...p,
                packageDetails: p.packageDetails || s.packageDetails || s.package_details || '',
                subDetail: p.subDetail || s.subDetail || s.sub_detail || '',
                devices: p.devices || s.devices || '',
                resolution: p.resolution || s.resolution || '',
                orderLink: p.orderLink || s.orderLink || s.order_link || ''
              };
            });
          } else {
            result.products = prods;
          }
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(result.products));
        } else if (storeDataMap.products && Array.isArray(storeDataMap.products)) {
          result.products = storeDataMap.products.map(rowToProduct);
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(result.products));
        }

        if (hasRelationalPromos) {
          const promoRows = promosRes.data.map(rowToPromo);
          if (storeDataMap.promotions && Array.isArray(storeDataMap.promotions) && storeDataMap.promotions.length > 0) {
            const storeMap = new Map(storeDataMap.promotions.map((p) => [p.id, p]));
            result.promotions = promoRows.map((p) => {
              const s = storeMap.get(p.id);
              if (!s) return p;
              return {
                ...p,
                packageDetails: p.packageDetails || s.packageDetails || s.package_details || '',
                orderLink: p.orderLink || s.orderLink || s.order_link || '',
                pricePeriod: p.pricePeriod || s.pricePeriod || s.price_period || ''
              };
            });
          } else {
            result.promotions = promoRows;
          }
          localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(result.promotions));
        } else if (storeDataMap.promotions && Array.isArray(storeDataMap.promotions) && storeDataMap.promotions.length > 0) {
          result.promotions = storeDataMap.promotions.map(rowToPromo);
          localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(result.promotions));
        }

        if (hasRelationalSettings || storeDataMap.settings) {
          const fromRelational = hasRelationalSettings ? rowToSettings(settingsRes.data[0]) : {};
          const fromStoreData = storeDataMap.settings && typeof storeDataMap.settings === 'object' ? storeDataMap.settings : {};
          result.settings = {
            ...DEFAULT_STORE_SETTINGS,
            ...fromRelational,
            ...fromStoreData
          };
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(result.settings));
        }
        return result;
      }

      // Fallback: Query legacy store_data table
      const { data: legacyData, error: legacyErr } = await client
        .from('store_data')
        .select('key, data');

      if (legacyErr || !legacyData || !Array.isArray(legacyData)) return null;

      const result = {};
      legacyData.forEach((row) => {
        if (row.key && row.data) {
          result[row.key] = row.data;
          if (row.key === 'products' && Array.isArray(row.data)) {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(row.data));
          } else if (row.key === 'promotions' && Array.isArray(row.data)) {
            localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(row.data));
          } else if (row.key === 'settings' && typeof row.data === 'object') {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(row.data));
          }
        }
      });

      return result;
    } catch (err) {
      console.warn('Failed to fetch data from Supabase:', err);
      return null;
    }
  },

  /**
   * Push all current local data (products, settings, promotions) to Cloud
   */
  syncAllToCloud: async (products, settings, promotions) => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'ยังไม่ได้ตั้งค่าเชื่อมต่อ Supabase' };
    }
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'ไม่สามารถเริ่มต้น Supabase Client ได้' };
    }

    try {
      // 1. Sync to relational tables
      const currentProds = products || storage.getProducts();
      const currentPromos = promotions || storage.getPromotions();
      const currentSettings = settings || storage.getSettings();

      await Promise.all([
        storage.saveCloudProducts(currentProds),
        storage.saveCloudPromotions(currentPromos),
        storage.saveCloudSettings(currentSettings)
      ]);

      return { success: true, message: 'ซิงค์ข้อมูลทั้งหมดขึ้น Supabase Cloud สำเร็จเรียบร้อยแล้ว!' };
    } catch (err) {
      return { success: false, message: err.message || 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล' };
    }
  },

  /**
   * Subscribe to Supabase Realtime changes across all tables
   */
  subscribeToCloudChanges: (onUpdate) => {
    if (!isSupabaseConfigured()) return () => {};
    const client = getSupabaseClient();
    if (!client) return () => {};

    try {
      let prodDebounceTimer = null;
      let promoDebounceTimer = null;

      const channel = client
        .channel('store_data_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            clearTimeout(prodDebounceTimer);
            prodDebounceTimer = setTimeout(async () => {
              // Ignore self-echo within 3 seconds of local save
              if (Date.now() - lastLocalSaveTime.products < 3000) return;
              const { data } = await client
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: true });
              if (data && Array.isArray(data)) {
                const mapped = data.map(rowToProduct);
                localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mapped));
                if (typeof onUpdate === 'function') onUpdate({ key: 'products', data: mapped });
              }
            }, 400);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'promotions' },
          () => {
            clearTimeout(promoDebounceTimer);
            promoDebounceTimer = setTimeout(async () => {
              // Ignore self-echo within 3 seconds of local save
              if (Date.now() - lastLocalSaveTime.promotions < 3000) return;
              const { data } = await client.from('promotions').select('*').order('created_at', { ascending: true });
              if (data && Array.isArray(data)) {
                const mapped = data.map(rowToPromo);
                localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(mapped));
                if (typeof onUpdate === 'function') onUpdate({ key: 'promotions', data: mapped });
              }
            }, 400);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_settings' },
          async (payload) => {
            if (Date.now() - lastLocalSaveTime.settings < 3000) return;
            const { data: sData } = await client.from('store_data').select('data').eq('key', 'settings').maybeSingle();
            const fromStoreData = sData?.data && typeof sData.data === 'object' ? sData.data : {};
            const fromPayload = payload.new ? rowToSettings(payload.new) : {};
            const merged = {
              ...DEFAULT_STORE_SETTINGS,
              ...fromPayload,
              ...fromStoreData
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
            if (typeof onUpdate === 'function') onUpdate({ key: 'settings', data: merged });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_data' },
          (payload) => {
            const newRow = payload.new;
            if (newRow && newRow.key && newRow.data) {
              if (newRow.key === 'products') {
                if (Date.now() - lastLocalSaveTime.products < 3000) return;
                localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newRow.data));
                if (typeof onUpdate === 'function') onUpdate({ key: 'products', data: newRow.data });
              } else if (newRow.key === 'promotions') {
                if (Date.now() - lastLocalSaveTime.promotions < 3000) return;
                localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(newRow.data));
                if (typeof onUpdate === 'function') onUpdate({ key: 'promotions', data: newRow.data });
              } else if (newRow.key === 'settings') {
                if (Date.now() - lastLocalSaveTime.settings < 3000) return;
                const merged = { ...DEFAULT_STORE_SETTINGS, ...newRow.data };
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
                if (typeof onUpdate === 'function') onUpdate({ key: 'settings', data: merged });
              }
            }
          }
        )
        .subscribe();

      return () => {
        clearTimeout(prodDebounceTimer);
        clearTimeout(promoDebounceTimer);
        client.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription failed:', err);
      return () => {};
    }
  }
};

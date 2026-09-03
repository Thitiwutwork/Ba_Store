import { DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS, DEFAULT_PROMOTIONS } from '../data/initialData';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

const PRODUCTS_KEY = 'BA_STORE_PRODUCTS_V1';
const SETTINGS_KEY = 'BA_STORE_SETTINGS_V1';
const PROMOTIONS_KEY = 'BA_STORE_PROMOTIONS_V1';

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
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      // Auto-sync to Cloud in background if connected
      storage.saveCloudData('products', products).catch((err) => {
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
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
      // Auto-sync to Cloud in background if connected
      storage.saveCloudData('promotions', promotions).catch((err) => {
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
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      // Auto-sync to Cloud in background if connected
      storage.saveCloudData('settings', settings).catch((err) => {
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
   * Save individual key to Supabase store_data table
   */
  saveCloudData: async (key, data) => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { error } = await client
        .from('store_data')
        .upsert(
          {
            key,
            data,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );

      if (error) {
        console.error(`Error saving ${key} to Supabase:`, error);
        return false;
      }
      return true;
    } catch (err) {
      console.error(`Error in saveCloudData for ${key}:`, err);
      return false;
    }
  },

  /**
   * Fetch all store data from Supabase Cloud
   */
  fetchCloudData: async () => {
    if (!isSupabaseConfigured()) return null;
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('store_data')
        .select('key, data');

      if (error) {
        console.warn('Error fetching store_data from Supabase:', error);
        return null;
      }

      if (!data || !Array.isArray(data)) return null;

      const result = {};
      data.forEach((row) => {
        if (row.key && row.data) {
          result[row.key] = row.data;
          // Update local cache
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
      const now = new Date().toISOString();
      const rows = [
        { key: 'products', data: products, updated_at: now },
        { key: 'settings', data: settings, updated_at: now },
        { key: 'promotions', data: promotions || [], updated_at: now }
      ];

      const { error } = await client
        .from('store_data')
        .upsert(rows, { onConflict: 'key' });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'ซิงค์ข้อมูลทั้งหมดขึ้น Cloud สำเร็จเรียบร้อยแล้ว!' };
    } catch (err) {
      return { success: false, message: err.message || 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล' };
    }
  },

  /**
   * Subscribe to Supabase Realtime changes on store_data table
   */
  subscribeToCloudChanges: (onUpdate) => {
    if (!isSupabaseConfigured()) return () => {};
    const client = getSupabaseClient();
    if (!client) return () => {};

    try {
      const channel = client
        .channel('store_data_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_data' },
          (payload) => {
            const newRow = payload.new;
            if (newRow && newRow.key && newRow.data) {
              // Update local cache
              if (newRow.key === 'products' && Array.isArray(newRow.data)) {
                localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newRow.data));
              } else if (newRow.key === 'promotions' && Array.isArray(newRow.data)) {
                localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(newRow.data));
              } else if (newRow.key === 'settings' && typeof newRow.data === 'object') {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(newRow.data));
              }

              if (typeof onUpdate === 'function') {
                onUpdate({ key: newRow.key, data: newRow.data });
              }
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Failed to subscribe to Supabase Realtime:', err);
      return () => {};
    }
  },

  exportBackup: (products, settings, promotions) => {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      products,
      settings,
      promotions: promotions || []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bastore-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importBackup: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data && data.products && Array.isArray(data.products)) {
            resolve({
              products: data.products,
              settings: data.settings || DEFAULT_STORE_SETTINGS,
              promotions: data.promotions || DEFAULT_PROMOTIONS
            });
          } else {
            reject(new Error('ไฟล์สำรองไม่ถูกต้อง'));
          }
        } catch {
          reject(new Error('ไม่สามารถอ่านไฟล์ JSON ได้'));
        }
      };
      reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการเปิดไฟล์'));
      reader.readAsText(file);
    });
  },

  resetAll: () => {
    try {
      localStorage.removeItem(PRODUCTS_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(PROMOTIONS_KEY);
      return true;
    } catch {
      return false;
    }
  }
};

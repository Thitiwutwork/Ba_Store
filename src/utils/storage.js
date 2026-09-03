import { DEFAULT_PRODUCTS, DEFAULT_STORE_SETTINGS, DEFAULT_PROMOTIONS } from '../data/initialData';

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
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
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

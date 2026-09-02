// Initial high-resolution SVG icons for popular premium apps
export const APP_ICONS = {
  iqiyi: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2324C653"/><rect x="20" y="24" width="60" height="52" rx="14" fill="none" stroke="white" stroke-width="8"/><text x="50" y="58" fill="white" font-size="22" font-family="Arial,sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">iQIYI</text></svg>`,
  
  netflix: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23141414"/><path d="M32 20h11.5v60H32zm24.5 0H68v60H56.5z" fill="%23E50914"/><path d="M32 20h12l24 60H56z" fill="%23B81D24"/></svg>`,
  
  youtube: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FF0000"/><path d="M72 36c-.8-3-3.2-5.4-6.2-6.2C60.3 28 50 28 50 28s-10.3 0-15.8 1.8c-3 .8-5.4 3.2-6.2 6.2C26 41.5 26 50 26 50s0 8.5 1.8 14c.8 3 3.2 5.4 6.2 6.2 5.5 1.8 15.8 1.8 15.8 1.8s10.3 0 15.8-1.8c3-.8 5.4-3.2 6.2-6.2 1.8-5.5 1.8-14 1.8-14s0-8.5-1.8-14z" fill="white"/><polygon points="45,42 45,58 59,50" fill="%23FF0000"/></svg>`,
  
  spotify: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23191414"/><circle cx="50" cy="50" r="38" fill="%231DB954"/><path d="M31 39c14-4 30-2 42 5" stroke="%23191414" stroke-width="6.5" stroke-linecap="round" fill="none"/><path d="M33 49c12-3 26-2 36 4" stroke="%23191414" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M36 59c10-2 21-1 30 4" stroke="%23191414" stroke-width="4.5" stroke-linecap="round" fill="none"/></svg>`,
  
  disney: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230E1339"/><path d="M22 62c6-18 16-28 32-34-4 7-6 15-4 22 2 8 8 13 14 16-12 1-28-2-42-4z" fill="%230063e5"/><text x="50" y="58" fill="white" font-size="28" font-family="Georgia,serif" font-weight="bold" font-style="italic" text-anchor="middle">Disney+</text></svg>`,
  
  canva: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300C4CC"/><stop offset="100%" stop-color="%237D2AE8"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23cg)"/><text x="50" y="60" fill="white" font-size="30" font-family="Brush Script MT,cursive,Arial" font-weight="bold" text-anchor="middle">Canva</text></svg>`,

  viu: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23F6BE00"/><text x="50" y="60" fill="%23111111" font-size="30" font-family="Arial,sans-serif" font-weight="900" text-anchor="middle">Viu</text></svg>`,

  chatgpt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2310A37F"/><circle cx="50" cy="50" r="28" fill="none" stroke="white" stroke-width="5"/><text x="50" y="57" fill="white" font-size="20" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle">AI</text></svg>`,

  capcut: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23111111"/><path d="M26 36l24 14-24 14zm48 0L50 50l24 14z" fill="white"/></svg>`
};

// Store information default configuration (Facebook removed)
export const DEFAULT_STORE_SETTINGS = {
  storeName: "BA STORE",
  badgeText: "รับตัดแอพราคาส่ง",
  description: "ขายส่งแอพพรีเมี่ยมราคาถูกม๊ากก 💖",
  subDescription: "โยนหรือใช้เองก็ได้ไม่บวกเพิ่ม ได้วันใช้งานครบแน่นอน",
  openingHours: "เปิด 09:00 - 23:00 น.",
  announcement: "⚡ จัดส่งรวดเร็วทันใจภายใน 5 - 15 นาที • รับประกันดูแลตลอดการใช้งาน",
  
  bannerUrl: "", // Empty string means use the built-in cute vector banner
  logoUrl: "",   // Empty string means use the built-in cute store logo
  
  lineId: "@bastore",
  lineUrl: "https://line.me/ti/p/~@bastore",
  adminPin: "1234"
};

// 6 Default Sample Products with rich details, devices, resolution, and dual price support
export const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "iQIYI มาตรฐาน ( 30 วัน )",
    category: "ซีรีส์ / หนัง",
    tag: "ขายดี",
    tagColor: "green",
    devices: "1 อุปกรณ์ (ดูได้พร้อมกัน)",
    resolution: "Full HD 1080p คมชัดระดับสูง",
    packageDetails: "• ดูได้พร้อมกัน 1 จอ (รองรับมือถือ, แท็บเล็ต, Smart TV)\n• ความคมชัด Full HD 1080p เสียงคมชัด\n• บัญชีแท้ 100% ดูได้ 30 วันเต็ม\n• รับประกันดูแลตลอดระยะเวลาใช้งาน",
    subDetail: "ลูกค้า 56 / ร้าน 59",
    priceLabel: "ลูกค้า",
    price: "56",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "59",
    priceUnit: "฿",
    pricePeriod: "/ 30 วัน",
    icon: APP_ICONS.iqiyi,
    orderLink: "",
    inStock: true
  },
  {
    id: "prod-2",
    name: "iQIYI มาตรฐาน ( 7 วัน )",
    category: "ซีรีส์ / หนัง",
    tag: "ระยะสั้น",
    tagColor: "purple",
    devices: "1 อุปกรณ์ (ดูได้พร้อมกัน)",
    resolution: "Full HD 1080p",
    packageDetails: "• แพ็กเกจระยะสั้น 7 วัน เหมาะสำหรับคนดูจบไว\n• ดูพร้อมกันได้ 1 จอ ทุกอุปกรณ์\n• ภาพคมชัดระดับ Full HD\n• จัดส่งบัญชีไวภายใน 5-15 นาที",
    subDetail: "ลูกค้า หรือ ร้าน 15",
    priceLabel: "ลูกค้า",
    price: "15",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "15",
    priceUnit: "฿",
    pricePeriod: "/ 7 วัน",
    icon: APP_ICONS.iqiyi,
    orderLink: "",
    inStock: true
  },
  {
    id: "prod-3",
    name: "Netflix Premium 4K",
    category: "ซีรีส์ / หนัง",
    tag: "ยอดนิยม 🔥",
    tagColor: "pink",
    devices: "1 จอส่วนตัว (ล็อกรหัส PIN ได้)",
    resolution: "Ultra HD 4K + HDR + Spatial Audio",
    packageDetails: "• จอส่วนตัว 1 จอ ล็อกรหัส PIN ป้องกันคนอื่นเข้า\n• คมชัดสูงสุดระดับ 4K Ultra HD พร้อมระบบเสียง Spatial Audio\n• ดูได้ทั้ง TV, คอมพิวเตอร์, มือถือ, แท็บเล็ต\n• ใช้งานได้ 30 วันเต็ม ไม่หลุดระหว่างดู",
    subDetail: "จอเดี่ยว ล็อครหัส PIN ได้",
    priceLabel: "ลูกค้า",
    price: "129",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "119",
    priceUnit: "฿",
    pricePeriod: "/ เดือน",
    icon: APP_ICONS.netflix,
    orderLink: "",
    inStock: true
  },
  {
    id: "prod-4",
    name: "YouTube Premium",
    category: "สตรีมมิ่ง",
    tag: "แนะนำ ✨",
    tagColor: "rose",
    devices: "ทุกอุปกรณ์ที่ล็อกอินอีเมล",
    resolution: "Full HD 1080p Premium Bitrate / 4K",
    packageDetails: "• ต่อเมลเดิมของลูกค้าได้ทันทียื่นแค่เมล ไม่ต้องใช้รหัสผ่าน\n• ไม่มีโฆษณาคั่นแม้แต่วินาทีเดียว\n• ฟังเพลงแบบปิดหน้าจอมือถือได้ (Background Play)\n• ดาวน์โหลดคลิปและเพลงไว้ดูแบบออฟไลน์ได้\n• ใช้งานฟรี YouTube Music Premium",
    subDetail: "ต่อเมลเดิมได้ ไม่ต้องให้รหัส",
    priceLabel: "ลูกค้า",
    price: "39",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "35",
    priceUnit: "฿",
    pricePeriod: "/ เดือน",
    icon: APP_ICONS.youtube,
    orderLink: "",
    inStock: true
  },
  {
    id: "prod-5",
    name: "Spotify Premium",
    category: "เพลง",
    tag: "ฟังเพลิน",
    tagColor: "green",
    devices: "ใช้งานได้ทุกอุปกรณ์ที่ล็อกอิน",
    resolution: "คุณภาพเสียง Very High 320 kbps",
    packageDetails: "• ฟังเพลงต่อเนื่องไม่มีโฆษณาคั่น\n• คุณภาพเสียงระดับสูงสุด Very High 320 kbps\n• ข้ามเพลงได้ไม่จำกัดจำนวนครั้ง\n• ดาวน์โหลดเพลงฟังแบบออฟไลน์ได้ทุกที่\n• รับประกันดูแลเต็มระยะเวลา 30 วัน",
    subDetail: "ครอบครัวหรือเดี่ยว 30 วัน",
    priceLabel: "ลูกค้า",
    price: "49",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "45",
    priceUnit: "฿",
    pricePeriod: "/ เดือน",
    icon: APP_ICONS.spotify,
    orderLink: "",
    inStock: true
  },
  {
    id: "prod-6",
    name: "Canva Pro",
    category: "กราฟิก / ทำงาน",
    tag: "คุ้มค่า 💎",
    tagColor: "purple",
    devices: "ล็อกอินได้ทั้งคอมพิวเตอร์และมือถือ",
    resolution: "ส่งออกไฟล์ความละเอียดสูงสุด SVG / PNG / 4K Video",
    packageDetails: "• ปลดล็อกเทมเพลต รูปภาพ วิดีโอ กราฟิก และฟอนต์พรีเมียมกว่า 100+ ล้านรายการ\n• ลบพื้นหลัง (Background Remover) ด้วย 1 คลิก\n• ปรับขนาดดีไซน์อัตโนมัติ Magic Resize\n• พื้นที่จัดเก็บคลาวด์ 1TB ใช้งานอีเมลตัวเอง 365 วันเต็ม",
    subDetail: "ใช้อีเมลตัวเอง 365 วัน",
    priceLabel: "ลูกค้า",
    price: "159",
    hasSecondPrice: true,
    secondPriceLabel: "ร้าน",
    secondPrice: "145",
    priceUnit: "฿",
    pricePeriod: "/ ปี",
    icon: APP_ICONS.canva,
    orderLink: "",
    inStock: true
  }
];

export const CATEGORIES = [
  "ทั้งหมด"
];

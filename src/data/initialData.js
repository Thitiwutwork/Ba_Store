// Official high-resolution App Store & Google Play icons for popular premium apps
export const APP_ICONS = {
  iqiyi: '/logos/iqiyi.png',
  viu: '/logos/viu.png',
  wetv: '/logos/wetv.png',
  bilibili: '/logos/bilibili.png',
  netflix: '/logos/netflix.png',
  youtube: '/logos/youtube.png',
  disney: '/logos/disney.png',
  spotify: '/logos/spotify.png',
  canva: '/logos/canva.png',
  chatgpt: '/logos/chatgpt.png',
  capcut: '/logos/capcut.png',
  youku: '/logos/youku.png',
  otp: '/logos/otp.png'
};

// Store information default configuration
export const DEFAULT_STORE_SETTINGS = {
  storeName: "BA STORE",
  badgeText: "รับตัดแอพราคาส่ง",
  description: "ขายส่งแอพพรีเมี่ยมราคาถูกม๊ากก 💖",
  subDescription: "โยนหรือใช้เองก็ได้ไม่บวกเพิ่ม ได้วันใช้งานครบแน่นอน",
  openingHours: "เปิด 09:00 - 23:00 น.",
  announcement: "⚡ จัดส่งรวดเร็วทันใจภายใน 5 - 15 นาที • รับประกันดูแลตลอดการใช้งาน",
  
  bannerUrl: "/images/banner.jpg", // Default store banner from image folder
  bannerFit: "auto",              // "auto" | "contain" | "cover"
  bannerPosition: "center",       // "top" | "center" | "bottom"
  logoUrl: "/images/logo.jpg",     // Default store logo from image folder
  
  lineId: "@bastore",
  lineUrl: "https://line.me/ti/p/~@bastore",
  otpUrl: "https://ba-store-otp.vercel.app/",
  badge1Title: "ได้วันใช้งานครบ 100%",
  badge1Sub: "ของแท้ ปลอดภัย",
  badge2Title: "ใช้เวลาตัดไม่นาน",
  badge2Sub: "เปิดบริการทุกวัน",
  badge3Title: "ดูแลตลอดการใช้งาน",
  adminPassword: "",
  adminPin: ""
};

// Default Store Products including OTP and YouTube
export const DEFAULT_PRODUCTS = [
  {
    id: "prod-pgvqxnw",
    name: "iQIYI มาตรฐาน ( 90 วัน )",
    category: "ทั้งหมด",
    tag: "",
    tagColor: "pink",
    devices: "ดูพร้อมกันได้ 2 อุปกรณ์",
    resolution: "ความคมชัด 1080P (Full HD)",
    packageDetails: "- ไม่มีโฆษณาคั่น\n- รับชมหนังสุดฮอตก่อนใคร\n- ระบบเสียง Dolby",
    subDetail: "ใช้ได้หลายอุปกรณ์",
    priceLabel: "เมลล์ลูกค้า",
    price: "206",
    hasSecondPrice: true,
    secondPriceLabel: "เมลล์ร้าน",
    secondPrice: "209",
    priceUnit: "฿",
    pricePeriod: "90 วัน",
    icon: APP_ICONS.iqiyi,
    orderLink: "",
    inStock: true,
    prices: [
      { id: "price-1", label: "เมลล์ลูกค้า", price: "206", period: "90 วัน" },
      { id: "price-1788415056600", label: "เมลล์ร้าน", price: "209", period: "90 วัน" }
    ]
  },
  {
    id: "prod-nd2ciam",
    name: "iQIYI มาตรฐาน ( 30 วัน )",
    category: "ทั้งหมด",
    tag: "",
    tagColor: "pink",
    devices: "ดูพร้อมกันได้ 2 อุปกรณ์",
    resolution: "ความคมชัด 1080P (Full HD)",
    packageDetails: "- ไม่มีโฆษณาคั่น\n- รับชมหนังสุดฮอตก่อนใคร\n- ระบบเสียง Dolby",
    subDetail: "ใช้ได้หลายอุปกรณ์",
    priceLabel: "เมลล์ลูกค้า",
    price: "56",
    hasSecondPrice: true,
    secondPriceLabel: "เมลล์ร้าน",
    secondPrice: "59",
    priceUnit: "฿",
    pricePeriod: "30 วัน",
    icon: APP_ICONS.iqiyi,
    orderLink: "",
    inStock: true,
    prices: [
      { id: "price-1", label: "เมลล์ลูกค้า", price: "56", period: "30 วัน" },
      { id: "price-1788414896448", label: "เมลล์ร้าน", price: "59", period: "30 วัน" }
    ]
  },
  {
    id: "prod-h8cv3jj",
    name: "iQIYI มาตรฐาน ( 7 วัน )",
    category: "ทั้งหมด",
    tag: "",
    tagColor: "pink",
    devices: "ดูพร้อมกันได้ 2 อุปกรณ์",
    resolution: "ความคมชัด 1080P (Full HD)",
    packageDetails: "- ไม่มีโฆษณาคั่น\n- รับชมหนังสุดฮอตก่อนใคร\n- ระบบเสียง Dolby",
    subDetail: "ใช้ได้หลายอุปกรณ์",
    priceLabel: "เมลล์ลูกค้า",
    price: "15",
    hasSecondPrice: true,
    secondPriceLabel: "เมลล์ร้าน",
    secondPrice: "15",
    priceUnit: "฿",
    pricePeriod: "7 วัน",
    icon: APP_ICONS.iqiyi,
    orderLink: "",
    inStock: true,
    prices: [
      { id: "price-1", label: "เมลล์ลูกค้า", price: "15", period: "7 วัน" },
      { id: "price-1788414656384", label: "เมลล์ร้าน", price: "15", period: "7 วัน" }
    ]
  },
  {
    id: "prod-3wu3py8",
    name: "Youtube สั้น",
    category: "ทั้งหมด",
    tag: "",
    tagColor: "pink",
    devices: "",
    resolution: "",
    packageDetails: "",
    subDetail: "",
    priceLabel: "ตัดพรีเมี่ยมเมลล์ลูกค้า",
    price: "10",
    hasSecondPrice: true,
    secondPriceLabel: "ปลดยืนยันสิทธิ์",
    secondPrice: "7",
    priceUnit: "฿",
    pricePeriod: "",
    icon: APP_ICONS.youtube,
    orderLink: "",
    inStock: true,
    prices: [
      { id: "price-1", label: "ตัดพรีเมี่ยมเมลล์ลูกค้า", price: "10", period: "" },
      { id: "price-1788414549512", label: "ปลดยืนยันสิทธิ์", price: "7", period: "" },
      { id: "price-1788414549712", label: "ปลดยืนยันสิทธิ์ + ตัดพรีเมี่ยม", price: "14", period: "" }
    ]
  },
  {
    id: "prod-sifqjvy",
    name: "OTP",
    category: "ทั้งหมด",
    tag: "",
    tagColor: "pink",
    devices: "",
    resolution: "",
    packageDetails: "",
    subDetail: "",
    priceLabel: "Gmail (ไม่เก็บเบอร์)",
    price: "10",
    hasSecondPrice: true,
    secondPriceLabel: "Gmail (เก็บเบอร์)",
    secondPrice: "35",
    priceUnit: "฿",
    pricePeriod: "",
    icon: APP_ICONS.otp,
    orderLink: "",
    inStock: true,
    prices: [
      { id: "price-1", label: "Gmail (ไม่เก็บเบอร์)", price: "10", period: "" },
      { id: "price-1788414368656", label: "Gmail (เก็บเบอร์)", price: "35", period: "7 วัน" },
      { id: "price-1788414368960", label: "Netflix", price: "10", period: "" },
      { id: "price-1788414423328", label: "Facebook", price: "10", period: "" },
      { id: "price-1788414423480", label: "Tiktok", price: "20", period: "" },
      { id: "price-1788414423616", label: "Shopee", price: "20", period: "" }
    ]
  }
];

export const CATEGORIES = [
  "ทั้งหมด"
];

// Special Duo Bundle Promotions (เช่น อ้าย 7 วัน + Viu จาก 30 เหลือ 25)
export const DEFAULT_PROMOTIONS = [
  {
    id: "promo-1",
    name: "แพ็กคู่สุดคุ้ม: iQIYI (7 วัน) + Viu Premium (7 วัน)",
    tag: "🔥 โปรคู่สุดฮิต",
    tagColor: "rose",
    app1Name: "iQIYI",
    app1Icon: APP_ICONS.iqiyi,
    app1Devices: "ดูพร้อมกันได้ 2 อุปกรณ์",
    app1Resolution: "Full HD 1080p คมชัดระดับสูง",
    app2Name: "Viu",
    app2Icon: APP_ICONS.viu,
    app2Devices: "ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )",
    app2Resolution: "Full HD 1080p ไม่มีโฆษณาคั่น",
    originalPrice: "30",
    promoPrice: "25",
    pricePeriod: "/ 7 วัน",
    devices: "iQIYI 2 อุปกรณ์ / Viu 3 อุปกรณ์",
    resolution: "Full HD 1080p คมชัดระดับสูง",
    packageDetails: "• ได้รับ 2 แอพพร้อมกัน: iQIYI 7 วัน + Viu 7 วัน\n• iQIYI: ดูพร้อมกันได้ 2 อุปกรณ์\n• Viu: ดูได้ 3 อุปกรณ์ (ทรส 2 / เว็บ 1)\n• ประหยัดทันที ฿5 จากราคาปกติ ฿30 เหลือเพียง ฿25\n• บัญชีแท้ 100% จัดส่งไว ดูแลตลอดการใช้งาน",
    orderLink: "",
    inStock: true
  },
  {
    id: "promo-2",
    name: "แพ็กคู่บันเทิงคูณสอง: Netflix 4K + YouTube Premium (30 วัน)",
    tag: "⭐ เซฟคุ้มสุด",
    tagColor: "amber",
    app1Name: "Netflix",
    app1Icon: APP_ICONS.netflix,
    app1Devices: "1 จอ (ล็อกอินได้มือถือ / แท็บเล็ต / ทีวี)",
    app1Resolution: "Ultra HD 4K + ระบบเสียง Spatial Audio",
    app2Name: "YouTube",
    app2Icon: APP_ICONS.youtube,
    app2Devices: "ใช้อีเมลตัวเอง ดูได้ทุกอุปกรณ์",
    app2Resolution: "ไม่มีโฆษณาคั่น ฟังเพลงจอดับได้",
    originalPrice: "250",
    promoPrice: "219",
    pricePeriod: "/ 30 วัน",
    devices: "Netflix 1 จอ / YouTube ใช้อีเมลตัวเอง",
    resolution: "Ultra HD 4K + ไม่มีโฆษณา",
    packageDetails: "• แพ็กเกจสุดฮิตตลอดกาล Netflix 4K + YouTube Premium\n• Netflix: รับชมได้ 1 จอ ความคมชัด Ultra HD 4K\n• YouTube: ใช้อีเมลตัวเอง ฟังเพลงจอดับได้ ไม่มีโฆษณาคั่น\n• ประหยัดทันที ฿31 คุ้มกว่าซื้อแยกเดี่ยว\n• บัญชีแท้ ไม่เด้ง ดูแลตลอด 30 วันเต็ม",
    orderLink: "",
    inStock: true
  }
];

# 🌸 BA STORE - Premium Reseller Landing Page & Admin CMS

เว็บ Landing Page สไตล์ **Modern Minimal** โทนพาสเทลหวานละมุน ออกแบบตามภาพอ้างอิง รองรับ Responsive ทั้งบนมือถือ (เน้น Mobile-First 2 คอลัมน์) และคอมพิวเตอร์ พร้อมระบบ **Admin Dashboard** สำหรับจัดการสินค้าและข้อมูลร้านค้า พัฒนาด้วย **React + Vite + Tailwind CSS** พร้อมอัปขึ้น **Vercel** ได้ทันที

---

## ✨ จุดเด่นและฟีเจอร์หลัก

### 1. หน้าแรก (Storefront Landing Page)
- **Header Section**:
  - Cover Banner ภาพอาร์ตเวิร์คแนวนอนสีสันสดใส
  - โลโก้ร้านทรงกลมวางซ้อนกึ่งกลางเหลื่อมขอบล่างของ Banner
  - ชื่อร้านตัวหนาเด่นชัด พร้อมสโลแกน และเวลาเปิด-ปิดร้าน
  - ปุ่มทางลัดติดต่อด่วน: **LINE Official** และ **Facebook Messenger**
  - ปุ่มลอย LINE ด่วนบนหน้าจอมือถือ (Floating Action Button)
- **Product Grid Section**:
  - แสดงผลการ์ดสินค้า **2 คอลัมน์บนมือถือ** (ตามภาพอ้างอิง) และ 3-4 คอลัมน์บนจอใหญ่
  - เอฟเฟกต์ Hover ยกตัวนุ่มนวล พร้อมเงาฟุ้งสไตล์พาสเทล
  - แสดงไอคอนแอพคมชัด, ป้ายแท็กหมวดหมู่/สถานะ, รายละเอียดแพ็กเกจย่อย, ราคาตัวใหญ่ชัดเจน
  - ปุ่มกด **"สั่งซื้อ / สอบถาม"**:
    - มีหน้าต่างป๊อปอัพ (Order Modal) แสดงข้อมูลสินค้า
    - ปุ่ม **"คัดลอกข้อความสั่งซื้อ"** เพื่อนำไปวางในแชทได้ทันที 1 คลิก
    - ลิงก์ตรงเปิดแอป LINE และ Facebook
- **ระบบค้นหาและฟิลเตอร์**:
  - ค้นหาชื่อแอพได้แบบ Real-time
  - แถบแท็บเลือกหมวดหมู่ (ทั้งหมด, ซีรีส์ / หนัง, สตรีมมิ่ง, เพลง, กราฟิก / ทำงาน)

### 2. ระบบจัดการหลังบ้านสำหรับเจ้าของร้าน (Admin CMS)
เข้าสู่โหมด Admin ผ่านปุ่ม **"จัดการร้านค้า"** (มุมขวาบนของ Banner หรือที่ Footer ด้านล่าง) โดยมีระบบรหัส PIN ป้องกัน:
- **รหัส PIN เริ่มต้น**: `1234` (สามารถเข้าไปเปลี่ยนได้ในหน้าตั้งค่า)
- **จัดการสินค้า (Product CRUD)**:
  - ➕ **เพิ่มแอพใหม่**: ตั้งชื่อ, เลือกหมวดหมู่, ใส่ป้ายแท็ก, กำหนดสีแท็ก, ใส่รายละเอียดแพ็กเกจ, กำหนดราคาและหน่วยเวลา
  - 🖼️ **เลือกไอคอนแอพ**: มีปุ่มไอคอนพรีเซ็ตสำเร็จรูป (Netflix, Spotify, YouTube, Disney+, iQIYI, Canva, Viu, ChatGPT, CapCut) หรืออัปโหลดภาพจากเครื่อง (Base64) หรือวาง Image URL
  - ✏️ **แก้ไขแอพ**: แก้ไขข้อมูลได้ทุกส่วนทันที
  - 🗑️ **ลบแอพ**: พร้อมระบบยืนยันการลบ
- **จัดการข้อมูลร้านค้า (Store Settings)**:
  - แก้ไขชื่อร้าน, ป้ายสโลแกน, คำอธิบายร้าน, เวลาเปิด-ปิด, แถบประกาศ
  - อัปโหลดหรือเปลี่ยนภาพ Cover Banner และภาพ Logo
  - แก้ไขลิงก์ LINE และ Facebook
  - เปลี่ยนรหัส PIN ผู้ดูแลระบบ
- **สำรองและกู้คืนข้อมูล (Backup & Restore)**:
  - บันทึกลง `localStorage` ของเบราว์เซอร์อัตโนมัติ (ไม่ต้องตั้งค่า Database ให้ยุ่งยาก)
  - 📥 **Export JSON**: ดาวน์โหลดไฟล์สำรองข้อมูลสินค้าทั้งหมด
  - 📤 **Import JSON**: นำไฟล์สำรองกลับมาใช้บนอุปกรณ์อื่น
  - 🔄 **Reset to Defaults**: คืนค่ากลับเป็นแอพตัวอย่างเริ่มต้น 6 รายการ

---

## 🚀 วิธีการรันบนเครื่องของคุณ (Local Development)

1. เปิด Terminal ในโฟลเดอร์นี้
2. ติดตั้ง Dependencies (ถ้ายังไม่ได้ติดตั้ง):
   ```bash
   npm install
   ```
3. เริ่มต้น Local Dev Server:
   ```bash
   npm run dev
   ```
4. เปิดเบราว์เซอร์ตามลิงก์ที่แสดง (เช่น `http://localhost:5173`)

---

## 🌐 วิธีนำขึ้น Vercel (Deployment Guide)

### วิธีที่ 1: ผ่าน GitHub (แนะนำ - อัปเดตอัตโนมัติ)
1. นำโฟลเดอร์นี้อัปโหลดขึ้น GitHub Repository ของคุณ:
   ```bash
   git init
   git add .
   git commit -m "feat: BA Store landing page and admin CMS"
   git branch -M main
   git remote add origin <URL_REPOSITORY_ของคุณ>
   git push -u origin main
   ```
2. เข้าไปที่ [vercel.com](https://vercel.com) แล้วเข้าสู่ระบบ
3. กด **"Add New..."** -> **"Project"**
4. เลือก Repository ที่เพิ่งอัปโหลด
5. Vercel จะตรวจจับเป็น **Vite** ให้อัตโนมัติ:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. กดปุ่ม **Deploy** แล้วรอประมาณ 30 วินาที เว็บไซต์ของคุณจะพร้อมใช้งานทันทีทั่วโลก!

### วิธีที่ 2: ผ่าน Vercel CLI (รวดเร็วโดยไม่ต้องใช้ Git)
1. ติดตั้ง Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. รันคำสั่ง deploy:
   ```bash
   vercel
   ```
3. ทำตามคำแนะนำบนหน้าจอ จากนั้นรัน `vercel --prod` เพื่อขึ้นเป็น Production Domain

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
workforsell/
├── index.html                  # HTML template พร้อม Google Fonts (Prompt & Mitr)
├── package.json                # Dependencies & Scripts
├── tailwind.config.js          # ปรับแต่งโทนสีพาสเทลและเงา
├── vite.config.js              # Vite config พร้อม Tailwind v4
├── vercel.json                 # Vercel SPA Routing Configuration
├── src/
│   ├── main.jsx                # จุดเริ่มต้นแอปพลิเคชัน
│   ├── index.css               # สไตล์หลักและชุดสีพาสเทล
│   ├── App.jsx                 # หน้าเว็บหลักและการเชื่อมต่อ State
│   ├── data/
│   │   └── initialData.js      # ข้อมูลสินค้าเริ่มต้น 6 รายการ และไอคอน SVG คมชัด
│   ├── utils/
│   │   └── storage.js          # จัดการ localStorage และการสำรองไฟล์ JSON
│   └── components/
│       ├── HeaderBanner.jsx    # แบนเนอร์ปก, โลโก้ซ้อนกึ่งกลาง, ข้อมูลร้าน, ปุ่มแชท
│       ├── CategoryFilter.jsx  # แท็บหมวดหมู่และช่องค้นหา Realtime
│       ├── ProductCard.jsx     # การ์ดแอพพรีเมียม (ดีไซน์ 2 คอลัมน์มือถือ พร้อม Hover effect)
│       ├── ProductGrid.jsx     # Responsive Grid (2 คอลัมน์มือถือ, 3-4 คอลัมน์เดสก์ท็อป)
│       ├── OrderModal.jsx      # หน้าต่างสอบถาม/สั่งซื้อ พร้อมปุ่มคัดลอกข้อความแชท
│       ├── AdminModal.jsx      # ศูนย์ควบคุมหลังบ้าน พร้อมระบบรหัส PIN
│       ├── AdminProductForm.jsx# ฟอร์มเพิ่ม/แก้ไขแอพ (อัปโหลดรูป, เลือกไอคอนพรีเซ็ต)
│       ├── AdminStoreSettings.jsx # ฟอร์มตั้งค่าโปรไฟล์ร้านค้าและช่องทางติดต่อ
│       ├── SocialIcons.jsx     # ไอคอน LINE และ Facebook SVG ของแท้
│       ├── Toast.jsx           # การแจ้งเตือน Pop-up สวยงาม
│       └── Footer.jsx          # จุดเด่นการันตีและเครดิตร้านค้า
```

# FinTrack — Mobile Expense Tracker (GitHub Pages + Firebase)

เว็บแอปบันทึกรายรับรายจ่ายสำหรับมือถือ สร้างด้วย HTML/CSS/JavaScript แบบไม่ต้องใช้ build tool และใช้ Firebase Authentication + Cloud Firestore เป็นแกนหลัก

## ฟีเจอร์ในชุดนี้

- Quick Add รายรับ/รายจ่าย
- หมวดหมู่หลัก/หมวดย่อย + ไอคอน + สี
- Custom Tags
- OCR สลิปแบบ client-side ด้วย Tesseract.js (ควรตรวจสอบข้อมูลก่อนบันทึก)
- Recurring Transactions แบบสร้างรายการเมื่อเปิดแอปในวันที่กำหนด
- Budget รายหมวด + เปอร์เซ็นต์เตือนใน UI
- Savings Goals + progress
- Dashboard, Pie Chart, Income vs Expense, Trend รายเดือน
- Export CSV / Excel / PDF
- Firebase Email/Password Auth
- Cloud Firestore และ Offline-first cache
- PIN Lock ฝั่ง browser
- PWA manifest + service worker scaffold
- Dark Mode ตาม system preference

## 1. สร้าง Firebase Project

1. เข้า Firebase Console
2. สร้าง Project ใหม่
3. Add web app เพื่อรับ Firebase Config
4. เปิด Authentication > Sign-in method > Email/Password
5. สร้าง Cloud Firestore Database
6. ไปที่ Firestore Rules และวาง `firestore.rules`

## 2. ใส่ Firebase Config

เปิด `app.js` และแทนค่า:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};
```

แล้วนำ config เดียวกันไปใส่ใน `firebase-messaging-sw.js`

> Firebase Web config ไม่ใช่ secret key แบบ server credential แต่ Firestore Rules ต้องตั้งถูกต้อง เพราะ config จะอยู่ใน browser

## 3. เปิดใช้งาน Cloud Firestore

โครงสร้างข้อมูลที่แอปใช้:

```text
users/{uid}/transactions/{id}
users/{uid}/categories/{id}
users/{uid}/tags/{id}
users/{uid}/budgets/{id}
users/{uid}/goals/{id}
users/{uid}/recurring/{id}
users/{uid}/settings/main
users/{uid}/devices/{id}
```

Rules จำกัดให้ผู้ใช้เข้าถึงข้อมูลของ UID ตัวเองเท่านั้น

## 4. Deploy ด้วย GitHub Pages

สร้าง repository เช่น `fintrack`

อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไปไว้ที่ root ของ repository แล้วไปที่:

`Settings > Pages > Deploy from a branch > main > /(root)`

GitHub Pages รองรับการโฮสต์ static HTML/CSS/JS โดยตรง และหน้าเว็บจะให้บริการผ่าน HTTPS ซึ่งจำเป็นต่อ Push Notifications บนเว็บ

## 5. ทดสอบ

เปิด URL GitHub Pages แล้ว:

1. สมัครสมาชิก
2. เพิ่มรายรับ/รายจ่าย
3. เปิด DevTools > Network/Console เพื่อตรวจ error ถ้ามี
4. ทดสอบปิดเน็ต แล้วสร้างรายการ จากนั้นเปิดเน็ตอีกครั้งเพื่อดูการ sync

## 6. OCR สลิป

รุ่นนี้ใช้ Tesseract.js ฝั่ง browser จึงไม่ต้องส่งรูปสลิปขึ้น server ภายนอกโดยตัวแอปเอง แต่ความแม่นยำของ OCR กับสลิปธนาคารต่างรูปแบบกันได้ จึงตั้งใจให้เป็น "ช่วยอ่าน" ไม่ใช่การบันทึกอัตโนมัติ 100%

## 7. Notifications / FCM

โค้ดมีโครง FCM ไว้แล้ว แต่ต้องตั้งค่า Web Push Certificate (VAPID key) ใน Firebase Cloud Messaging ก่อน จากนั้นใส่ public VAPID key ใน `app.js` ตรง `YOUR_PUBLIC_VAPID_KEY`

การแจ้งเตือนแบบ remote/persistent ต้องมีการส่ง message จาก FCM; การเตือนตามเวลาแบบ server-side ยังต้องเพิ่ม backend/scheduler เช่น Cloud Functions หรือระบบ cron

## 8. PIN Lock

PIN ในชุดนี้เป็น app lock ฝั่ง browser เพื่อกันการเปิดแอปบนเครื่องที่ใช้งานอยู่ ไม่ใช่การเข้ารหัสข้อมูลระดับฐานข้อมูล การป้องกันข้อมูลจริงยังขึ้นกับ Firebase Authentication + Firestore Security Rules

## 9. ข้อจำกัดของ GitHub Pages

GitHub Pages เป็น static hosting ดังนั้น:

- ไม่เหมาะกับการเก็บ Firebase Admin credentials
- ไม่สามารถรัน scheduled backend เองได้
- การแจ้งเตือนที่ต้องส่งตามเวลาอย่างน่าเชื่อถือควรใช้ Firebase Cloud Functions / Cloud Scheduler หรือบริการ backend แยก

## 10. การพัฒนาต่อที่แนะนำ

- เพิ่ม recurring แบบ atomic transaction เพื่อลดโอกาสสร้างรายการซ้ำเมื่อเปิดหลายอุปกรณ์พร้อมกัน
- เพิ่ม Firestore composite indexes ตาม query ที่เพิ่มในอนาคต
- เพิ่ม Storage สำหรับเก็บรูปสลิปแบบ opt-in
- เพิ่ม Google Sign-In
- เพิ่ม CSV import
- เพิ่ม recurring calendar
- เพิ่ม encryption สำหรับข้อมูลที่ต้องการปกป้องเพิ่มเติม
- เพิ่ม Web Push token management และ Cloud Functions สำหรับ scheduled notifications

# FinTrack V2 — PWA + Firebase + GitHub Pages

รุ่นนี้ต่อยอดจาก V1 โดยเพิ่ม Google Sign-In, หลายบัญชีเงิน, โอนเงิน, แนบรูปสลิปใน Firebase Storage, CSV import/export, ปฏิทิน, recurring, budgets/goals, backup JSON, theme, PIN lock และโครง FCM.

## 1) Firebase
1. Create project และ Register Web App
2. Authentication → Sign-in providers → เปิด Email/Password และ Google
3. Firestore Database → Create database
4. Storage → เปิด Cloud Storage
5. วาง `firestore.rules` และ `storage.rules`
6. คัดลอก Firebase web config ไปที่ `app.js` และ `firebase-messaging-sw.js`
7. Cloud Messaging → Web configuration → สร้าง Web Push certificate แล้วนำ public VAPID key ใส่ `YOUR_PUBLIC_VAPID_KEY` ใน `app.js`

## 2) GitHub Pages
สร้าง repo เช่น `fintrack` แล้วอัปโหลดทุกไฟล์จากโฟลเดอร์นี้ไว้ที่ root
Settings → Pages → Deploy from a branch → main → root

## 3) Authorized domains
Firebase Console → Authentication → Settings → Authorized domains
เพิ่มโดเมน GitHub Pages เช่น `YOURNAME.github.io`

## 4) Google Sign-In
เปิด Google provider และตรวจสอบ Authorized domains. Firebase รองรับ `signInWithPopup`/redirect สำหรับ Google Sign-In.

## 5) Offline-first
Firestore Web ใช้ persistent local cache และจะซิงก์ local writes เมื่อกลับออนไลน์. ผู้ใช้ควรใช้บนอุปกรณ์ที่เชื่อถือได้ เพราะ cache คงอยู่ระหว่าง session.

## 6) Cloud Storage
รูปสลิปจะถูกเก็บที่ `users/{uid}/receipts/...` และ Storage Rules จำกัดสิทธิ์ให้เจ้าของ UID เท่านั้น

## 7) สิ่งที่เป็น client-side
- OCR เป็น Tesseract.js ใน browser
- PIN lock เป็น localStorage/browser lock ไม่ใช่ database encryption
- recurring ในชุดนี้สร้างรายการเมื่อเปิดแอปตรงวันที่กำหนด
- FCM ต้องมี server-side sender (เช่น Cloud Functions/Cloud Run/ระบบ backend) สำหรับ scheduled push ที่เชื่อถือได้

## 8) หมายเหตุเรื่องฟรี
GitHub Pages เป็น static hosting ฟรี แต่การใช้ Firebase บางบริการมี quota/เงื่อนไขตามแพ็กเกจของ Firebase และการเปิดใช้บริการ backend บางชนิดอาจเปลี่ยนต้นทุนได้ ควรตรวจสอบหน้า Billing ของโปรเจกต์ก่อนใช้งานจริง

## 9) ไฟล์หลัก
- `index.html` UI
- `styles.css` responsive/mobile UI
- `app.js` logic + Firebase client SDK
- `sw.js` PWA offline shell
- `firebase-messaging-sw.js` FCM background handler
- `firestore.rules` security rules
- `storage.rules` receipt storage rules

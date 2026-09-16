/* FCM service worker scaffold. Replace the config below with the SAME Firebase config as app.js. */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDFW0RiRVL-nB3DR70luGAR-yA9C8Vhz-A",
  authDomain: "expense-tracking-796f2.firebaseapp.com",
  projectId: "expense-tracking-796f2",
  storageBucket: "expense-tracking-796f2.firebasestorage.app",
  messagingSenderId: "254010893537",
  appId: "1:254010893537:web:6c5a2296d733518e3d83a0",
  measurementId: "G-JF8M3XRCT3"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'FinTrack';
  const options = {
    body: payload.notification?.body || 'มีการแจ้งเตือนใหม่',
    icon: './icon-192.png'
  };
  self.registration.showNotification(title, options);
});

// URL de la aplicación web de Google Apps Script (termina en /exec).
window.API_URL = 'https://script.google.com/macros/s/AKfycbwOqYcUb10mp2CmQd1k8YTIvx1PS4iYhWaxzfskaUiqk_8JsZ2hIjo-hjID4IZGPenb/exec';

// Notificaciones push (Firebase, proyecto bloques-dc). Estos datos son públicos; la clave privada va solo en Apps Script (FCM_SA).
window.FIREBASE = {
  apiKey: 'AIzaSyD_8PXnPCC0OjCDhFoctMEdSzX5LpEsy3A',
  authDomain: 'bloques-dc.firebaseapp.com',
  projectId: 'bloques-dc',
  storageBucket: 'bloques-dc.firebasestorage.app',
  messagingSenderId: '400097462738',
  appId: '1:400097462738:web:c570f64fb66e455846a00b'
};
window.FIREBASE_VAPID = 'BItFTJFFSaH_sDUEAZe7VHSkmKV2KIVGaHQYOTWwsxlhZA2WIYfxmvEd2msqh62TQdoWqt70u8ovT5W1pEbI4SI';

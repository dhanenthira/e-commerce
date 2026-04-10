// ShopVerse Firebase Configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDCkKAIIiB3QR3kuSZY303_X6BLv7lsvAk",
  authDomain: "shoping-597b3.firebaseapp.com",
  projectId: "shoping-597b3",
  storageBucket: "shoping-597b3.firebasestorage.app",
  messagingSenderId: "973887079376",
  appId: "1:973887079376:web:137adb9495991b8a98efd5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const firebaseAuth = firebase.auth();
const firebaseDb = firebase.firestore();

// API Base URL - change for production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal 
  ? 'http://localhost:3000/api' 
  : '/api'; // In production, same domain

// Export for use in other modules
window.ShopVerse = {
  auth: firebaseAuth,
  db: firebaseDb,
  API_BASE_URL,
};

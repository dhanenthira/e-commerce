// ShopVerse Firebase Configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket:FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
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
  : 'https://e-commerce-66ls.onrender.com/api'; 

// Export for use in other modules
window.ShopVerse = {
  auth: firebaseAuth,
  db: firebaseDb,
  API_BASE_URL,
};

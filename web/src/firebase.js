import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgm8hVDmsyalJHsR4bjLyNX4-Tb_xb9WU",
  authDomain: "link-blood-bdaad.firebaseapp.com",
  databaseURL: "https://link-blood-bdaad-default-rtdb.firebaseio.com",
  projectId: "link-blood-bdaad",
  storageBucket: "link-blood-bdaad.firebasestorage.app",
  messagingSenderId: "279191894669",
  appId: "1:279191894669:web:49f3a2dc22d2a9a41d80c4" // Standard format for web appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

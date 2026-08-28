import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHCQKeRN9lqvv5hisKWEyfidFyoCIhTro",
  authDomain: "twoa-aef6e.firebaseapp.com",
  projectId: "twoa-aef6e",
  storageBucket: "twoa-aef6e.firebasestorage.app",
  messagingSenderId: "259465530304",
  appId: "1:259465530304:web:cb6a3c6a81b38ba9061625"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
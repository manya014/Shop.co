import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATubfHecgbAPBdKlFQFsSX7ff2AW6KJ60",
  authDomain: "inventra-147c1.firebaseapp.com",
  projectId: "inventra-147c1",
  storageBucket: "inventra-147c1.firebasestorage.app",
  messagingSenderId: "95537560281",
  appId: "1:95537560281:web:7f6f9c9cc6e21576c8dcc8",
  measurementId: "G-QDFSL8DFCN"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

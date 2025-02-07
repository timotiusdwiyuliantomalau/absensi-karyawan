// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcFErU_xCDGi4-pd5AnjIQEkH8zexRjZs",
  authDomain: "gg-suspension-e90e3.firebaseapp.com",
  projectId: "gg-suspension-e90e3",
  storageBucket: "gg-suspension-e90e3.firebasestorage.app",
  messagingSenderId: "947308116884",
  appId: "1:947308116884:web:bfadb85c13c4b222b6ad81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore=getFirestore(app);
export const auth = getAuth(app);
export const storage=getStorage(app);
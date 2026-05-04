// src/firebaseConfig.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD2Vfis3HmHL0zIek8OcRIBjXsB1RMpR8",
  authDomain: "hajproject-8ee0e.firebaseapp.com",
  projectId: "hajproject-8ee0e",
  storageBucket: "hajproject-8ee0e.firebasestorage.app",
  messagingSenderId: "842454656139",
  appId: "1:842454656139:web:58c59dd9b58bb9a45d208e",
  measurementId: "G-SM93KZFN0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;

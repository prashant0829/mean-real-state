// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-estate-pb.firebaseapp.com",
  projectId: "mern-estate-pb",
  storageBucket: "mern-estate-pb.appspot.com",
  messagingSenderId: "691602845979",
  appId: "1:691602845979:web:984580baa7ad9b232863be",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

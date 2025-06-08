
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEhdL6Y-SgwvPVKo5X69BgXLB6t5hZ28k",
  authDomain: "tinder-clone-b63c7.firebaseapp.com",
  projectId: "tinder-clone-b63c7",
  storageBucket: "tinder-clone-b63c7.firebasestorage.app",
  messagingSenderId: "384266278181",
  appId: "1:384266278181:web:98663d9a4f3af52a36b6cc",
  measurementId: "G-RYQZL5TDCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// const app = initializeApp(firebaseConfig);
// let auth;
// if (Platform.OS === 'web') {
//   auth = getAuth(app);
// } else {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });
// }

// export { auth };
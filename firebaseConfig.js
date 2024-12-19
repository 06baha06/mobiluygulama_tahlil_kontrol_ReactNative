// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF7JTEpoL4kuSy-gAILyJvUwdkVlUMmqA",
  authDomain: "mobil-da4f7.firebaseapp.com",
  projectId: "mobil-da4f7",
  storageBucket: "mobil-da4f7.firebasestorage.app",
  messagingSenderId: "359578576251",
  appId: "1:359578576251:web:2b05ec849f997c423b09de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app,{
  persistence : getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db= getFirestore(app);

export default app
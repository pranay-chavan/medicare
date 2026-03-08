import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVuoDHgdD6DfOtINDE6PmhbxZ4aC5-NSY",
  authDomain: "medicare-authn.firebaseapp.com",
  projectId: "medicare-authn",
  storageBucket: "medicare-authn.firebasestorage.app",
  messagingSenderId: "923177799359",
  appId: "1:923177799359:web:e6f3018b113fe6bea3400a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
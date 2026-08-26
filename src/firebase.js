import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUQP27nG-L_ZyDNuCaTtn1_HSdkfPx1PE",
  authDomain: "codevista-d48ee.firebaseapp.com",
  projectId: "codevista-d48ee",
  storageBucket: "codevista-d48ee.firebasestorage.app",
  messagingSenderId: "460327643573",
  appId: "1:460327643573:web:91e927d65acfd2161d91fc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
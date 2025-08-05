
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSkJLujI5LMXoWTDUCZzQJQxDGS1av76Y",
  authDomain: "eventmapper-e731b.firebaseapp.com",
  projectId: "eventmapper-e731b",
  storageBucket: "eventmapper-e731b.firebasestorage.app",
  messagingSenderId: "1020920595805",
  appId: "1:1020920595805:web:e0fe6918c3c3634b8394b4",
  measurementId: "G-NJF7F9Q9SR"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2F1RqAStnD1CIjcBGCT1WZaerQyHNo70",
  authDomain: "personal-finance-project-2afc0.firebaseapp.com",
  projectId: "personal-finance-project-2afc0",
  storageBucket: "personal-finance-project-2afc0.appspot.com",
  messagingSenderId: "727045895182",
  appId: "1:727045895182:web:cf8a83e4df025cfc4f385f",
  measurementId: "G-QNHGKSQV95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
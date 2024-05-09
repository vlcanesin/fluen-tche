// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRqYrd2yCIfB5_Elhyl_fuf77Tfh7Dn5Q",
  authDomain: "fluentche.firebaseapp.com",
  projectId: "fluentche",
  storageBucket: "fluentche.appspot.com",
  messagingSenderId: "268453471817",
  appId: "1:268453471817:web:0ab1491c4a9ab2ad174198"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration object from the Firebase Console
const firebaseConfig = {

  apiKey: "AIzaSyA4lf9lCeY6OHWQx1se81Ddg4tnZ_79_NM",

  authDomain: "seoscientist-837e6.firebaseapp.com",

  projectId: "seoscientist-837e6",

  storageBucket: "seoscientist-837e6.firebasestorage.app",

  messagingSenderId: "389381060291",

  appId: "1:389381060291:web:0ce61f4e6891feb5861476",

  measurementId: "G-5BFR9DVGNY"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  
import { getFirestore } from 'firebase/firestore';  

const firebaseConfig = {
    apiKey: "AIzaSyBflU4zuhiFkWw7p_Wt-xo8ZHQQCyYQAIs",
    authDomain: "modunus-ddcdd.firebaseapp.com",
    projectId: "modunus-ddcdd",
    storageBucket: "modunus-ddcdd.appspot.com",
    messagingSenderId: "685787050193",
    appId: "1:685787050193:web:c409a08e73dd282d5e15f0",
    measurementId: "G-CVQ408VS8X"
  };

const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default { firebaseApp };

export { auth, db };
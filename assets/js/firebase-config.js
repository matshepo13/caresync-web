import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig ={
  apiKey: "AIzaSyDHnyILPuE4844-tDYBbtAjn4l7tvPXXek",
  authDomain: "caresync-a013a.firebaseapp.com",
  projectId: "caresync-a013a",
  storageBucket: "caresync-a013a.appspot.com",
  messagingSenderId: "948454772859",
  appId: "1:948454772859:web:58f46b1a3833ca05b512de"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
export { firebaseConfig };


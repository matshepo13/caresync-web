// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHnyILPuE4844-tDYBbtAjn4l7tvPXXek",
  authDomain: "caresync-a013a.firebaseapp.com",
  projectId: "caresync-a013a",
  storageBucket: "caresync-a013a.appspot.com",
  messagingSenderId: "948454772859",
  appId: "1:948454772859:web:58f46b1a3833ca05b512de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.querySelector('.sign-up-container form');
  const signInForm = document.querySelector('.sign-in-container form');

  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signUpForm.querySelector('input[type="text"]').value;
    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up successfully
        const user = userCredential.user;
        alert('Sign up successful!');
        window.location.href = 'pages/mainpage.html';
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });

  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        alert('Sign in successful!');
        window.location.href = '../pages/mainpage.html';
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });
});

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC9YFzorUkq_mDK8PCo4IsboqeCZcNzQ4",
    authDomain: "igames-9d369.firebaseapp.com",
    projectId: "igames-9d369",
    storageBucket: "igames-9d369.appspot.com",
    messagingSenderId: "379168972193",
    appId: "1:379168972193:web:97a6c06c0858f9e8d63fe0",
    measurementId: "G-XBZFRW5GG0"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth();
auth.languageCode = 'en';

export function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)
    recaptchaVerifier.render()
    return signInWithPhoneNumber(auth, number, recaptchaVerifier)
}
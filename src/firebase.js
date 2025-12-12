import { getApps, initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFND2HqRU3b_8c5NlpYVy81qt9dmwApJY",
  authDomain: "communprintingapp-3cfac.firebaseapp.com",
  projectId: "communprintingapp-3cfac",
  storageBucket: "communprintingapp-3cfac.appspot.com",
  messagingSenderId: "82028869830",
  appId: "1:82028869830:web:7b9109d508039262f97fc7",
  measurementId: "G-141KX6DKC1"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence); // volitelné, ale doporučené

export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);

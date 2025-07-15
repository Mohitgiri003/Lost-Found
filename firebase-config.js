// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClDVIzId89gNREDgQBH50LnCuyq2U3t5g",
  authDomain: "lostfoundsystem-7024a.firebaseapp.com",
  projectId: "lostfoundsystem-7024a",
  storageBucket: "lostfoundsystem-7024a.firebasestorage.app",
  messagingSenderId: "708794436116",
  appId: "1:708794436116:web:a162d836075be9848bb501"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

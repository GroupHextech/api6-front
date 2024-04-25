import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyBFV4p_yL54NZRkTMMwssdZ2RHonCapL6o",
  authDomain: "hex-imagem.firebaseapp.com",
  projectId: "hex-imagem",
  storageBucket: "hex-imagem.appspot.com",
  messagingSenderId: "432828516534",
  appId: "1:432828516534:web:99cb5937d64ccce527fe17",
  measurementId: "G-Y5VP902DDG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestore } from "./firebaseConfig";
import { doc, getDoc, collection } from "firebase/firestore";

const API_URL = "http://127.0.0.1:5000"

export const redirectToAuthorizationPage = async () => {
    const clientId = 'SibU7G15S99n2T3TdjzZYmQL';
    const redirectUri = encodeURIComponent('localhost:5173/');
    const scope = 'profile'; // escopos necessários para sua aplicação
    const responseType = 'code';

    const authorizationUrl = `${API_URL}/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.open(authorizationUrl, '_self');
}

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
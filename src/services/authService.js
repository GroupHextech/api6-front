import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, firestore } from "./firebaseConfig";
import { doc, getDoc, collection } from "firebase/firestore";

export const handleGoogleLoginSuccess = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const uid = user.uid;

    // Verifica se já existe um documento do usuário no Firestore
    const userCollectionRef = collection(firestore, "users");
    const userRef = doc(userCollectionRef, uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return { user, userData }; // Retorna o usuário e todos os dados do usuário
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
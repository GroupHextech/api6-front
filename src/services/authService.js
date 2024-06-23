import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestore } from "./firebaseConfig";
import { doc, getDoc, collection } from "firebase/firestore";

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    const token = await user.getIdToken();

    const userCollectionRef = collection(firestore, "users");
    const userRef = doc(userCollectionRef, uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      return { user, userData: userSnapshot.data(), token };
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
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
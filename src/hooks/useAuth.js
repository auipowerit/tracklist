import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../config/firebase";

export function useAuth() {
  async function signup(email, password, firstname, lastname, username) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const newUser = userCredentials.user;

      const newUserData = {
        email,
        firstname,
        lastname,
        username,
        folllowing: [],
        followers: [],
        createdAt: new Date(),
      };

      const userRef = doc(db, "users", newUser.uid);
      await setDoc(userRef, newUserData);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function usernameAvailable(username) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);

      return snapshot.empty;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function searchByUsername(username) {
    try {
      const end = username.replace(/.$/, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 1),
      );

      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", ">=", username),
        where("username", "<", end),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      const users = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
    searchByUsername,
  };
}

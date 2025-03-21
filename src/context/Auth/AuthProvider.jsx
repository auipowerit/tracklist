import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);

  const {
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  } = useAuth();

  useEffect(() => {
    // Update global user on auth state change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setGlobalData(userDoc.data());
        }
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, []);

  const authDBMethods = {
    globalUser,
    globalData,
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  };

  return (
    // Provide useContext with authDBmethods
    <AuthContext.Provider value={authDBMethods}>
      {children}
    </AuthContext.Provider>
  );
}

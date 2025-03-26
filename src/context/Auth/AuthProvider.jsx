import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "./AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { auth, db } from "../../config/firebase";

export default function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const useAuthMethods = useAuth();

  useEffect(() => {
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

  const authMethods = {
    globalUser,
    globalData,
    isModalOpen,
    setIsModalOpen,
    ...useAuthMethods,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
}

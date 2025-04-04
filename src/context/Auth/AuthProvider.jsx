import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { auth, db } from "src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);

  const useAuthMethods = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);

      try {
        setGlobalUser(user);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setGlobalData(userDoc.data());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const authMethods = {
    isLoading,
    globalUser,
    globalData,
    ...useAuthMethods,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
}

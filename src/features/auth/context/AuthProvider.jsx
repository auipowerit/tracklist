import { useEffect, useState } from "react";
import { auth, db } from "src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "./AuthContext";
import { useAuth } from "../hooks/useAuth";

export default function AuthProvider({ children }) {
  const [loadingUser, setLoadingUser] = useState(true);
  const [globalUser, setGlobalUser] = useState(null);

  const useAuthMethods = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoadingUser(true);

      try {
        if (!user) {
          setGlobalUser(null);
          setLoadingUser(false);
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setGlobalUser({ uid: user.uid, ...userDoc.data() });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUser(false);
      }
    });

    return unsubscribe;
  }, []);

  const authMethods = {
    loadingUser,
    globalUser,
    ...useAuthMethods,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
}

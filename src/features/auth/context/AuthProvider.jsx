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

  function updateGlobalUserLikes(id, category) {
    // Filter globalUser
    const newLikes = globalUser?.likes.map((like) => {
      if (like.category === category) {
        // Remove ID if not found in content, add if found
        const newContent = like.content.includes(id)
          ? like.content.filter((id) => id !== id)
          : [...like.content, id];
        return { category: like.category, content: newContent };
      }

      // Category does not exist
      return like;
    });

    // Category does not already exist
    if (!newLikes.some((like) => like.category === category)) {
      newLikes.push({ category, content: [id] });
    }

    setGlobalUser({ ...globalUser, likes: newLikes });
  }

  const authMethods = {
    loadingUser,
    globalUser,
    updateGlobalUserLikes,
    ...useAuthMethods,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
}

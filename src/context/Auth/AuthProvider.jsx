import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { auth, db } from "src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [loadingUser, setLoadingUser] = useState(true);
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);

  const useAuthMethods = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoadingUser(true);

      try {
        setGlobalUser(user);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setGlobalData({ id: user.uid, ...userDoc.data() });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUser(false);
      }
    });

    return unsubscribe;
  }, []);

  function updateGlobalDataLikes(id, category) {
    // Filter globalData
    const newLikes = globalData?.likes.map((like) => {
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

    setGlobalData({ ...globalData, likes: newLikes });
  }

  const authMethods = {
    loadingUser,
    globalUser,
    globalData,
    updateGlobalDataLikes,
    ...useAuthMethods,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
}

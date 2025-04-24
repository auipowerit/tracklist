import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "src/config/firebase";
import { DEFAULT_PROFILE_IMG } from "src/data/const";

export function useAuth() {
  async function signup(email, password, displayname, username, profileUrl) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const newUser = userCredentials.user;

      const newUserData = {
        email,
        displayname,
        username,
        bio: "",
        profileUrl: profileUrl || DEFAULT_PROFILE_IMG,
        spotifyUrl: "",
        following: [],
        followers: [],
        lists: [],
        savedLists: [],
        likes: [],
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

  async function updateSpotifyInfo(userId, profileUrl, spotifyUrl) {
    try {
      if (!userId || !profileUrl || !spotifyUrl) return;

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { profileUrl: profileUrl });
      await updateDoc(userRef, { spotifyUrl: spotifyUrl });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) return null;

      const user = userDoc.data();
      return {
        uid: userRef.id,
        ...user,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserByUsername(username) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const userRef = snapshot.docs[0].ref;
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) return null;

      const user = userDoc.data();

      return {
        uid: userRef.id,
        ...user,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function searchByUsername(username, currentUserId) {
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
          uid: doc.id,
          ...doc.data(),
        };
      });

      const filteredUsers = users.filter((user) => user.uid !== currentUserId);

      return filteredUsers;
    } catch (error) {
      console.log(error);
    }
  }

  async function followUser(followerId, userId) {
    try {
      const usersRef = collection(db, "users");
      const currentUserRef = doc(usersRef, userId);
      const followedUserRef = doc(usersRef, followerId);

      if (currentUserRef.empty || followedUserRef.empty) return;

      await updateDoc(currentUserRef, {
        following: arrayUnion(followerId),
      });

      await updateDoc(followedUserRef, {
        followers: arrayUnion(userId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function unfollowUser(unfollowedId, userId) {
    try {
      const usersRef = collection(db, "users");
      const currentUserRef = doc(usersRef, userId);
      const unfollowedUserRef = doc(usersRef, unfollowedId);

      if (currentUserRef.empty || unfollowedUserRef.empty) return;

      await updateDoc(currentUserRef, {
        following: arrayRemove(unfollowedId),
      });

      await updateDoc(unfollowedUserRef, {
        followers: arrayRemove(userId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getFollowingById(userId) {
    try {
      const user = await getUserById(userId);
      if (!user) return;

      return user?.following;
    } catch (error) {
      console.log(error);
    }
  }

  async function getFollowersById(userId) {
    try {
      const user = await getUserById(userId);
      if (!user) return;

      return user?.followers;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserDetails(userId, displayname, bio) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { displayname, bio });
    } catch (error) {
      console.log(error);
    }
  }

  async function likeContent(contentId, category, userId) {
    try {
      if (!contentId || !category || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const likes = userDoc.data().likes;
      const likeObj = likes.find((like) => like.category === category);

      if (likeObj) {
        // If the category is already in the likes array, add the contentId to its array
        likeObj.content = likeObj.content || [];
        likeObj.content.push(contentId);
      } else {
        // If the category is not in the likes array, create a new object and add it to the array
        likes.push({ category, content: [contentId] });
      }

      await updateDoc(userRef, {
        likes,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function unlikeContent(contentId, userId) {
    try {
      if (!contentId || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const likes = userDoc.data().likes;
      const likeObj = likes.find((like) => like.content.includes(contentId));

      if (likeObj) {
        // If the contentId is in the likes array, remove it
        likeObj.content = likeObj.content.filter((id) => id !== contentId);

        // If the content array is empty, remove the like object
        if (likeObj.content.length === 0) {
          likes.splice(likes.indexOf(likeObj), 1);
        }
      }

      await updateDoc(userRef, {
        likes,
      });
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
    getUserByUsername,
    searchByUsername,

    getFollowingById,
    getFollowersById,
    followUser,
    unfollowUser,

    updateUserDetails,
    updateSpotifyInfo,

    likeContent,
    unlikeContent,
  };
}

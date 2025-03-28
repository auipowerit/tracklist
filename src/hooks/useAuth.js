import {
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
        lists: [],
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

  async function followUser(userId, followerId) {
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

  async function getFollowingById(userId) {
    try {
      const user = await getUserById(userId);
      if (!user) return;

      return user?.following;
    } catch (error) {
      console.log(error);
    }
  }

  async function createNewMediaList(listData, userId) {
    try {
      if (!listData || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const listExists = userDoc
        .data()
        .lists.find((list) => list.name === listData.title);

      if (listExists) return;

      await updateDoc(userRef, {
        lists: arrayUnion(listData),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function checkIfListExists(name, userId) {
    try {
      if (!name || !userId) return false;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return false;

      const existingList =
        userDoc.data().lists.find((list) => list.name === name) || null;

      return existingList !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function checkIfMediaExistsInList(name, mediaId, userId) {
    try {
      if (!mediaId || !name || !userId) return false;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return false;

      const existingList = userDoc
        .data()
        .lists.find((list) => list.name === name);

      return existingList.media.includes(mediaId);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function addMediaToList(mediaId, name, userId) {
    try {
      if (!mediaId || !name || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      if (
        !(await checkIfListExists(name, userId)) ||
        (await checkIfMediaExistsInList(name, mediaId, userId))
      ) {
        return;
      }

      // Create new merged list with existing media and new media
      const mergedList = userDoc.data().lists.map((list) => {
        return list.name === name
          ? {
              ...list,
              media: [...list.media, mediaId],
            }
          : list;
      });

      await updateDoc(userRef, {
        lists: mergedList,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserLists(userId) {
    try {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      return userDoc.data().lists;
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserListByTitle(name, userId) {
    try {
      if (!userId || !name) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const existingList = userDoc
        .data()
        .lists.find((list) => list.name === name);

      return existingList;
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
    followUser,
    getFollowingById,
    checkIfListExists,
    createNewMediaList,
    addMediaToList,
    getUserLists,
    getUserListByTitle,
  };
}

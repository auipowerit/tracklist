import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/config/firebase";

export function useList() {
  async function getListById(listId) {
    try {
      if (!listId) return;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) return null;

      return {
        id: listDoc.id,
        ...listDoc.data(),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function getListsByUserId(userId) {
    try {
      if (!userId) return;

      // Get the user document by userId
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || !userDoc.exists()) return;

      // Get the list references from the user's lists
      const lists = userDoc.data().lists.map((id) => doc(db, "lists", id));

      const listDocs = await Promise.all(
        lists.map((listRef) => getDoc(listRef)),
      );

      // Return the list documents as an array of objects
      return listDocs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getSavedListsByUserId(userId) {
    try {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const lists = userDoc.data().savedLists.map((id) => doc(db, "lists", id));
      const listDocs = await Promise.all(
        lists.map((listRef) => getDoc(listRef)),
      );

      return listDocs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function createNewList(listData, userId) {
    try {
      if (!listData || !userId) return;

      const list = {
        ...listData,
        userId: userId,
        saves: [],
        createdAt: new Date(),
      };

      const listRef = collection(db, "lists");
      const newList = await addDoc(listRef, list);

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || !userDoc.exists()) return;

      await updateDoc(userRef, {
        lists: arrayUnion(newList.id),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addToList(mediaId, category, listId) {
    try {
      if (!mediaId || !category || !listId) return false;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || listDoc.empty) return false;

      if (listDoc.data().media.some((media) => media.id === mediaId)) {
        return false;
      }

      await updateDoc(listRef, {
        media: arrayUnion({ id: mediaId, category: category }),
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function deleteList(listId) {
    try {
      if (!listId) return;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || !listDoc.exists()) return;

      // Get user document by userId from the list
      const userRef = doc(db, "users", listDoc.data().userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || !userDoc.exists()) return;

      // Remove the listId from the user's lists
      await updateDoc(userRef, {
        lists: userDoc.data().lists.filter((id) => id !== listId),
      });

      const usersRef = collection(db, "users");
      const usersDoc = await getDocs(usersRef);

      if (usersDoc.empty) return;

      // Remove the listId from all users' saved lists
      await Promise.all(
        usersDoc.docs.map(async (user) => {
          await unsaveList(listId, user.id);
        }),
      );

      // Delete the list document
      await deleteDoc(listRef);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveList(listId, userId) {
    try {
      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || !listDoc.exists()) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || !userDoc.exists()) return;

      // Check if list is already saved by the user
      if (listDoc.data().saves.includes(userId)) {
        await updateDoc(listRef, {
          saves: listDoc.data().saves.filter((id) => id !== userId),
        });
      } else {
        await updateDoc(listRef, {
          saves: arrayUnion(userId),
        });
      }

      // Check if user has already saved the list
      if (userDoc.data().savedLists.includes(listId)) {
        await updateDoc(userRef, {
          savedLists: userDoc.data().savedLists.filter((id) => id !== listId),
        });
      } else {
        await updateDoc(userRef, {
          savedLists: arrayUnion(listId),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function unsaveList(listId, userId) {
    try {
      if (!listId || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || !userDoc.exists()) return;

      await updateDoc(userRef, {
        savedLists: userDoc.data().savedLists.filter((id) => id !== listId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteListItem(itemId, listId) {
    try {
      if (!itemId || !listId) return;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || listDoc.empty) return;

      await updateDoc(listRef, {
        media: listDoc.data().media.filter((item) => item.id !== itemId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateListDetails(listId, details) {
    try {
      if (!listId || !details) return false;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || listDoc.empty) return false;

      const updatedList = {
        ...listDoc.data(),
        ...details,
        media: listDoc.data().media,
      };

      await updateDoc(listRef, updatedList);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async function reorderListItems(listId, newOrder) {
    try {
      if (!listId || !newOrder) return;

      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      if (!listRef || listDoc.empty) return;

      await updateDoc(listRef, {
        media: newOrder,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getListById,
    getListsByUserId,
    getSavedListsByUserId,

    createNewList,

    addToList,
    deleteList,
    deleteListItem,
    saveList,

    updateListDetails,
    reorderListItems,
  };
}

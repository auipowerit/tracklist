import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

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

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const lists = userDoc.data().lists.map((id) => doc(db, "lists", id));
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

      if (!userRef || userDoc.empty) return;

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

      const userRef = doc(db, "users", listDoc.data().userId);
      const userDoc = await getDoc(userRef);

      if (!listRef || listDoc.empty || !userRef || userDoc.empty) return;

      await updateDoc(userRef, {
        lists: userDoc.data().lists.filter((id) => id !== listId),
      });

      await deleteDoc(listRef);

      const usersRef = collection(db, "users");
      const usersDoc = await getDocs(usersRef);

      if (usersDoc.empty) return;

      usersDoc.forEach((doc) => {
        unsaveList(listId, doc.id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function saveList(listId, userId) {
    try {
      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!listRef || listDoc.empty || !userRef || userDoc.empty) return;

      await updateDoc(listRef, {
        saves: arrayUnion(userId),
      });

      if (userDoc.data().savedLists.includes(listId)) {
        unsaveList(listId, userId);
        return;
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
      const listRef = doc(db, "lists", listId);
      const listDoc = await getDoc(listRef);

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!listRef || listDoc.empty || !userRef || userDoc.empty) return;

      await updateDoc(listRef, {
        saves: listDoc.data().saves.filter((id) => id !== userId),
      });

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
    unsaveList,

    updateListDetails,
    reorderListItems,
  };
}

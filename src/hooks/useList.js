import { v4 as uuidv4 } from "uuid";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function useList() {
  async function getListById(listId, userId) {
    try {
      if (!userId || !listId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const existingList = userDoc
        .data()
        .lists.find((list) => list.id === listId);

      return existingList;
    } catch (error) {
      console.log(error);
    }
  }

  async function getListByTitle(name, userId) {
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

  async function getListsByUserId(userId) {
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

  async function createNewList(listData, userId) {
    try {
      if (!listData || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      const listExists = userDoc
        .data()
        .lists.find((list) => list.name === listData.title);

      if (listExists) return;

      listData = {
        id: uuidv4(),
        ...listData,
        createdAt: new Date(),
      };

      await updateDoc(userRef, {
        lists: arrayUnion(listData),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addToList(mediaId, category, name, userId) {
    try {
      if (!mediaId || !category || !name || !userId) return false;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return false;

      if (
        !(await checkIfListExists(name, userId)) ||
        (await checkIfMediaExistsInList(name, mediaId, userId))
      ) {
        return false;
      }

      const newMedia = {
        id: mediaId,
        category: category,
      };

      // Create new merged list with existing media and new media
      const mergedList = userDoc.data().lists.map((list) => {
        return list.name === name
          ? {
              ...list,
              media: [...list.media, newMedia],
            }
          : list;
      });

      await updateDoc(userRef, {
        lists: mergedList,
      });

      return true;
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

      return existingList.media.find((media) => media.id === mediaId);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function deleteList(listId, userId) {
    try {
      if (!listId || !userId) return;

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      await updateDoc(userRef, {
        lists: userDoc.data().lists.filter((list) => list.id !== listId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getListById,
    getListByTitle,
    getListsByUserId,
    checkIfListExists,
    createNewList,
    addToList,
    deleteList,
  };
}

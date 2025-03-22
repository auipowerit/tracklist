import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

export function useRating() {
  async function getRatings(musicId) {
    try {
      const ratingsRef = collection(db, "ratings");
      const q = query(ratingsRef, where("musicId", "==", musicId));
      const querySnapshot = await getDocs(q);

      return querySnapshot;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async function getUserRating(musicId, userId) {
    try {
      const ratingsRef = collection(db, "ratings");
      const q = query(
        ratingsRef,
        where("musicId", "==", musicId),
        where("userId", "==", userId),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty ? null : querySnapshot.docs[0].data().rating;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async function getAvgRating(musicId) {
    try {
      const musicRatings = await getRatings(musicId);
      if (!musicRatings.empty) {
        let totalRating = 0;
        musicRatings.docs.forEach((doc) => {
          totalRating += doc.data().rating;
        });

        return totalRating / musicRatings.docs.length;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function addRating(musicId, userId, value) {
    try {
      const currentRating = await getRatings(musicId);

      if (currentRating.empty) {
        const newRating = {
          musicId: musicId,
          userId,
          rating: value,
          createdAt: new Date(),
        };
        const ratingsRef = collection(db, "ratings");
        await addDoc(ratingsRef, newRating);

        return await getAvgRating(musicId);
      } else {
        await updateRating(currentRating.docs[0].id, value);
        return await getAvgRating(musicId);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateRating(ratingId, value) {
    try {
      const ratingRef = doc(db, "ratings", ratingId);
      await updateDoc(ratingRef, {
        rating: value,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return { addRating, getUserRating, getAvgRating };
}

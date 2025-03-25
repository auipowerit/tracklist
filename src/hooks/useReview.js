import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

export function useReview() {
  const { getUserById } = useAuthContext();
  const { getAlbumById } = useSpotifyContext();

  async function getReviews() {
    try {
      const reviewsRef = collection(db, "reviews");
      const reviewsDoc = await getDocs(reviewsRef);

      const reviews = await Promise.all(
        reviewsDoc.docs.map(async (doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            username: (await getUserById(doc.data().userId)).username,
            media: await getAlbumById(doc.data().mediaId),
          };
        }),
      );

      return reviews;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function addReview(reviewInfo) {
    try {
      if (!reviewInfo) return false;

      const review = { ...reviewInfo, createdAt: new Date() };
      const reviewRef = collection(db, "reviews");
      await addDoc(reviewRef, review);

      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  return {
    getReviews,
    addReview,
  };
}

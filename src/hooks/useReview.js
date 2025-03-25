import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

export function useReview() {
  const { getUserById } = useAuthContext();
  const { getAlbumById } = useSpotifyContext();

  async function getReviews(count) {
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

      const reviewDoc = await addDoc(reviewRef, review);
      return await getDoc(reviewDoc);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteReview(reviewId) {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) return;

      // Delete from Firestore
      await deleteDoc(reviewRef);

      // Get replied reviews
      const { replies = [], replyingTo } = reviewDoc.data();

      // For each reply, delete from Firestore
      if (replies.length > 0) {
        await Promise.all(replies.map(deleteReview));
      }

      // Remove self from parent review replies
      if (replyingTo && replyingTo !== "") {
        const parentRef = doc(db, "reviews", replyingTo);
        const parentDoc = await getDoc(parentRef);

        if (!parentDoc.exists()) return;

        await updateDoc(parentRef, {
          replies: arrayRemove(reviewId),
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function likeReview(reviewId, uid) {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (reviewDoc.exists()) {
        const likes = reviewDoc.data().likes;
        const dislikes = reviewDoc.data().dislikes;

        // User already liked review, remove like
        if (likes.includes(uid)) {
          await updateDoc(reviewRef, {
            likes: arrayRemove(uid),
          });
        } else {
          // User disliked review, remove dislike
          if (dislikes.includes(uid)) {
            await updateDoc(reviewRef, {
              dislikes: arrayRemove(uid),
            });
          }

          // Add user ID to likes array
          await updateDoc(reviewRef, {
            likes: arrayUnion(uid),
          });
        }

        return (await getDoc(reviewRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function dislikeReview(reviewId, uid) {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (reviewDoc.exists()) {
        const dislikes = reviewDoc.data().dislikes;
        const likes = reviewDoc.data().likes;

        // User already disliked review, remove dislike
        if (dislikes.includes(uid)) {
          await updateDoc(reviewRef, {
            dislikes: arrayRemove(uid),
          });
        } else {
          // User liked review, remove like
          if (likes.includes(uid)) {
            await updateDoc(reviewRef, {
              likes: arrayRemove(uid),
            });
          }

          // Add user ID to dislikes array
          await updateDoc(reviewRef, {
            dislikes: arrayUnion(uid),
          });
        }

        return (await getDoc(reviewRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    getReviews,
    addReview,
    deleteReview,
    likeReview,
    dislikeReview,
  };
}

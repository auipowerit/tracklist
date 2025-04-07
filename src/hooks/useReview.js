import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

export function useReview() {
  const { getUserById } = useAuthContext();
  const { getMediaById } = useSpotifyContext();

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
            media: await getMediaById(doc.data().mediaId, doc.data().category),
          };
        }),
      );

      return reviews;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function getPopularReviews() {
    try {
      const reviewsRef = collection(db, "reviews");

      const earliestDate = new Date();
      earliestDate.setDate(earliestDate.getDate() - 2);

      // Get the 20 most liked reviews from the last 2 days
      const q = query(
        reviewsRef,
        where("createdAt", ">", earliestDate),
        orderBy("likes", "desc"),
        orderBy("createdAt", "desc"),
        limit(20),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      const popularReviews = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            username: (await getUserById(doc.data().userId)).username,
            media: await getMediaById(doc.data().mediaId, doc.data().category),
          };
        }),
      );

      return popularReviews;
    } catch (error) {
      console.log(error);
    }
  }

  async function getReviewsByMediaId(mediaId) {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("mediaId", "==", mediaId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      const reviews = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const user = await getUserById(doc.data().userId);
          return {
            id: doc.id,
            ...doc.data(),
            username: user.username,
            profileUrl: user.profileUrl,
            media: await getMediaById(doc.data().mediaId, doc.data().category),
          };
        }),
      );

      return reviews;
    } catch (error) {
      console.log(error);
    }
  }

  async function getReviewsByUserId(userId) {
    try {
      if (!userId) return [];

      const reviewsRef = collection(db, "reviews");
      const q = query(
        reviewsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      const reviews = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const user = await getUserById(doc.data().userId);
          return {
            id: doc.id,
            ...doc.data(),
            username: user.username,
            profileUrl: user.profileUrl,
            media: await getMediaById(doc.data().mediaId, doc.data().category),
          };
        }),
      );

      return reviews;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function getReviewById(reviewId) {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (reviewDoc.exists()) {
        const user = await getUserById(reviewDoc.data().userId);
        return {
          id: reviewDoc.id,
          ...reviewDoc.data(),
          username: user.username,
          profileUrl: user.profileUrl,
          media: await getMediaById(
            reviewDoc.data().mediaId,
            reviewDoc.data().category,
          ),
        };
      }
    } catch (error) {
      console.error(error.message);
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

  async function deleteReviewComment(commentId, reviewId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) return;

      await deleteDoc(commentRef);

      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) return;

      await updateDoc(reviewRef, {
        comments: arrayRemove(commentId),
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getRatings(mediaId) {
    try {
      const ratingsRef = collection(db, "reviews");
      const q = query(ratingsRef, where("mediaId", "==", mediaId));
      const querySnapshot = await getDocs(q);

      return querySnapshot;
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getAvgRating(mediaId) {
    try {
      if (!mediaId) return;

      const mediaRatings = await getRatings(mediaId);

      if (!mediaRatings.empty) {
        let totalRating = 0.0;

        mediaRatings.docs.forEach((doc) => {
          totalRating += doc.data().rating;
        });

        const count = mediaRatings.docs.length;
        const avgRating = totalRating / count;

        return { avgRating, count };
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    getReviews,
    getPopularReviews,
    getReviewsByUserId,
    getReviewsByMediaId,
    getReviewById,
    addReview,
    deleteReview,
    deleteReviewComment,
    likeReview,
    dislikeReview,
    getRatings,
    getAvgRating,
  };
}

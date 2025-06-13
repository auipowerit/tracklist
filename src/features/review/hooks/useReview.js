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
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "src/config/firebase";
import { EARLIEST_REVIEW_DATE } from "src/data/const";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";

export function useReview() {
  const { getUserById } = useAuthContext();
  const { getMediaById } = useSpotifyContext();

  const getNewReviews = async () => {
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
  };

  const getPopularReviews = async () => {
    try {
      const reviewsRef = collection(db, "reviews");

      const earliestDate = new Date();
      earliestDate.setDate(earliestDate.getDate() - EARLIEST_REVIEW_DATE);

      // Get the 20 most liked reviews from the last X days
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

      return popularReviews;
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewById = async (reviewId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) return null;

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
    } catch (error) {
      console.error(error.message);
    }
  };

  const getReviewsByUserId = async (userId) => {
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
  };

  const getReviewsByMediaId = async (mediaId) => {
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
  };

  const getRatings = async (mediaId) => {
    try {
      const ratingsRef = collection(db, "reviews");
      const q = query(ratingsRef, where("mediaId", "==", mediaId));
      const querySnapshot = await getDocs(q);

      return querySnapshot;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAvgRating = async (mediaId) => {
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
  };

  const addReview = async (reviewInfo) => {
    try {
      if (!reviewInfo) return false;

      const review = { ...reviewInfo, createdAt: new Date() };
      const reviewRef = collection(db, "reviews");

      const reviewDoc = await addDoc(reviewRef, review);
      return await getDoc(reviewDoc);
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) return;

      // Delete from Firestore
      await deleteDoc(reviewRef);
    } catch (error) {
      console.error(error.message);
    }
  };

  const likeReview = async (reviewId, userId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (reviewDoc.exists()) {
        const likes = reviewDoc.data().likes;

        // User already liked review, remove like
        if (likes.includes(userId)) {
          await updateDoc(reviewRef, {
            likes: arrayRemove(userId),
          });
        } else {
          // Add user ID to likes array
          await updateDoc(reviewRef, {
            likes: arrayUnion(userId),
          });
        }

        return (await getDoc(reviewRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteReviewComment = async (commentId, reviewId) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) return;

      await deleteDoc(commentRef);

      // Get replied comments
      const { replies = [], replyingTo = "" } = commentDoc.data();

      // For each reply, delete from Firestore
      if (replies.length > 0) {
        await Promise.all(replies.map(deleteComment));
      }

      // Remove self from parent comment replies
      if (replyingTo && replyingTo !== "") {
        const parentRef = doc(db, "comments", replyingTo);
        const parentDoc = await getDoc(parentRef);

        if (!parentDoc.exists()) return;

        await updateDoc(parentRef, {
          replies: arrayRemove(commentId),
        });
      }

      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists()) return;

      await updateDoc(reviewRef, {
        comments: arrayRemove(commentId),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    getNewReviews,
    getPopularReviews,

    getReviewById,
    getReviewsByUserId,
    getReviewsByMediaId,

    getRatings,
    getAvgRating,

    addReview,
    deleteReview,
    likeReview,
    deleteReviewComment,
  };
}

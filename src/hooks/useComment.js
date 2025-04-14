import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthContext } from "../context/Auth/AuthContext";

export function useComment() {
  const { getUserById } = useAuthContext();

  async function getCommentById(commentId) {
    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);

    return commentDoc.data();
  }

  async function getReviewComments(reviewId) {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewDoc = await getDoc(reviewRef);

      if (!reviewDoc.exists() || reviewDoc.data().comments.length === 0) return;

      const comments = await Promise.all(
        reviewDoc.data().comments.map(async (doc) => {
          const comment = await getCommentById(doc);
          const user = await getUserById(comment?.userId);
          if (!comment || !user) return null;

          return {
            id: doc,
            ...comment,
            username: user.username,
            profileUrl: user.profileUrl,
          };
        }),
      );

      // Sort comments by date descending, returns empty array if none found
      const sortedComments = comments?.filter(Boolean).sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      return sortedComments || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function addComment(commentInfo, reviewId) {
    try {
      const comment = { ...commentInfo, reviewId, createdAt: new Date() };
      const commentRef = collection(db, "comments");

      const commentDoc = await addDoc(commentRef, comment);
      const newComment = await getDoc(commentDoc);

      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        comments: arrayUnion(newComment.id),
      });

      return await getDoc(commentDoc);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteComment(commentId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) return;

      // Delete from Firestore
      await deleteDoc(commentRef);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function likeComment(commentId, userId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const likes = commentDoc.data().likes;
        const dislikes = commentDoc.data().dislikes;

        // User already liked comment, remove like
        if (likes.includes(userId)) {
          await updateDoc(commentRef, {
            likes: arrayRemove(userId),
          });
        } else {
          // User disliked comment, remove dislike
          if (dislikes.includes(userId)) {
            await updateDoc(commentRef, {
              dislikes: arrayRemove(userId),
            });
          }

          // Add user ID to likes array
          await updateDoc(commentRef, {
            likes: arrayUnion(userId),
          });
        }

        return (await getDoc(commentRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function dislikeComment(commentId, userId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const dislikes = commentDoc.data().dislikes;
        const likes = commentDoc.data().likes;

        // User already disliked comment, remove dislike
        if (dislikes.includes(userId)) {
          await updateDoc(commentRef, {
            dislikes: arrayRemove(userId),
          });
        } else {
          // User liked comment, remove like
          if (likes.includes(userId)) {
            await updateDoc(commentRef, {
              likes: arrayRemove(userId),
            });
          }

          // Add user ID to dislikes array
          await updateDoc(commentRef, {
            dislikes: arrayUnion(userId),
          });
        }

        return (await getDoc(commentRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    getCommentById,
    getReviewComments,
    
    addComment,
    deleteComment,

    likeComment,
    dislikeComment,
  };
}

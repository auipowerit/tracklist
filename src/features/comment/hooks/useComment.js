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
import { db } from "src/config/firebase";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export function useComment() {
  const { getUserById } = useAuthContext();

  const getCommentById = async (commentId) => {
    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);

    return commentDoc.data();
  };

  const getReviewComments = async (reviewId) => {
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
  };

  const addComment = async (commentInfo, reviewId, replyId) => {
    try {
      const comment = { ...commentInfo, reviewId, createdAt: new Date() };
      const commentRef = collection(db, "comments");

      const commentDoc = await addDoc(commentRef, comment);
      const newComment = await getDoc(commentDoc);

      if (replyId && replyId !== "") {
        const parentRef = doc(db, "comments", replyId);
        await updateDoc(parentRef, {
          replies: arrayUnion(newComment.id),
        });
      }

      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        comments: arrayUnion(newComment.id),
      });

      return await getDoc(commentDoc);
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) return;

      // Delete from Firestore
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
    } catch (error) {
      console.error(error.message);
    }
  };

  const likeComment = async (commentId, userId) => {
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
  };

  const dislikeComment = async (commentId, userId) => {
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
  };

  return {
    getCommentById,
    getReviewComments,

    addComment,
    deleteComment,

    likeComment,
    dislikeComment,
  };
}

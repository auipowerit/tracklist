import { useRef } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import "./comment-input.scss";

export default function CommentInput({ review, setComments }) {
  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();
  const { addNotification } = useInboxContext();
  const { updateReviewState } = useReviewContext();

  const inputComment = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const content = inputComment.current?.value.trim();
    if (!content || !globalUser || !review) return;

    const commentInfo = {
      content,
      userId: globalUser.uid,
      likes: [],
      dislikes: [],
    };

    const newComment = await addComment(commentInfo, review.id);

    // Update comment state with new comment data
    setComments((prevData) => [
      {
        id: newComment.id,
        ...newComment.data(),
        username: globalUser?.username || "",
        profileUrl: globalUser?.profileUrl || "",
      },
      ...(prevData || []),
    ]);

    // Save new review for reference
    const newReview = {
      ...review,
      comments: [...review.comments, newComment.id],
    };

    // Update review state
    updateReviewState(review, newReview);

    // Send notification if not commenting on own review
    if (globalUser.uid !== review.userId) {
      await addNotification(
        review.userId,
        globalUser.uid,
        `${globalUser.username} commented on your review`,
        `${content.slice(0, 40)}`,
        review.id,
        "review",
      );
    }

    closeComment();
  }

  function closeComment() {
    inputComment.current.value = "";
  }

  if (!globalUser) {
    return;
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {globalUser && (
        <img src={globalUser.profileUrl} className="comment-form__profile" />
      )}

      <input
        ref={inputComment}
        placeholder="Add a comment..."
        className="comment-form__input"
      />

      <div className="comment-form__buttons">
        <button
          type="submit"
          className="comment-form__button comment-form__button--submit"
        >
          Post
        </button>

        <button
          type="button"
          onClick={closeComment}
          className="comment-form__button comment-form__button--cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

import { useRef } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import "./comment-input.scss";

export default function CommentInput({ review, setComments }) {
  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();
  const { updateReviewState } = useReviewContext();

  const inputComment = useRef(null);

  function closeComment() {
    inputComment.current.value = "";
  }

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

    closeComment();
  }

  if (!globalUser) {
    return;
  }

  return (
    <form className="comment-input-container" onSubmit={handleSubmit}>
      <input
        ref={inputComment}
        placeholder="Add a comment..."
        className="comment-input"
      />

      <div className="comment-input-buttons">
        <button type="submit">Post</button>

        <button type="button" onClick={closeComment}>
          Cancel
        </button>
      </div>
    </form>
  );
}

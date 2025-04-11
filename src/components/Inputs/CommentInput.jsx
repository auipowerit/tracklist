import { useRef } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useCommentContext } from "src/context/Comment/CommentContext";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function CommentInput({ review, setComments }) {
  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();
  const { updateReviewState } = useReviewContext();

  const inputComment = useRef(null);

  function closeComment() {
    inputComment.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

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
    <form className="`flex gap-1" onSubmit={handleSubmit}>
      <input
        ref={inputComment}
        placeholder="Add a comment..."
        className="w-full border-1 border-transparent border-b-gray-400 text-xl focus:border-b-1 focus:border-b-white focus:outline-none"
      />

      <div className="flex justify-end gap-1">
        <button
          type="submit"
          className="mt-1 rounded-full px-3 py-1 hover:bg-gray-700"
        >
          Post
        </button>

        <button
          type="button"
          onClick={closeComment}
          className="mt-1 rounded-full px-3 py-1 hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

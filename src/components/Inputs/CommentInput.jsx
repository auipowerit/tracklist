import { useRef } from "react";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCommentContext } from "../../context/Comment/CommentContext";

export default function CommentInput({ reviewId }) {
  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();

  const inputComment = useRef(null);

  function closeComment() {
    inputComment.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const content = inputComment.current?.value.trim();
    if (!content || !globalUser || !reviewId) return;

    const commentInfo = {
      content,
      userId: globalUser.uid,
      likes: [],
      dislikes: [],
    };

    await addComment(commentInfo, reviewId);
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

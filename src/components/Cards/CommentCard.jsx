import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCommentContext } from "../../context/Comment/CommentContext";
import { getTimeSince } from "../../utils/date";
import VoteButton from "../Buttons/VoteButton";

export default function CommentCard({ comment, reviewId }) {
  const { globalUser } = useAuthContext();
  const { likeComment, dislikeComment, deleteComment } = useCommentContext();

  async function handleDelete() {
    await deleteComment(comment.id, reviewId);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="cursor-pointer text-sm font-bold hover:text-gray-400">
            @{comment.username}
          </p>
          <p className="text-sm text-gray-400">
            {getTimeSince(comment.createdAt.toDate())}
          </p>
        </div>
        <p className="text-xl">{comment.content}</p>
      </div>
      <div className="flex items-center gap-2">
        <VoteButton content={comment} type="like" handleContent={likeComment} />
        <VoteButton
          content={comment}
          type="dislike"
          handleContent={dislikeComment}
        />
        {globalUser.uid === comment.userId && (
          <button
            className="rounded-full px-3 py-1 transition-colors duration-150 hover:bg-gray-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

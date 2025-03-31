import VoteButton from "../Buttons/VoteButton";
import { getTimeSince } from "../../utils/date";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";
import { useCommentContext } from "../../context/Comment/CommentContext";
import DeleteButton from "../Buttons/DeleteButton";

export default function CommentCard(props) {
  const { comment, review, comments, setComments } = props;

  const { globalUser } = useAuthContext();
  const { likeComment, dislikeComment, deleteCommentFromReview } =
    useCommentContext();
  const { updateReviewState } = useReviewContext();

  async function updateCommentState(comment, updatedComment) {
    Object.assign(comment, updatedComment);

    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  async function handleDelete() {
    await deleteCommentFromReview(comment.id, review.id);

    const updatedComments = comments.filter((c) => c.id !== comment.id);
    setComments(updatedComments);

    const updatedReview = { ...review, comments: updatedComments };
    updateReviewState(review, updatedReview);
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
        <VoteButton
          content={comment}
          type="like"
          handleContent={likeComment}
          updateContent={updateCommentState}
        />
        <VoteButton
          content={comment}
          type="dislike"
          handleContent={dislikeComment}
          updateContent={updateCommentState}
        />
        {globalUser.uid === comment.userId && (
          <DeleteButton type="comment" deleteContent={handleDelete} />
        )}
      </div>
    </div>
  );
}

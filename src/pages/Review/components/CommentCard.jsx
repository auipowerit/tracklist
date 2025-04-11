import { Link } from "react-router-dom";
import { getTimeSince } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useCommentContext } from "src/context/Comment/CommentContext";
import VoteButton from "src/components/Buttons/VoteButton";
import DeleteButton from "src/components/Buttons/DeleteButton";

export default function CommentCard(props) {
  const { comment, review, comments, setComments } = props;

  return (
    <div className="flex flex-col gap-2">
      <Header comment={comment} />

      <Buttons
        comment={comment}
        review={review}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}

function Header({ comment }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <UserInfo comment={comment} />
        <p className="text-sm text-gray-400">
          {getTimeSince(comment.createdAt.toDate())}
        </p>
      </div>
      <p className="text-xl">{comment.content}</p>
    </div>
  );
}

function UserInfo({ comment }) {
  return (
    <Link
      to={`/users/${comment.userId}`}
      className="flex cursor-pointer items-center gap-2 text-sm font-bold hover:text-gray-400"
    >
      <img src={comment.profileUrl} className="h-8 w-8 rounded-full" />
      <p>@{comment.username}</p>
    </Link>
  );
}

function Buttons({ comment, review, comments, setComments }) {
  const { globalUser } = useAuthContext();
  const { likeComment, dislikeComment } = useCommentContext();
  const { deleteReviewComment, updateReviewState } = useReviewContext();

  async function updateCommentState(comment, updatedComment) {
    Object.assign(comment, updatedComment);

    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  async function handleDelete() {
    await deleteReviewComment(comment.id, review.id);

    const updatedComments = comments.filter((c) => c.id !== comment.id);
    setComments(updatedComments);

    const updatedReview = { ...review, comments: updatedComments };
    updateReviewState(review, updatedReview);
  }

  return (
    <div className="flex items-center gap-1">
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
      {globalUser?.uid === comment.userId && (
        <DeleteButton type="comment" deleteContent={handleDelete} />
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { getTimeSince } from "src/utils/date";
import LikeButton from "src/features/shared/components/buttons/LikeButton";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import DeleteButton from "src/features/shared/components/buttons/DeleteButton";
import DislikeButton from "src/features/shared/components/buttons/DislikeButton";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import "./comment-card.scss";

export default function CommentCard(props) {
  const { comment, review, comments, setComments } = props;

  return (
    <div className="comment-card-container">
      <Body comment={comment} />

      <Buttons
        comment={comment}
        review={review}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}

function Body({ comment }) {
  return (
    <div className="comment-card">
      <div className="comment-user-container">
        <UserInfo comment={comment} />
        <p className="comment-date">
          {getTimeSince(comment.createdAt.toDate())}
        </p>
      </div>
      <p className="comment-content">{comment.content}</p>
    </div>
  );
}

function UserInfo({ comment }) {
  return (
    <Link to={`/users/${comment.username}`} className="comment-user-info">
      <img src={comment.profileUrl} />
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
    <div className="comment-btns">
      <LikeButton
        content={comment}
        handleContent={likeComment}
        updateContent={updateCommentState}
      />
      <DislikeButton
        content={comment}
        handleContent={dislikeComment}
        updateContent={updateCommentState}
      />
      {globalUser?.uid === comment.userId && (
        <DeleteButton type="comment" deleteContent={handleDelete} />
      )}
    </div>
  );
}

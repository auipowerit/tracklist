import { Link } from "react-router-dom";
import { getTimeSince } from "src/utils/date";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import VoteButton from "src/features/comment/components/buttons/VoteButton";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import DeleteButton from "src/features/shared/components/buttons/DeleteButton";
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
  const { addNotification } = useInboxContext();
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

  async function handleLike(commentId, userId, userVoted) {
    const updatedContent = await likeComment(commentId, userId);

    // Send notification if not author and not already liked
    if (comment.userId !== globalUser.uid && !userVoted) {
      await addNotification(
        review.userId,
        `${globalUser.username} liked your comment`,
        `${comment.content.slice(0, 20)}...`,
        review.id,
        "review",
      );
    }

    return updatedContent;
  }

  return (
    <div className="comment-buttons">
      <VoteButton
        content={comment}
        handleVote={handleLike}
        updateContent={updateCommentState}
        type="like"
      />
      <VoteButton
        content={comment}
        handleVote={dislikeComment}
        updateContent={updateCommentState}
        type="dislike"
      />
      {globalUser?.uid === comment.userId && (
        <DeleteButton type="comment" deleteContent={handleDelete} />
      )}
    </div>
  );
}

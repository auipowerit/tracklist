import { Link } from "react-router-dom";
import { getTimeSince } from "src/utils/date";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
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
    <div className="comment-card">
      <Header comment={comment} />
      <Content comment={comment} />
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
    <div className="comment-card__header">
      <UserInfo comment={comment} />
      <p className="comment-card__date">
        {getTimeSince(comment.createdAt.toDate())}
      </p>
    </div>
  );
}

function UserInfo({ comment }) {
  return (
    <Link to={`/users/${comment.username}`} className="comment-card__user">
      <img
        src={comment.profileUrl}
        className="comment-card__profile"
        alt="comment user profile"
      />
      <p className="comment-card__username">@{comment.username}</p>
    </Link>
  );
}

function Content({ comment }) {
  return <p className="comment-card__content">{comment.content}</p>;
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
    const updatedComment = await likeComment(commentId, userId);

    const content =
      comment.content.length > 40
        ? `${comment.content.slice(0, 40)}...`
        : comment.content;

    // Send notification if not author and not already liked
    if (comment.userId !== globalUser.uid && !userVoted) {
      await addNotification(
        comment.userId,
        globalUser.uid,
        `${globalUser.username} liked your comment`,
        `${content}`,
        review.id,
        review.media.image || review.media.images?.[0].url || DEFAULT_MEDIA_IMG,
        "review",
      );
    }

    return updatedComment;
  }

  return (
    <div className="comment-card__buttons">
      <VoteButton
        comment={comment}
        updateComment={updateCommentState}
        handleVote={handleLike}
        type="like"
      />
      <VoteButton
        comment={comment}
        updateComment={updateCommentState}
        handleVote={dislikeComment}
        type="dislike"
      />

      {globalUser?.uid === comment.userId && (
        <DeleteButton type="comment" deleteContent={handleDelete} />
      )}
    </div>
  );
}

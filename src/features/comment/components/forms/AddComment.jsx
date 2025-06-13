import { useRef } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import "./add-comment.scss";

export default function AddComment(props) {
  const { review, setComments, comment, setIsReplying } = props;

  const commentRef = useRef(null);

  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();
  const { addNotification } = useInboxContext();
  const { updateReviewState } = useReviewContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = commentRef.current?.value.trim();
    if (!content || !globalUser || !review) return;

    closeComment();

    await submitToDatabase(content);
  };

  const closeComment = () => {
    commentRef.current.value = "";

    if (setIsReplying) {
      setIsReplying(false);
    }
  };

  const submitToDatabase = async (content) => {
    const repliedToCommentId = comment?.id || "";
    const commentInfo = {
      content,
      userId: globalUser.uid,
      likes: [],
      dislikes: [],
      replyingTo: repliedToCommentId,
      replies: [],
    };

    const newComment = await addComment(
      commentInfo,
      review.id,
      repliedToCommentId,
    );
    updateCommentState(newComment);

    await sendReplyNotification(newComment);
    await sendReviewNotification(newComment);
  };

  const updateCommentState = (newComment) => {
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
  };

  const sendReplyNotification = async (newComment) => {
    // If replying to a comment
    if (comment) {
      // Update the parent comment with the new reply
      comment.replies.push(newComment.id);

      // Send notification if not replying to own comment
      if (comment.userId !== globalUser.uid) {
        await addNotification(
          comment.userId,
          globalUser.uid,
          `${globalUser.username} replied to your comment:`,
          content.length > 40 ? `${content.slice(0, 40)}...` : `${content}`,
          review.id,
          review.media.image ||
            review.media.images?.[0].url ||
            DEFAULT_MEDIA_IMG,
          "reply",
        );
      }

      return;
    }
  };

  const sendReviewNotification = async (newComment) => {
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
        `${globalUser.username} commented on your review:`,
        content.length > 40 ? `${content.slice(0, 40)}...` : `${content}`,
        review.id,
        review.media.image || review.media.images?.[0].url || DEFAULT_MEDIA_IMG,
        "review",
      );
    }
  };

  if (!globalUser) {
    return;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`comment-form ${comment ? "comment-form--reply" : ""}`}
    >
      <div className="comment-form__input-container">
        {globalUser && (
          <img src={globalUser.profileUrl} className="comment-form__profile" />
        )}

        <input
          ref={commentRef}
          placeholder={`${comment ? "Add a reply..." : "Add a comment..."}`}
          className="comment-form__input"
        />
      </div>
      <div className="comment-form__buttons">
        <Button
          type="submit"
          classes="comment-form__button comment-form__button--submit"
          ariaLabel="post comment"
        >
          Post
        </Button>

        <Button
          onClick={closeComment}
          classes="comment-form__button comment-form__button--cancel"
          ariaLabel="cancel comment"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

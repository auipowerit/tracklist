import { useRef } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import "./comment-form.scss";

export default function CommentForm({
  review,
  setComments,
  comment,
  setIsReplying,
}) {
  const { globalUser } = useAuthContext();
  const { addComment } = useCommentContext();
  const { addNotification } = useInboxContext();
  const { updateReviewState } = useReviewContext();

  const commentRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const content = commentRef.current?.value.trim();
    if (!content || !globalUser || !review) return;

    closeComment();

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
  }

  function closeComment() {
    commentRef.current.value = "";

    if (setIsReplying) {
      setIsReplying(false);
    }
  }

  if (!globalUser) {
    return;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`comment-form ${comment ? "comment-form--reply" : ""}`}
    >
      {globalUser && (
        <img
          src={globalUser.profileUrl}
          className="comment-form__profile"
          alt="current user profile"
        />
      )}

      <input
        ref={commentRef}
        placeholder={`${comment ? "Add a reply..." : "Add a comment..."}`}
        className="comment-form__input"
      />

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

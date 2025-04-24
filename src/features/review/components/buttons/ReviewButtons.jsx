import { useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import LikeButton from "src/features/shared/components/buttons/LikeButton";
import ShareButton from "src/features/shared/components/buttons/ShareButton";
import DeleteButton from "src/features/shared/components/buttons/DeleteButton";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import DislikeButton from "src/features/shared/components/buttons/DislikeButton";
import CommentButton from "src/features/comment/components/buttons/CommentButton";
import { useReviewContext } from "../../context/ReviewContext";
import "./review-buttons.scss";

export default function ReviewButtons({ review, showComment = true }) {
  const { globalUser, updateGlobalUserLikes, likeContent, unlikeContent } =
    useAuthContext();
  const { deleteComment } = useCommentContext();
  const {
    updateReviewState,
    likeReview,
    dislikeReview,
    setReviews,
    getNewReviews,
    deleteReview,
  } = useReviewContext();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  async function handleLike(reviewId, userId) {
    if (!globalUser) return;

    if (
      globalUser.likes
        .filter((like) => like.category === "review")
        .flatMap((like) => like.content)
        .includes(reviewId)
    ) {
      await unlikeContent(reviewId, userId);
    } else {
      await likeContent(reviewId, "review", userId);
    }

    updateGlobalUserLikes(reviewId, "review");

    return await likeReview(reviewId, userId);
  }

  async function handleDislike(reviewId, userId) {
    if (!globalUser) return;

    if (globalUser.likes.find((like) => like.contentId === reviewId)) {
      await unlikeContent(reviewId, userId);
    }

    return await dislikeReview(reviewId, userId);
  }

  async function handleDelete() {
    const comments = review.comments;

    if (!review.id) return;

    // Delete each comment from comments db
    if (comments.length > 0) {
      await Promise.all(
        comments.map(async (comment) => {
          await deleteComment(comment);
        }),
      );
    }

    // Delete review
    await deleteReview(review.id);

    // Fetch updated review from Firestore
    const reviewData = await getNewReviews();

    // Filter out any reviews from useState not found in Firestore state
    setReviews((prevReviews) =>
      prevReviews.filter((r) =>
        reviewData.some((review) => review.id === r.id),
      ),
    );

    window.location.reload();
  }

  return (
    <div className="review-btns">
      <LikeButton
        content={review}
        handleContent={handleLike}
        updateContent={updateReviewState}
      />
      <DislikeButton
        content={review}
        handleContent={handleDislike}
        updateContent={updateReviewState}
      />

      {showComment ? (
        <CommentButton review={review} />
      ) : (
        <ShareButton
          isModalOpen={isShareModalOpen}
          setIsModalOpen={setIsShareModalOpen}
          mediaId={review.id}
          category="review"
        />
      )}

      {globalUser && globalUser.uid === review.userId && (
        <DeleteButton type="review" deleteContent={handleDelete} />
      )}
    </div>
  );
}

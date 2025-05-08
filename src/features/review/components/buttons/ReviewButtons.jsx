import { useEffect, useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ShareButton from "src/features/shared/components/buttons/ShareButton";
import HeartButton from "src/features/shared/components/buttons/HeartButton";
import DeleteButton from "src/features/shared/components/buttons/DeleteButton";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import CommentButton from "src/features/comment/components/buttons/CommentButton";
import { useReviewContext } from "../../context/ReviewContext";
import "./review-buttons.scss";

export default function ReviewButtons({ review, showComment = true }) {
  const { globalUser } = useAuthContext();
  const { deleteComment } = useCommentContext();
  const { setReviews, getNewReviews, deleteReview } = useReviewContext();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      globalUser?.likes
        .filter((like) => like.category === "review")
        .flatMap((like) => like.content)
        .includes(review.id),
    );
  }, []);

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
    <div className="review-buttons">
      <HeartButton
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        id={review.id}
        review={review}
        category={"review"}
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

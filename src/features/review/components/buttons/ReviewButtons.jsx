import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ShareButton from "src/features/shared/components/buttons/ShareButton";
import HeartButton from "src/features/shared/components/buttons/HeartButton";
import DeleteButton from "src/features/shared/components/buttons/DeleteButton";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import CommentButton from "src/features/comment/components/buttons/CommentButton";
import { useReviewContext } from "../../context/ReviewContext";
import "./review-buttons.scss";

export default function ReviewButtons({ review, showComment = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { globalUser, getUserLikes } = useAuthContext();
  const { deleteComment } = useCommentContext();
  const { setReviews, getNewReviews, deleteReview } = useReviewContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }

    const checkIfLiked = async () => {
      if (!globalUser) return;

      const userLikes = await getUserLikes(globalUser.uid);
      if (!userLikes) return;

      setIsLiked(userLikes["review"].includes(review.id));
    };

    return () => {
      checkIfLiked();
      setIsLiked(false);
    };
  }, [isModalOpen]);

  const handleDelete = async () => {
    if (!review || !review?.id) return;

    const comments = review.comments;

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

    navigate("/home");
  };

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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
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

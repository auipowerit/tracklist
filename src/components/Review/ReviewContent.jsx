import { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { getTimeSince } from "src/utils/date";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useCommentContext } from "src/context/Comment/CommentContext";
import {
  faComment,
  faCompactDisc,
  faMicrophoneLines,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import LikeButton from "../Buttons/LikeButton";
import ShareButton from "../Buttons/ShareButton";
import DeleteButton from "../Buttons/DeleteButton";
import DislikeButton from "../Buttons/DislikeButton";
import "src/styles/components/review.scss";

function ReviewUser({ review, showIcon = true }) {
  return (
    <div className="review-user-container">
      <div className="review-user">
        {showIcon && <img src={review.profileUrl} />}
        <p>{review.username}</p>
      </div>
      <p className="review-user-date">
        {getTimeSince(review.createdAt.toDate())}
      </p>
    </div>
  );
}

function ReviewMediaTitle({ title, subtitle, category }) {
  const icon =
    category === "track"
      ? faMusic
      : category === "album"
        ? faCompactDisc
        : faMicrophoneLines;

  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  return (
    <div className="review-media-container">
      <div className="review-title-container">
        <div
          data-tooltip-content={capitalizeFirstLetter(category)}
          data-tooltip-id="category-tooltip"
        >
          <FontAwesomeIcon icon={icon} className="review-icon" />
          <Tooltip
            id="category-tooltip"
            place="top"
            type="dark"
            effect="float"
          />
        </div>
        <p className="review-title">{title}</p>
      </div>

      <p className="review-subtitle">{subtitle}</p>
    </div>
  );
}

function ReviewStars({ rating = 0, size = 20 }) {
  rating = Math.round(rating * 2) / 2;

  function getStarColor(ratingValue) {
    return ratingValue <= rating ? "#ffc107" : "#94969c";
  }

  return (
    <div className="review-stars">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = rating === ratingValue - 0.5;

        return (
          <span key={i}>
            {isHalf ? (
              <FaStarHalfAlt size={size} color="#ffc107" />
            ) : (
              <FaStar size={size} color={getStarColor(ratingValue)} />
            )}
          </span>
        );
      })}
    </div>
  );
}

function ReviewContent({ review }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="review-content-container">
      <p className="review-content">
        {review.content.length > 150
          ? showMore
            ? review.content
            : `${review.content.slice(0, 150)}...`
          : review.content}
      </p>
      {review.content.length > 150 && (
        <p
          className="review-content-toggle"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show less" : "Show more"}
        </p>
      )}
    </div>
  );
}

function ReviewButtons({ review, showComment = true }) {
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
        <Link to={`/reviews/${review.id}`} className="review-comment-btn">
          <FontAwesomeIcon icon={faComment} />
          <p>{review?.comments.length || 0}</p>
        </Link>
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

export {
  ReviewUser,
  ReviewMediaTitle,
  ReviewStars,
  ReviewContent,
  ReviewButtons,
};

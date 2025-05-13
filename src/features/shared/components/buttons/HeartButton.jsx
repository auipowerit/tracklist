import { useState } from "react";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import "./shared-buttons.scss";

export default function HeartButton(props) {
  const { isLiked, setIsLiked, id, review, category } = props;

  const { globalUser, likeContent, unlikeContent, updateGlobalUserLikes } =
    useAuthContext();
  const { addNotification } = useInboxContext();
  const { likeReview } = useReviewContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(review?.likes?.length || 0);

  async function handleClick() {
    if (!globalUser) return;

    setIsLoading(true);

    if (!isLiked) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    setIsLiked(!isLiked);
    setCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    review && (await handleReview(review, globalUser.uid));

    isLiked
      ? await unlikeContent(id, globalUser.uid)
      : await likeContent(id, category, globalUser.uid);

    updateGlobalUserLikes(id, category);

    setIsLoading(false);
  }

  async function handleReview(review, userId) {
    await likeReview(review.id, userId);

    // Send notification if not author and not already liked
    if (review.userId !== globalUser.uid && !isLiked) {
      await addNotification(
        review.userId,
        globalUser.uid,
        `${globalUser.username} liked your review`,
        "",
        review.id,
        review.media.image || review.media.images?.[0].url || DEFAULT_MEDIA_IMG,
        "review",
      );
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`heart-button ${isLiked && "heart-button--active"} ${isLoading && "heart-button--disabled"}`}
    >
      <FontAwesomeIcon icon={faHeart} className={isActive ? "fa-beat" : ""} />
      {review && <p>{count}</p>}
    </button>
  );
}

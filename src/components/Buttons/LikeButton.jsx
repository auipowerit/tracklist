import { useState } from "react";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function LikeButton({ review }) {
  const { globalUser } = useAuthContext();
  const { likeReview, updateReviewState } = useReviewContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser ? review.likes.includes(globalUser.uid) : false;

  async function handleClick() {
    if (!globalUser) return;

    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedReview = await likeReview(review.id, globalUser.uid);
    updateReviewState(review, updatedReview);
  }

  return (
    <button
      onClick={handleClick}
      className={`text-md flex w-12 items-center gap-1 font-light transition-colors duration-150 ${userVoted ? "text-green-500" : "hover:text-green-500"}`}
    >
      <FontAwesomeIcon icon={faThumbsUp} className={isActive && "fa-beat"} />
      <p>{review.likes.length}</p>
    </button>
  );
}

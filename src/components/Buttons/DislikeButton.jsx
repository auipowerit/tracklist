import { useState } from "react";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function DislikeButton({ review }) {
  const { globalUser } = useAuthContext();
  const { dislikeReview, updateReviewState } = useReviewContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser
    ? review.dislikes.includes(globalUser.uid)
    : false;

  async function handleClick() {
    if (!globalUser) return;

    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedReview = await dislikeReview(review.id, globalUser.uid);
    updateReviewState(review, updatedReview);
  }

  return (
    <button
      onClick={handleClick}
      className={`text-md flex w-12 items-center gap-1 font-light transition-colors duration-150 ${userVoted ? "text-red-400" : "hover:text-red-400"}`}
    >
      <FontAwesomeIcon icon={faThumbsDown} className={isActive && "fa-beat"} />
      <p>{review.dislikes.length}</p>
    </button>
  );
}

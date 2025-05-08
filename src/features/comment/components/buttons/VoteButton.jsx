import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "./comment-button.scss";

export default function VoteButton(props) {
  const { comment, handleVote, updateComment, type } = props;
  const { globalUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const count =
    type === "like" ? comment.likes.length : comment.dislikes.length || 0;

  const userVoted = globalUser
    ? type === "like"
      ? comment?.likes.includes(globalUser.uid)
      : comment?.dislikes.includes(globalUser.uid)
    : false;

  async function handleClick() {
    if (!globalUser) return;

    setIsLoading(true);

    // Animate if not removing vote
    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedComment = await handleVote(
      comment.id,
      globalUser.uid,
      userVoted,
    );
    updateComment(comment, updatedComment);

    setIsLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      className={`vote-button vote-button--${type} ${userVoted && `vote-button--${type}--active`} ${isLoading && `vote-button--loading`}`}
    >
      <FontAwesomeIcon
        icon={type === "like" ? faThumbsUp : faThumbsDown}
        className={isActive ? "fa-beat" : ""}
      />
      <p>{count}</p>
    </button>
  );
}

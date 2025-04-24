import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "./comment-button.scss";

export default function VoteButton(props) {
  const { content, handleVote, updateContent, type } = props;
  const { globalUser } = useAuthContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser
    ? type === "like"
      ? content?.likes.includes(globalUser.uid)
      : content?.dislikes.includes(globalUser.uid)
    : false;

  async function handleClick() {
    if (!globalUser) return;

    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedContent = await handleVote(content.id, globalUser.uid);
    updateContent(content, updatedContent);
  }

  return (
    <button
      onClick={handleClick}
      className={`${type}-btn ${userVoted && "active"}`}
    >
      <FontAwesomeIcon
        icon={type === "like" ? faThumbsUp : faThumbsDown}
        className={isActive && "fa-beat"}
      />
      <p>
        {type === "like" ? content?.likes.length : content?.dislikes.length}
      </p>
    </button>
  );
}

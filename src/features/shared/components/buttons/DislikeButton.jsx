import { useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shared-buttons.scss";

export default function DislikeButton(props) {
  const { content, handleContent, updateContent } = props;
  const { globalUser } = useAuthContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser
    ? content?.dislikes.includes(globalUser.uid)
    : false;

  async function handleClick() {
    if (!globalUser) return;

    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedContent = await handleContent(content.id, globalUser.uid);
    updateContent(content, updatedContent);
  }

  return (
    <button
      onClick={handleClick}
      className={`dislike-btn ${userVoted && "active"}`}
    >
      <FontAwesomeIcon icon={faThumbsDown} className={isActive && "fa-beat"} />
      <p>{content?.dislikes.length}</p>
    </button>
  );
}

import { useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "src/styles/components/buttons.scss";

export default function LikeButton(props) {
  const { content, handleContent, updateContent } = props;
  const { globalUser } = useAuthContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser
    ? content?.likes.includes(globalUser.uid)
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
      className={`like-btn ${userVoted && "active"}`}
    >
      <FontAwesomeIcon icon={faThumbsUp} className={isActive && "fa-beat"} />
      <p>{content?.likes.length}</p>
    </button>
  );
}

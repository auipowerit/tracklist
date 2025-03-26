import { useState } from "react";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function VoteButton(props) {
  const { content, type, handleContent, updateContent } = props;
  const { globalUser } = useAuthContext();

  const [isActive, setIsActive] = useState(false);

  const userVoted = globalUser
    ? type === "like"
      ? content?.likes.includes(globalUser.uid)
      : content?.dislikes.includes(globalUser.uid)
    : false;

  const color = type === "like" ? "text-green-500" : "text-red-400";

  const icon = type === "like" ? faThumbsUp : faThumbsDown;

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
      className={`text-md flex w-12 items-center gap-1 font-light transition-colors duration-150 ${userVoted ? color : `hover:${color}`}`}
    >
      <FontAwesomeIcon icon={icon} className={isActive && "fa-beat"} />
      <p>
        {type === "like" ? content?.likes.length : content?.dislikes.length}
      </p>
    </button>
  );
}

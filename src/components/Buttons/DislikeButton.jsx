import { useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      className={`text-md flex w-12 items-center gap-1 font-light transition-colors duration-150 ${userVoted ? "text-red-500" : "hover:text-red-500"}`}
    >
      <FontAwesomeIcon icon={faThumbsDown} className={isActive && "fa-beat"} />
      <p>{content?.dislikes.length}</p>
    </button>
  );
}

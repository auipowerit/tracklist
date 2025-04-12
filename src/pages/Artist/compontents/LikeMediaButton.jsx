import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LikeMediaButton(props) {
  const { isLiked, setIsLiked, id, category } = props;

  const { globalUser } = useAuthContext();
  const { likeContent, unlikeContent, updateGlobalUserLikes } =
    useAuthContext();

  const [isActive, setIsActive] = useState(false);

  async function handleLike() {
    if (!globalUser) return;

    if (!isLiked) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    isLiked
      ? await unlikeContent(id, globalUser.uid)
      : await likeContent(id, category, globalUser.uid);

    updateGlobalUserLikes(id, category);
    setIsLiked(!isLiked);
  }

  return (
    <button
      onClick={handleLike}
      className={`cursor-pointer transition-all duration-300 ${isLiked ? "text-green-500" : "hover:text-gray-400"}`}
      data-tooltip-id="like-tooltip"
      data-tooltip-content={isLiked ? "Unlike" : "Like"}
    >
      <FontAwesomeIcon icon={faHeart} className={isActive && "fa-beat"} />
      <Tooltip id="like-tooltip" place="top" type="dark" effect="float" />
    </button>
  );
}

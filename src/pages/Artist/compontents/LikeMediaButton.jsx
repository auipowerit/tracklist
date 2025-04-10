import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";

export default function LikeMediaButton(props) {
  const { isLiked, setIsLiked, id, category } = props;

  const { globalUser } = useAuthContext();

  const { likeContent, unlikeContent, updateGlobalUserLikes } =
    useAuthContext();

  async function handleLike() {
    if (!globalUser) return;

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
      <FontAwesomeIcon icon={faHeart} />
      <Tooltip id="like-tooltip" place="top" type="dark" effect="float" />
    </button>
  );
}

import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shared-buttons.scss";

export default function HeartButton(props) {
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
    <button onClick={handleLike} className={`heart-btn ${isLiked && "active"}`}>
      <FontAwesomeIcon icon={faHeart} className={isActive && "fa-beat"} />
    </button>
  );
}

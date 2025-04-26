import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shared-buttons.scss";

export default function HeartButton(props) {
  const { isLiked, setIsLiked, handleLike, likes, id, category } = props;

  const { globalUser } = useAuthContext();
  const { likeContent, unlikeContent, updateGlobalUserLikes } =
    useAuthContext();

  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(likes || 0);

  async function handleClick() {
    if (!globalUser) return;

    setIsLiked(!isLiked);
    setCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    if (!isLiked) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    isLiked
      ? await unlikeContent(id, globalUser.uid)
      : await likeContent(id, category, globalUser.uid);

    updateGlobalUserLikes(id, category);
    handleLike && (await handleLike(id, globalUser.uid));
  }

  return (
    <button
      onClick={handleClick}
      className={`heart-btn ${isLiked && "active"}`}
    >
      <FontAwesomeIcon icon={faHeart} className={isActive && "fa-beat"} />
      {likes && <p>{count}</p>}
    </button>
  );
}

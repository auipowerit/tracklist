import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LikeMediaButton(props) {
  const { user, isLiked, setIsLiked, id, category } = props;

  const { likeContent, unlikeContent } = useAuthContext();

  async function handleLike() {
    if (!user) return;

    isLiked
      ? await unlikeContent(id, user.id)
      : await likeContent(id, category, user.id);

    setIsLiked(!isLiked);
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 border-2 border-white px-2 py-1 ${isLiked && "bg-green-700"}`}
    >
      <FontAwesomeIcon icon={faHeart} />
      <p>{isLiked ? "Liked" : "Like"}</p>
    </button>
  );
}

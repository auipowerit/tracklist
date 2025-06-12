import { useAuthContext } from "src/features/auth/context/AuthContext";

export default function ReplyButton({ isReplying, setIsReplying }) {
  const { globalUser } = useAuthContext();

  function toggleReply(e) {
    e.stopPropagation();

    if (!globalUser) return;

    setIsReplying(!isReplying);
  }

  return (
    <button onClick={toggleReply} className="comment-card__buttons--reply">
      <p>Reply</p>
    </button>
  );
}

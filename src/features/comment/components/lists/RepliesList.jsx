import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "../cards/CommentCard";
import "./replies-list.scss";

export default function RepliesList(props) {
  const { comment, review, comments, setComments } = props;

  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="replies">
      <ToggleRepliesButton
        replies={comment.replies}
        showReplies={showReplies}
        setShowReplies={setShowReplies}
      />

      {showReplies && (
        <Replies
          replies={comment.replies}
          review={review}
          comments={comments}
          setComments={setComments}
        />
      )}
    </div>
  );
}

function ToggleRepliesButton({ replies, showReplies, setShowReplies }) {
  const arrowIcon = showReplies ? faChevronUp : faChevronDown;
  const label = `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`;

  return (
    <button
      className="replies__toggle"
      onClick={() => setShowReplies(!showReplies)}
    >
      <FontAwesomeIcon icon={arrowIcon} />
      {label}
    </button>
  );
}

function Replies({ replies, review, comments, setComments }) {
  return (
    <ul className="replies__list">
      {replies.map((replyId) => {
        const reply = comments.find((c) => c.id === replyId);
        if (!reply) return null;

        return (
          <li key={replyId} className="replies__item">
            <CommentCard
              comment={reply}
              review={review}
              comments={comments}
              setComments={setComments}
            />
          </li>
        );
      })}
    </ul>
  );
}

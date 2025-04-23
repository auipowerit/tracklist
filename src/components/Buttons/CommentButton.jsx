import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "src/styles/components/buttons.scss";

export default function CommentButton({review}) {
  return (
    <Link to={`/reviews/${review.id}`} className="comment-btn">
      <FontAwesomeIcon icon={faComment} />
      <p>{review?.comments.length || 0}</p>
    </Link>
  );
}

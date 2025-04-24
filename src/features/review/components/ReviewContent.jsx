import { Tooltip } from "react-tooltip";
import { getTimeSince } from "src/utils/date";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompactDisc,
  faMicrophoneLines,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/review-content.scss";

function ReviewUser({ review }) {
  return (
    <div className="review-user-container">
      <div className="review-user">
        <img src={review.profileUrl} />
        <p>{review.username}</p>
      </div>
      <p className="review-user-date">
        {getTimeSince(review.createdAt.toDate())}
      </p>
    </div>
  );
}

function ReviewMediaTitle({ title, subtitle, category }) {
  const icon =
    category === "track"
      ? faMusic
      : category === "album"
        ? faCompactDisc
        : faMicrophoneLines;

  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  return (
    <div className="review-media-container">
      <div className="review-title-container">
        <div
          data-tooltip-content={capitalizeFirstLetter(category)}
          data-tooltip-id="category-tooltip"
        >
          <FontAwesomeIcon icon={icon} className="review-icon" />
          <Tooltip
            id="category-tooltip"
            place="top"
            type="dark"
            effect="float"
          />
        </div>
        <p className="review-title">{title}</p>
      </div>

      <p className="review-subtitle">{subtitle}</p>
    </div>
  );
}

function ReviewStars({ rating = 0, size = 20 }) {
  rating = Math.round(rating * 2) / 2;

  function getStarColor(ratingValue) {
    return ratingValue <= rating ? "#ffc107" : "#94969c";
  }

  return (
    <div className="review-stars">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = rating === ratingValue - 0.5;

        return (
          <span key={i}>
            {isHalf ? (
              <FaStarHalfAlt size={size} color="#ffc107" />
            ) : (
              <FaStar size={size} color={getStarColor(ratingValue)} />
            )}
          </span>
        );
      })}
    </div>
  );
}

function ReviewContent({ review }) {
  return (
    <p className="review-card-text">
      {review.content.length > 150
        ? `${review.content.slice(0, 150)}...`
        : review.content}
    </p>
  );
}

export { ReviewUser, ReviewMediaTitle, ReviewStars, ReviewContent };

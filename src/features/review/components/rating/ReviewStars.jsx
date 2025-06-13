import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./review-stars.scss";

export default function ReviewStars({ rating = 0, size = 20 }) {
  const roundedRating = Math.round(rating * 2) / 2;

  const getStarColor = (ratingValue) => {
    return ratingValue <= roundedRating ? "#ffc107" : "#94969c";
  };

  return (
    <div className="review-stars">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = roundedRating === ratingValue - 0.5;

        return (
          <span key={i}>
            {isHalf ? (
              <FontAwesomeIcon
                icon={faStarHalfAlt}
                size={size}
                color="#ffc107"
                className="review-stars__star"
              />
            ) : (
              <FontAwesomeIcon
                icon={faStar}
                size={size}
                color={getStarColor(ratingValue)}
                className="review-stars__star"
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

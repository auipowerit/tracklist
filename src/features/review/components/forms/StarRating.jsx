import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(null);

  function getStarColor(ratingValue) {
    return ratingValue <= (hover || rating) ? "#ffc107" : "#94969c";
  }

  function handleMouseMove(e, ratingValue) {
    const starElement = e.target.getBoundingClientRect();
    const clickPosition = e.clientX;
    const starMidpoint = starElement.left + starElement.width / 2;

    setHover(clickPosition < starMidpoint ? ratingValue - 0.5 : ratingValue);
  }

  function handleMouseLeave() {
    setHover(null);
  }

  async function handleClick(ratingValue) {
    setRating(ratingValue);
  }

  return (
    <div className="review-form-rating">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = (hover || rating) === ratingValue - 0.5;

        return (
          <span
            key={i}
            className="review-form-rating-stars"
            onMouseMove={(event) => handleMouseMove(event, ratingValue)}
            onMouseLeave={handleMouseLeave}
          >
            {isHalf ? (
              <FontAwesomeIcon
                icon={faStarHalfAlt}
                color="#ffc107"
                onClick={() => handleClick(ratingValue - 0.5)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faStar}
                color={getStarColor(ratingValue)}
                onClick={() => handleClick(ratingValue)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

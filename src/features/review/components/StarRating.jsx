import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./styles/star-rating.scss";

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
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = (hover || rating) === ratingValue - 0.5;

        return (
          <span
            key={i}
            className="star-rating-star"
            onMouseMove={(event) => handleMouseMove(event, ratingValue)}
            onMouseLeave={handleMouseLeave}
          >
            {isHalf ? (
              <FaStarHalfAlt
                size={40}
                color="#ffc107"
                onClick={() => handleClick(ratingValue - 0.5)}
              />
            ) : (
              <FaStar
                size={40}
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

import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(null);

  function getStarColor(ratingValue) {
    return ratingValue <= (hover || rating) ? "#ffc107" : "#94969c";
  }

  function handleMouseMove(event, ratingValue) {
    const starElement = event.target.getBoundingClientRect();
    const clickPosition = event.clientX;
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
    <div className="flex items-center justify-center gap-1 p-4">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = (hover || rating) === ratingValue - 0.5;

        return (
          <span
            key={i}
            className="cursor-pointer transition-all duration-75"
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

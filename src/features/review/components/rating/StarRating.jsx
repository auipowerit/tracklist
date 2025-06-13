import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import "./star-rating.scss";

export default function StarRating({ rating, setRating, isModalOpen }) {
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!isModalOpen) {
      setHover(null);
    }
  }, [isModalOpen]);

  const getStarColor = (ratingValue) => {
    return ratingValue <= (hover || rating) ? "#ffc107" : "#94969c";
  };

  const handleMouseMove = (e, ratingValue) => {
    const starElement = e.target.getBoundingClientRect();
    const clickPosition = e.clientX;
    const starMidpoint = starElement.left + starElement.width / 2;

    setHover(clickPosition < starMidpoint ? ratingValue - 0.5 : ratingValue);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  const handleClick = (ratingValue) => {
    setRating(ratingValue);
  };

  return (
    <div className="star-rating">
      <p className="star-rating__title">Your rating</p>

      <div className="star-rating__stars">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          const isHalf = (hover || rating) === ratingValue - 0.5;

          return (
            <span
              key={i}
              onMouseMove={(e) => handleMouseMove(e, ratingValue)}
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
    </div>
  );
}

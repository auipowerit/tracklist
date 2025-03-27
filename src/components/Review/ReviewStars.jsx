import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ReviewStars({ rating = 0 }) {
  rating = Math.round(rating * 2) / 2;

  function getStarColor(ratingValue) {
    return ratingValue <= rating ? "#ffc107" : "#e4e5e9";
  }

  return (
    <div className="flex flex-row gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = rating === ratingValue - 0.5;

        return (
          <span key={i}>
            {isHalf ? (
              <FaStarHalfAlt size={20} color="#ffc107" />
            ) : (
              <FaStar size={20} color={getStarColor(ratingValue)} />
            )}
          </span>
        );
      })}
    </div>
  );
}

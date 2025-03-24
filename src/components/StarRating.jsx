import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useRatingContext } from "../context/Rating/RatingContext";

export default function StarRating({ albumId }) {
  const { globalUser } = useAuthContext();
  const { addRating, getAvgRating, getUserRating } = useRatingContext();

  const [avgRating, setAvgRating] = useState(0.0);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    async function fetchRatings() {
      const [avg, userRating] = await Promise.all([
        getAvgRating(albumId),
        globalUser ? getUserRating(albumId, globalUser.uid) : null,
      ]);

      setAvgRating(parseFloat(avg));
      setRating(userRating);
    }

    fetchRatings();
  }, [globalUser]);

  function getStarColor(ratingValue) {
    return ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9";
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
    if (!globalUser) return;

    setRating(ratingValue);
    const updatedAvg = await addRating(albumId, globalUser.uid, ratingValue);
    setAvgRating(parseFloat(updatedAvg));
  }

  return (
    <div className="flex items-center justify-center gap-1 p-4">
      <div className="flex flex-row">
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
                  size={30}
                  color="#ffc107"
                  onClick={() => handleClick(ratingValue - 0.5)}
                />
              ) : (
                <FaStar
                  size={30}
                  color={getStarColor(ratingValue)}
                  onClick={() => handleClick(ratingValue)}
                />
              )}
            </span>
          );
        })}
      </div>
      <p className="w-[60px] text-center text-2xl font-bold">
        ({avgRating.toFixed(1)})
      </p>
    </div>
  );
}

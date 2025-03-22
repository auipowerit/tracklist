import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
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

  async function giveStarRating(ratingValue) {
    if (!globalUser) return;

    setRating(ratingValue);
    const updatedAvg = await addRating(albumId, globalUser.uid, ratingValue);
    setAvgRating(parseFloat(updatedAvg));
  }

  return (
    <div className="flex items-center justify-center gap-1 p-4">
      <div className="flex flex-row gap-1">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          const color =
            ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9";

          return (
            <label key={i}>
              <input
                type="radio"
                name="album-rating"
                value={ratingValue}
                onClick={() => giveStarRating(ratingValue)}
                className="hidden"
              />
              <FaStar
                color={color}
                size={30}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer transition-all duration-75"
              />
            </label>
          );
        })}
      </div>
      <p className="text-2xl font-bold">({avgRating.toFixed(1)})</p>
    </div>
  );
}

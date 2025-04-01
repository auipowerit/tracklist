import { useEffect, useState } from "react";
import { useReviewContext } from "src/context/Review/ReviewContext";
import ReviewStars from "src/components/Review/ReviewStars";

export default function TrackCard({ number, track }) {
  const { getAvgRating } = useReviewContext();
  const [rating, setRating] = useState({});

  useEffect(() => {
    const fetchRating = async () => {
      const { avgRating, count } = await getAvgRating(track.id);

      setRating({ avgRating, count });
    };

    fetchRating();
  }, []);

  return (
    <div className="flex w-75 flex-col gap-2 border-1 border-white p-2 transition-all duration-150 hover:scale-110">
      {number}. {track.name}
      <div className="m-auto">
        <ReviewStars rating={rating?.avgRating || 0} />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function RatingBar({ mediaId }) {
  const { getRatings } = useReviewContext();

  const [ratings, setRatings] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (!mediaId) return;

        const fetchedRatings = await getRatings(mediaId);

        const ratings = {
          0.5: 0,
          1: 0,
          1.5: 0,
          2: 0,
          2.5: 0,
          3: 0,
          3.5: 0,
          4: 0,
          4.5: 0,
          5: 0,
        };

        fetchedRatings.docs.forEach((doc) => {
          const rating = doc.data().rating;
          rating in ratings ? ratings[rating]++ : (ratings[rating] = 1);
        });

        setRatings(ratings);
        setTotal(fetchedRatings.docs.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRatings();
  }, [mediaId]);

  return (
    <div className="flex h-12 items-end gap-[2px]">
      {ratings &&
        Object.keys(ratings)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .map((key) => (
            <div
              key={key}
              style={{ height: `${(ratings[key] / total) * 100}%` }}
              data-tooltip-id="media-tooltip"
              data-tooltip-content={`${ratings[key]} ratings of ${key} stars (${(ratings[key] / total).toFixed(2) * 100}%)`}
              className="min-h-0.5 w-4 cursor-pointer rounded-t-xs bg-gray-400 transition-all duration-300 hover:bg-gray-300"
            >
              <Tooltip
                id="media-tooltip"
                place="top"
                type="dark"
                effect="float"
              />
            </div>
          ))}
    </div>
  );
}

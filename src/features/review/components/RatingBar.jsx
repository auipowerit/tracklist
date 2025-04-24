import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useReviewContext } from "src/features/review/context/ReviewContext";

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
    <div className="media-rating-bar-container">
      {ratings &&
        Object.keys(ratings)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .map((key) => {
            const count = ratings[key];
            const percentage = (count / total).toFixed(2) * 100 || 0;
            const content = `${count} ratings of ${key} stars (${percentage}%)`;
            return (
              <div
                key={key}
                data-tooltip-id="media-tooltip"
                data-tooltip-content={content}
                style={{ height: `${percentage}%` }}
                className="media-rating-bar"
              >
                <div className="media-rating-bar-fill" />
                <Tooltip
                  id="media-tooltip"
                  place="top"
                  type="dark"
                  effect="float"
                />
              </div>
            );
          })}
    </div>
  );
}

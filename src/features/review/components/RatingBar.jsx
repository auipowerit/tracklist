import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useReviewContext } from "src/features/review/context/ReviewContext";

export default function RatingBar({ mediaId, setActiveTab, setFilter }) {
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

  function handleClick(key) {
    setActiveTab("reviews");
    setFilter(key);
  }

  return (
    <div className="media-banner__bar">
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
                data-tooltip-id="reviews-tooltip"
                data-tooltip-content={content}
                style={{ height: `${percentage}%` }}
                onClick={() => handleClick(key)}
                className="media-banner__bar--item"
              >
                <div className="media-banner__bar--fill" />
                <Tooltip
                  id="reviews-tooltip"
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

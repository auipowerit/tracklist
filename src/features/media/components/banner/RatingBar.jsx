import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import "./rating-bar.scss";

export default function RatingBar({ mediaId, setActiveTab, setFilter }) {
  const [ratings, setRatings] = useState(null);
  const [total, setTotal] = useState(0);

  const { getRatings } = useReviewContext();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (!mediaId) return;

        const baseRatings = {
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

        const fetchedRatings = await getRatings(mediaId);
        const totalRatings = fetchedRatings.docs.length;

        fetchedRatings.docs.forEach((doc) => {
          const rating = doc.data()?.rating || 0;

          // If rating is not in baseRatings, add it
          // otherwise, increment it
          rating in baseRatings
            ? baseRatings[rating]++
            : (baseRatings[rating] = 1);
        });

        setRatings(baseRatings);
        setTotal(totalRatings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRatings();
  }, [mediaId]);

  const handleClick = (key) => {
    setActiveTab("reviews");
    setFilter(key);
  };

  if (!ratings) {
    return;
  }

  return (
    <div className="rating-bar">
      {Object.keys(ratings)
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
              className="rating-bar__item"
            >
              <div className="rating-bar__fill" />
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

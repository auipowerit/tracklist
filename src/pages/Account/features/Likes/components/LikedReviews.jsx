import { useState, useEffect } from "react";
import FeedReviewCard from "src/components/Cards/FeedReviewCard";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function LikedReviews({ globalUser }) {
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await Promise.all(
        globalUser?.likes
          .filter((like) => like.category === "review")
          .flatMap((like) => like.content)
          .map(async (id) => {
            const review = await getReviewById(id);
            return review;
          }),
      ).then((values) => values.filter(Boolean));

      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, [globalUser]);

  return (
    <div>
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <FeedReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            You don't have any liked reviews yet.
          </p>
        ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";

export default function LikedReviews({ user }) {
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await Promise.all(
        user?.likes
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
  }, [user]);

  return (
    <div className="account-likes-reviews">
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="empty-message">There are no liked reviews yet!</p>
        ))}
    </div>
  );
}

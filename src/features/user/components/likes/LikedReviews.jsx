import { useState, useEffect } from "react";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";

export default function LikedReviews({ user }) {
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setReviews(null);

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

      const sortedReviews = fetchedReviews
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt);

      setReviews(sortedReviews);
      setIsLoading(false);
    };

    fetchReviews();

    return () => {
      setReviews(null);
    };
  }, [user]);

  if (isLoading) {
    return;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="empty__message">There are no liked reviews yet!</p>;
  }

  return (
    <div className="account-likes__reviews">
      {reviews.map((review) => {
        return <ReviewCard key={review.id} review={review} />;
      })}
    </div>
  );
}

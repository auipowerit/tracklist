import { useState, useEffect } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";

export default function LikedReviews({ user }) {
  const { getUserLikes } = useAuthContext();
  const { getReviewById } = useReviewContext();
  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setReviews(null);

    const fetchReviews = async () => {
      if (!user) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      const userLikes = await getUserLikes(user?.uid);
      if (!userLikes || userLikes["review"] === 0) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      const fetchedReviews = await Promise.all(
        userLikes["review"].map(async (id) => {
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

import { useEffect, useState } from "react";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ReviewCard from "src/features/review/components/cards/ReviewCard";
import { useReviewContext } from "src/features/review/context/ReviewContext";

export default function ReviewsList({ user }) {
  const { globalUser } = useAuthContext();
  const { getReviewsByUserId } = useReviewContext();

  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);

      try {
        const fetchedReviews = await getReviewsByUserId(user.uid);
        setReviews(fetchedReviews);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    reviews &&
    (reviews.length > 0 ? (
      <ul className="flex w-full flex-col gap-4">
        {reviews.map((review) => {
          return <ReviewCard key={review.id} review={review} />;
        })}
      </ul>
    ) : (
      <p className="m-20 text-center text-2xl text-gray-300 italic">
        There are no reviews yet!
      </p>
    ))
  );
}

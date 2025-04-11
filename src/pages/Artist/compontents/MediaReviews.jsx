import { useEffect, useState } from "react";
import SortReviews from "src/components/Sort/SortReviews";
import { useReviewContext } from "src/context/Review/ReviewContext";
import ReviewCard from "./ReviewCard";

export default function MediaReviews({ mediaId }) {
  const { getReviewsByMediaId } = useReviewContext();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    if (!mediaId) return;
    fetchReviews();
  }, [mediaId]);

  async function fetchReviews() {
    const fetchedReviews = await getReviewsByMediaId(mediaId);
    setReviews([...fetchedReviews].sort((a, b) => b.createdAt - a.createdAt));
  }

  return (
    <div className="flex flex-col gap-2 p-6">
      <Header setReviews={setReviews} reviews={reviews} />
      {reviews && <Reviews reviews={reviews} />}
    </div>
  );
}

function Header({ setReviews, reviews }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-2xl">User Reviews</p>
      <SortReviews reviews={reviews} setReviews={setReviews} />
    </div>
  );
}

function Reviews({ reviews }) {
  return (
    <div className="flex flex-col gap-6 border-t-1 border-white py-6">
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="py-20 text-center text-4xl italic">No reviews found!</p>
        ))}
    </div>
  );
}

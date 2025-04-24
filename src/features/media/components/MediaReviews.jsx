import { useEffect, useState } from "react";
import SortReviews from "src/features/sort/components/SortReviews";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import MediaReviewCard from "src/features/media/components/cards/MediaReviewCard";

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
    <div className="flex w-full flex-col gap-4">
      {reviews?.length > 0 && (
        <SortReviews reviews={reviews} setReviews={setReviews} />
      )}
      {reviews && <Reviews reviews={reviews} />}
    </div>
  );
}

function Reviews({ reviews }) {
  return (
    <div className="ml-6 flex flex-col gap-6">
      {reviews &&
        (reviews.length > 0 ? (
          reviews.map((review) => {
            return <MediaReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="py-20 text-center text-4xl italic">No reviews found!</p>
        ))}
    </div>
  );
}

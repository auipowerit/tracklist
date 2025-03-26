import Loading from "../components/Loading";
import ReviewCard from "../components/Reviews/ReviewCard";
import SortReviews from "../components/Sort/SortReviews";
import ReviewInput from "../components/Reviews/ReviewInput";
import { useReviewContext } from "../context/Review/ReviewContext";

export default function HomePage() {
  const { reviews } = useReviewContext();

  if (!reviews) {
    return <Loading />;
  }

  return (
    <div className="m-auto flex w-full flex-col items-center justify-center gap-4">
      {reviews && (
        <div className="w-2/3 border-x-1 border-white px-10">
          <SortReviews />
          <div className="mt-6 flex h-screen flex-col overflow-auto">
            {reviews.map((review) => {
              return <ReviewCard key={review.id} review={review} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

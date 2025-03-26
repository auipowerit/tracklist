import { useReviewContext } from "../../context/Review/ReviewContext";
import SortReviews from "../Sort/SortReviews";
import ReviewCard from "./ReviewCard";
import ReviewInput from "./ReviewInput";

export default function ReviewList() {
  const { reviews } = useReviewContext();

  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="h-full w-3/5 px-10">
        <ReviewInput />
        <SortReviews />
        <div className="mt-6 flex h-full flex-col overflow-auto border-t-1 border-white py-4">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              return <ReviewCard key={review.id} review={review} />;
            })
          ) : (
            <p className="py-20 text-center text-4xl italic">
              No reviews found!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

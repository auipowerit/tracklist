import ReviewCard from "../../components/Cards/ReviewCard";

export default function ReviewList({ reviews }) {
  return (
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <p className="text-2xl text-gray-400">Newest Reviews</p>
      <div className="overflow-y-scroll border-t-1 border-white py-10">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })
        ) : (
          <p className="py-20 text-center text-4xl italic">No reviews found!</p>
        )}
      </div>
    </div>
  );
}

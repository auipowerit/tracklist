import FeedReviewCard from "src/components/Cards/FeedReviewCard";

export default function FeedResults({ results }) {
  return (
    <div className="h-[80vh] w-full overflow-y-scroll border-t-1 border-white py-10">
      {results.length > 0 ? (
        results.map((review) => {
          return (
            <FeedReviewCard key={review.id} review={review} onPage={false} />
          );
        })
      ) : (
        <p className="py-20 text-center text-4xl italic">No reviews found!</p>
      )}
    </div>
  );
}

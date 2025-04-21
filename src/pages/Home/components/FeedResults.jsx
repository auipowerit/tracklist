import ReviewCard from "src/components/Cards/ReviewCard";

export default function FeedResults({ results }) {
  return (
    <div className="h-full w-full overflow-y-auto mask-y-from-90% py-10">
      {results.length > 0 ? (
        results.map((review) => {
          return <ReviewCard key={review.id} review={review} onPage={false} />;
        })
      ) : (
        <p className="py-20 text-center text-4xl italic">No reviews found!</p>
      )}
    </div>
  );
}

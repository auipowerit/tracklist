import ReviewCard from "src/components/Cards/ReviewCard";

export default function FeedResults({ results }) {
  return (
    <div className="h-[80vh] w-full overflow-y-auto border-t-1 border-white py-10">
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

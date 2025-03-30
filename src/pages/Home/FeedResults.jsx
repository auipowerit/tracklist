import ReviewCard from "../../components/Cards/ReviewCard";

export default function FeedResults({ results }) {
  return (
    <div className="overflow-y-scroll border-t-1 border-white py-10">
      {results.length > 0 ? (
        results.map((review) => {
          return <ReviewCard key={review.id} review={review} />;
        })
      ) : (
        <p className="py-20 text-center text-4xl italic">No reviews found!</p>
      )}
    </div>
  );
}

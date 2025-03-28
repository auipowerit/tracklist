import { useState } from "react";
import ReviewCard from "../../components/Cards/ReviewCard";
import PostButton from "../../components/Buttons/PostButton";

export default function ReviewList({ reviews }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <div className="flex items-center justify-between align-middle">
        <p className="text-2xl text-gray-400">Newest Reviews</p>
        <PostButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

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

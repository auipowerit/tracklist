import { useState } from "react";
import PostButton from "src/components/Buttons/PostButton";
import MediaReviewCard from "src/components/Cards/MediaReviewCard";

export default function MediaReviews({ mediaId, reviews, category }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-auto py-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between align-middle">
          <p className="text-2xl">User Reviews</p>

          <PostButton
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            mediaId={mediaId}
            category={category}
          />
        </div>

        <div className="flex-gap flex flex-col gap-6 overflow-y-scroll border-t-1 border-white py-10">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              return <MediaReviewCard key={review.id} review={review} />;
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

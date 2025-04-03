import { useState } from "react";
import PostButton from "src/components/Buttons/PostButton";
import MediaReviewCard from "src/components/Cards/MediaReviewCard";
import SortReviews from "src/components/Sort/SortReviews";

export default function MediaReviews(props) {
  const { mediaId, reviews, setReviews, category } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="flex items-center justify-between align-middle">
        <div className="flex items-center gap-4">
          <p className="text-2xl">User Reviews</p>
          <SortReviews reviews={reviews} setReviews={setReviews} />
        </div>

        <PostButton
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={mediaId}
          category={category}
        />
      </div>

      <div className="flex-gap flex flex-col gap-6 overflow-y-scroll border-t-1 border-white py-6">
        {reviews ? (
          reviews.length > 0 ? (
            reviews.map((review) => {
              return <MediaReviewCard key={review.id} review={review} />;
            })
          ) : (
            <p className="py-20 text-center text-4xl italic">
              No reviews found!
            </p>
          )
        ) : (
          <MediaReviewCard />
        )}
      </div>
    </div>
  );
}

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import PostButton from "src/components/Buttons/PostButton";
import Placeholder from "src/components/Placeholder";
import {
  ReviewContent,
  ReviewStars,
} from "src/components/Review/ReviewContent";
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

function MediaReviewCard({ review }) {
  return (
    <div className="flex gap-2">
      <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
      {review ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <ReviewStars review={review} showIcon={false} />
            <ReviewStars rating={review.rating || 0} />
          </div>

          <ReviewContent review={review} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Placeholder />
              <Placeholder />
            </div>
            <Placeholder />
          </div>
          <Placeholder />
        </div>
      )}
    </div>
  );
}
